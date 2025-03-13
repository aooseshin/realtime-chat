export const fetcher = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};
