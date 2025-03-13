import type { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  const sql = neon(process.env.DATABASE_URL);

  async function getLastUserId() {
    const result = await sql`
    SELECT id FROM users 
    ORDER BY id DESC 
    LIMIT 1;
  `;

    return result.length > 0 ? result[0].id : 0;
  }

  switch (req.method) {
    case 'GET': {
      const data = await sql`
          select * from users 
        `;
      res.status(200).json({ data });
      break;
    }
    case 'POST': {
      const { name } = req.body;

      const lastUserId = await getLastUserId();
      const avatar = `https://i.pravatar.cc/150?img=${lastUserId + 1}`;
      const data = await sql`
          INSERT INTO users (name, avatar) 
          VALUES (${name}, ${avatar}) 
          RETURNING *;
        `;
      res.status(200).json({ data: data[0] });
      break;
    }
    case 'DELETE': {
      const { id } = req.body;
      await sql`
          DELETE FROM users 
          WHERE id = ${id};
        `;
      res.status(200).json({ data: 'Success' });
      break;
    }
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}
