const Groq = require('groq-sdk');

const PROMPT = `Você é um especialista em leitura de boletos bancários brasileiros.
Extraia do boleto: cedente/beneficiário (nome da empresa), valor total, data de vencimento.
Responda SOMENTE com JSON válido no formato:
{"fornecedor":"Nome da Empresa","valor":"1234.56","vencimento":"YYYY-MM-DD"}
Se não encontrar um campo, use null. Não inclua texto fora do JSON.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, mimeType } = req.body;

  if (!image || !mimeType) {
    return res.status(400).json({ error: 'image and mimeType are required' });
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
      return res.status(200).json({ fornecedor: null, valor: null, vencimento: null });
    }

    const parsed = JSON.parse(match[0]);
    return res.status(200).json({
      fornecedor: parsed.fornecedor ?? null,
      valor: parsed.valor ?? null,
      vencimento: parsed.vencimento ?? null
    });
  } catch (err) {
    console.error('OCR error:', err);
    return res.status(500).json({ error: 'OCR failed', detail: err.message });
  }
};
