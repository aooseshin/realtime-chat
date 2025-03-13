import useSWR, { SWRConfiguration } from 'swr';
import { fetcher } from './utils';

export function useMessages(
  conversationId?: number,
  options?: SWRConfiguration
) {
  return useSWR<WithData<API.Message[]>>(
    conversationId ? `/api/messages?conversationId=${conversationId}` : null,
    fetcher,
    {
      refreshInterval: 5000,
      ...options,
    }
  );
}

export function useConversation(id?: number) {
  return useSWR<
    WithData<Omit<API.Conversation, 'lastMessageTimestamp' | 'lastMessage'>>
  >(id ? `/api/conversations/${id}` : null, fetcher);
}
