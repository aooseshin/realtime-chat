/* eslint-disable @typescript-eslint/no-explicit-any */
export function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}

export async function call<T>(
  api: Promise<T> | (() => Promise<T>)
): Promise<[Awaited<T> | null, any]> {
  try {
    const res = await (api instanceof Promise ? api : api());
    return [res, null];
  } catch (err: any) {
    if (err?.response) {
      return [null, err.response.data];
    }
    return [null, err];
  }
}
