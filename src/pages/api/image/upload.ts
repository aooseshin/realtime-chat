import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });
  try {
    const [, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ message: 'File not found' });
    }
    const fileData = await fs.readFile(file.filepath);

    const blob = await put(file.originalFilename || 'upload.jpg', fileData, {
      access: 'public',
    });

    return res.status(200).json({ data: blob.url });
  } catch (error) {
    console.error('File upload failed', error);
    return res.status(500).json({ message: 'File upload failed' });
  }
}
