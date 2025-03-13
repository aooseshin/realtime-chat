import useSWR from 'swr';
import { fetcher } from './utils';

export function useUsers() {
  return useSWR<WithData<API.User[]>>('/api/users', fetcher);
}
