import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Désactive le bodyParser de Next.js pour gérer le form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), '/public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = new formidable.IncomingForm({ uploadDir, keepExtensions: true, maxFileSize: 10 * 1024 * 1024 });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Erreur upload', details: err });
    const uploaded: any[] = [];
    Object.values(files).forEach((file: any) => {
      const f = Array.isArray(file) ? file[0] : file;
      uploaded.push({
        name: f.originalFilename,
        url: `/uploads/${path.basename(f.filepath)}`,
        type: f.mimetype,
        size: f.size,
      });
    });
    res.status(200).json({ files: uploaded });
  });
}
