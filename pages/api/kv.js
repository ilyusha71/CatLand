import { createClient } from 'redis';

let client;

async function getClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_TOKEN
    });
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  const redis = await getClient();

  if (req.method === 'POST') {
    const { key, value } = req.body;
    if (!key || !value) return res.status(400).json({ error: 'key and value required' });
    await redis.set(key, value);
    return res.json({ ok: true, key, value });
  }

  if (req.method === 'GET') {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'key required' });
    const value = await redis.get(key);
    return res.json({ key, value: value || null });
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
