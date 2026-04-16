import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { withAuth } from '@/lib/middleware';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DOC_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOC_SIZE = 20 * 1024 * 1024;

function sanitizeFolderName(name) {
  return String(name || 'umum')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '')
    .slice(0, 50) || 'umum';
}

function getExtFromMime(mimeType) {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'application/msword') return 'doc';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  if (mimeType === 'application/vnd.ms-excel') return 'xls';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return 'xlsx';
  if (mimeType === 'application/vnd.ms-powerpoint') return 'ppt';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return 'pptx';
  if (mimeType === 'text/plain') return 'txt';
  if (mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed') return 'zip';
  return '';
}

export async function POST(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = sanitizeFolderName(formData.get('folder') || 'umum');

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'File wajib diunggah' } },
        { status: 400 }
      );
    }

    const isImage = IMAGE_MIME_TYPES.includes(file.type);
    const isDocument = DOC_MIME_TYPES.includes(file.type);

    if (!isImage && !isDocument) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNSUPPORTED_TYPE',
            message: 'Tipe file tidak didukung. Gunakan gambar (jpg/png/webp) atau dokumen umum (pdf/doc/xls/ppt/txt/zip).',
          },
        },
        { status: 400 }
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOC_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: isImage ? 'Ukuran gambar maksimal 5MB' : 'Ukuran dokumen maksimal 20MB',
          },
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const diskDir = path.join(process.cwd(), 'public', 'uploads', folder, year, month);
    await mkdir(diskDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let outputBuffer = buffer;
    let outputExt = getExtFromMime(file.type);
    let width = null;
    let height = null;

    if (isImage) {
      const maxWidthInput = Number(formData.get('max_width') || 1920);
      const qualityInput = Number(formData.get('quality') || 82);
      const maxWidth = Number.isFinite(maxWidthInput) ? Math.min(Math.max(maxWidthInput, 640), 3840) : 1920;
      const quality = Number.isFinite(qualityInput) ? Math.min(Math.max(qualityInput, 60), 95) : 82;

      const transformed = await sharp(buffer)
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer({ resolveWithObject: true });

      outputBuffer = transformed.data;
      outputExt = 'webp';
      width = transformed.info.width || null;
      height = transformed.info.height || null;
    }

    const fileName = `${Date.now()}-${randomUUID()}.${outputExt}`;
    const diskPath = path.join(diskDir, fileName);
    await writeFile(diskPath, outputBuffer);

    const publicPath = `/uploads/${folder}/${year}/${month}/${fileName}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          url: publicPath,
          fileName,
          mimeType: isImage ? 'image/webp' : file.type,
          size: outputBuffer.length,
          originalName: file.name,
          isImage,
          width,
          height,
        },
        message: 'File berhasil diunggah',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Upload file error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengunggah file' } },
      { status: 500 }
    );
  }
}
