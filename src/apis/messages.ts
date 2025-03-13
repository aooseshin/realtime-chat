import { api } from './utils';

const users = {
  createMessage: (
    conversationId: number,
    params: {
      userId: number;
      message: string;
      messageType: 'text' | 'image';
    }
  ) =>
    api<WithData<API.SimpleMessage>>(
      `/api/conversations/${conversationId}/messages/create`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    ),
  toggleReaction: (params: {
    messageId: number;
    userId: number;
    reactionType: string;
  }) =>
    api<WithData<string>>('/api/messages/reaction', {
      method: 'PUT',
      body: JSON.stringify(params),
    }),
};

export default users;
