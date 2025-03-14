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
      const data = await sql`
            SELECT 
                c.*,
                COALESCE(json_agg(json_build_object(
                    'userId', u.id,
                    'user', u.name,
                    'avatar', u.avatar
                )) FILTER (WHERE u.id IS NOT NULL), '[]') AS participants,
                lm.message AS "lastMessage",
                lm.timestamp AS "lastMessageTimestamp"
            FROM conversations c
            LEFT JOIN conversation_user cu ON c.id = cu.conversation_id
            LEFT JOIN users u ON cu.user_id = u.id
            LEFT JOIN LATERAL (
                SELECT m.message, m.timestamp
                FROM messages m
                WHERE m.conversation_id = c.id 
                  AND m.message_type <> 'system'
                ORDER BY m.timestamp DESC
                LIMIT 1
            ) lm ON true
            GROUP BY c.id, lm.message, lm.timestamp
            ORDER BY "lastMessageTimestamp" DESC;
        `;
      res.status(200).json({ data });
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}
