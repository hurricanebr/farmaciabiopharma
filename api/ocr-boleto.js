const Groq = require('groq-sdk');

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_BYTES = 1_500_000; // ~1 MB decoded

const PROMPT = `Você é um especialista em leitura de boletos bancários brasileiros.
Extraia do boleto: cedente/beneficiário (nome da empresa), valor total, data de vencimento.
Responda SOMENTE com JSON válido no formato:
{"fornecedor":"Nome da Empresa","valor":"1234.56","vencimento":"YYYY-MM-DD"}
Se não encontrar um campo, use null. Não inclua texto fora do JSON.`;

const NULL_RESULT = { fornecedor: null, valor: null, vencimento: null };

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const { image, mimeType } = req.body;

  if (!image || !mimeType) {
    return res.status(400).json({ error: 'image and mimeType are required' });
  }

  if (!ALLOWED_MIME.includes(mimeType)) {
    return res.status(400).json({ error: 'Unsupported mimeType' });
  }

  if (image.length > MAX_IMAGE_BYTES) {
    return res.status(413).json({ error: 'Image too large' });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${image}` }
          },
          { type: 'text', text: PROMPT }
        ]
      }],
      max_tokens: 256,
      temperature: 0.1
    });

    const text = completion.choices[0].message.content || '';
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return res.status(200).json(NULL_RESULT);
    }

    try {
      const parsed = JSON.parse(match[0]);
      return res.status(200).json({
        fornecedor: parsed.fornecedor ?? null,
        valor: parsed.valor ?? null,
        vencimento: parsed.vencimento ?? null
      });
    } catch {
      return res.status(200).json(NULL_RESULT);
    }
  } catch (err) {
    console.error('OCR error:', err);
    return res.status(500).json({ error: 'OCR failed' });
  }
};
