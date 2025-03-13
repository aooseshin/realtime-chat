import useSWR from 'swr';
import { fetcher } from './utils';

export function useConversations() {
  return useSWR<WithData<API.Conversation[]>>('/api/conversations', fetcher, {
    refreshInterval: 5000,
  });
}

export function useConversation(id?: number) {
  return useSWR<
    WithData<Omit<API.Conversation, 'lastMessageTimestamp' | 'lastMessage'>>
  >(id ? `/api/conversations/${id}` : null, fetcher);
}
