import { api } from './utils';

const users = {
  createAccount: (name: string) =>
    api<WithData<API.User>>('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
};

export default users;
