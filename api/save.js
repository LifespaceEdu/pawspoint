import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { code, name, progress } = req.body;
  if (!code || !name) {
    return res.status(400).json({ error: 'Missing code or name' });
  }

  await redis.set('dog:' + code.toUpperCase(), {
    name: name,
    progress: progress || { station: 0, look: 0, tuck: 0, chin: 0, middle: 0, paws: 0 }
  });

  return res.json({ ok: true });
}
