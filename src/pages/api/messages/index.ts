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

  const { conversationId } = req.query;

  if (!conversationId) {
    return res.status(400).json({ message: 'Conversation ID is required' });
  }

  const sql = neon(process.env.DATABASE_URL);

  switch (req.method) {
    case 'GET':
      const data = await sql`
        SELECT 
            m.id,
            m.conversation_id AS "conversationId",
            m.user_id AS "userId",
            u.name AS "user",
            u.avatar,
            m.message_type AS "messageType",
            m.message,
            COALESCE((
                SELECT jsonb_build_object(
                    'like', COUNT(*) FILTER (WHERE mr.reaction_type = 'like'),
                    'love', COUNT(*) FILTER (WHERE mr.reaction_type = 'love'),
                    'laugh', COUNT(*) FILTER (WHERE mr.reaction_type = 'laugh')
                )
                FROM message_reaction mr
                WHERE mr.message_id = m.id
            ), '{}'::jsonb) AS "reactions",
            COALESCE((
                SELECT jsonb_object_agg(
                    t.reaction_type, COALESCE(r.user_ids, '{}')  -- 若無資料則回傳空陣列
                )
                FROM (
                    VALUES ('like'), ('love'), ('laugh')  -- 先定義所有 reactionType
                ) AS t(reaction_type)
                LEFT JOIN (
                    SELECT 
                        mr.reaction_type,
                        ARRAY_AGG(mr.user_id) AS user_ids
                    FROM message_reaction mr
                    WHERE mr.message_id = m.id
                    GROUP BY mr.reaction_type
                ) r ON t.reaction_type = r.reaction_type
            ), '{}'::jsonb) AS "reactionUsers",
            m."timestamp"
        FROM messages m
        LEFT JOIN users u ON m.user_id = u.id
        WHERE m.conversation_id = ${conversationId}
        ORDER BY m."timestamp" DESC;
        `;
      res.status(200).json({ data });
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}
