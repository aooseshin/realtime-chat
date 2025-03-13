// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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

  switch (req.method) {
    case 'GET':
      const { id } = req.query;

      const data = await sql`
            SELECT 
                c.*,
                COALESCE(json_agg(json_build_object(
                    'userId', u.id,
                    'user', u.name,
                    'avatar', u.avatar
                )) FILTER (WHERE u.id IS NOT NULL), '[]') AS participants
            FROM conversations c
            LEFT JOIN conversation_user cu ON c.id = cu.conversation_id
            LEFT JOIN users u ON cu.user_id = u.id
            WHERE c.id = ${id}
            GROUP BY c.id;
        `;

      if (!data.length) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      res.status(200).json({ data: data[0] });
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}
