const handler = require('../api/ocr-boleto');

function mockReq(body, method = 'POST') {
  return { method, body };
}

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: '{"fornecedor":"Distribuidora ABC","valor":"1200.00","vencimento":"2026-06-15"}'
            }
          }]
        })
      }
    }
  }));
});

test('extrai campos do boleto com sucesso', async () => {
  const req = mockReq({ image: 'base64data', mimeType: 'image/jpeg' });
  const res = mockRes();
  await handler(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    fornecedor: 'Distribuidora ABC',
    valor: '1200.00',
    vencimento: '2026-06-15'
  });
});

test('retorna 405 para métodos não-POST', async () => {
  const req = mockReq({}, 'GET');
  const res = mockRes();
  await handler(req, res);
  expect(res.status).toHaveBeenCalledWith(405);
});

test('lida com JSON malformado do Groq', async () => {
  const Groq = require('groq-sdk');
  Groq.mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Não consegui extrair os dados.' } }]
        })
      }
    }
  }));
  const req = mockReq({ image: 'base64data', mimeType: 'image/jpeg' });
  const res = mockRes();
  await handler(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    fornecedor: null,
    valor: null,
    vencimento: null
  });
});
