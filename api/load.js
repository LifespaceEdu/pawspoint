import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET only' });
  }

  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  const data = await redis.get('dog:' + code.toUpperCase());
  if (!data) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.json(data);
}
