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
    case 'PUT': {
      const { messageId, reactionType, userId } = req.body;

      if (!messageId || !reactionType || !userId) {
        return res.status(400).json({
          message: 'Message ID, Reaction Type, and User ID are required',
        });
      }

      const reactions = await sql`
        SELECT * FROM message_reaction WHERE message_id = ${messageId} AND user_id = ${userId} AND reaction_type = ${reactionType}
      `;

      if (reactions.length > 0) {
        await sql`
          DELETE FROM message_reaction WHERE message_id = ${messageId} AND user_id = ${userId} AND reaction_type = ${reactionType}
        `;
      } else {
        await sql`
          INSERT INTO message_reaction (message_id, user_id, reaction_type)
          VALUES (${messageId}, ${userId}, ${reactionType})
        `;
      }

      res.status(200).json({ data: 'success' });
      break;
    }
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}
