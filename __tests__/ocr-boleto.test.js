const handler = require('../api/ocr-boleto');

const ORIG_ENV = process.env;

const mockCreate = jest.fn();

jest.mock('groq-sdk', () => {
  return jest.fn(() => ({
    chat: { completions: { create: (...args) => mockCreate(...args) } }
  }));
});

const SUCCESS_RESPONSE = {
  choices: [{ message: { content: '{"fornecedor":"Distribuidora ABC","valor":"1200.00","vencimento":"2026-06-15"}' } }]
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...ORIG_ENV, GROQ_API_KEY: 'test-key' };
  mockCreate.mockResolvedValue(SUCCESS_RESPONSE);
});

afterEach(() => {
  process.env = ORIG_ENV;
});

function mockReq(body, method = 'POST') {
  return { method, body };
}

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

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

test('retorna 400 se image não enviada', async () => {
  const req = mockReq({ mimeType: 'image/jpeg' });
  const res = mockRes();
  await handler(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('retorna 400 se mimeType não enviado', async () => {
  const req = mockReq({ image: 'base64data' });
  const res = mockRes();
  await handler(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('retorna 400 para mimeType não permitido', async () => {
  const req = mockReq({ image: 'base64data', mimeType: 'image/gif' });
  const res = mockRes();
  await handler(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('retorna 413 para imagem muito grande', async () => {
  const req = mockReq({ image: 'x'.repeat(1_500_001), mimeType: 'image/jpeg' });
  const res = mockRes();
  await handler(req, res);
  expect(res.status).toHaveBeenCalledWith(413);
});

test('retorna 500 se GROQ_API_KEY ausente', async () => {
  delete process.env.GROQ_API_KEY;
  const req = mockReq({ image: 'base64data', mimeType: 'image/jpeg' });
  const res = mockRes();
  await handler(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'Server misconfiguration' });
});

test('lida com resposta não-JSON do Groq retornando nulls', async () => {
  mockCreate.mockResolvedValueOnce({
    choices: [{ message: { content: 'Não consegui extrair os dados.' } }]
  });
  const req = mockReq({ image: 'base64data', mimeType: 'image/jpeg' });
  const res = mockRes();
  await handler(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ fornecedor: null, valor: null, vencimento: null });
});
