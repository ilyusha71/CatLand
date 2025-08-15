import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS 设置（可让网页访问）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: '缺少 key 参数' });
    const value = await kv.get(key);
    return res.json({ key, value });
  }

  if (req.method === 'POST') {
    const { key, value } = req.body || {};
    if (!key || typeof value === 'undefined') {
      return res.status(400).json({ error: '缺少 key 或 value' });
    }
    await kv.set(key, value);
    return res.json({ ok: true, key, value });
  }

  if (req.method === 'DELETE') {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: '缺少 key 参数' });
    await kv.del(key);
    return res.json({ ok: true, key });
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
