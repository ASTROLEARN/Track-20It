import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { DemoResponse } from '../shared/api';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const response: DemoResponse = {
    message: "Hello from Express server",
  };
  
  res.status(200).json(response);
}