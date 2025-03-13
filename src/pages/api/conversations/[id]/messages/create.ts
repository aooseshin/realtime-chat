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
    case 'POST': {
      const { id } = req.query;
      const { userId, messageType = 'text', message = '' } = req.body;

      if (!id || !userId) {
        return res
          .status(400)
          .json({ message: 'Conversation ID and User ID are required' });
      }

      const conversations = await sql`
        SELECT * FROM conversations WHERE id = ${id}
      `;

      const conversation = conversations[0];

      if (!conversation) {
        return res
          .status(404)
          .json({ message: 'The conversation does not exist' });
      }

      const joinConversation = await sql`
        SELECT * FROM conversation_user WHERE conversation_id = ${id} AND user_id = ${userId}
      `;

      if (joinConversation.length === 0) {
        await sql`
            INSERT INTO conversation_user (conversation_id, user_id)
            VALUES (${id}, ${userId})
            RETURNING *;
          `;

        await sql`
          INSERT INTO messages (conversation_id, user_id, message_type, message)
          VALUES (${id}, ${userId}, 'system', 'System message: A user has joined the conversation!')
          RETURNING *;
        `;
      }

      const messages = await sql`
        INSERT INTO messages (conversation_id, user_id, message_type, message)
        VALUES (${id}, ${userId}, ${messageType}, ${message})
        RETURNING *;
      `;

      if (messages.length === 0) {
        return res.status(400).json({ message: 'Failed to add message' });
      }

      res.status(200).json({
        data: {
          id: messages[0].id,
          conversationId: messages[0].conversation_id,
          userId: messages[0].user_id,
          messageType: messages[0].message_type,
          message: messages[0].message,
          timestamp: messages[0].timestamp,
        },
      });
      break;
    }
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}
