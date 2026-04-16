'use client';

import CrudFormPage from '@/components/admin/CrudFormPage';

const fields = [
  { key: 'judul_dokumen', label: 'Judul Dokumen', required: true },
  { key: 'deskripsi', label: 'Deskripsi', type: 'textarea', rows: 5 },
  {
    key: 'upload_file',
    label: 'Upload Dokumen',
    type: 'file',
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip',
    hint: 'Format: pdf/doc/docx/xls/xlsx/ppt/pptx/txt/zip (maks 20MB)',
    uploadFolder: 'dokumen',
    uploadTargetKey: 'file_path',
    uploadMetaMap: {
      ukuran_file: 'size',
      tipe_file: 'mimeType',
    },
  },
  { key: 'file_path', label: 'Path File / URL', required: true },
  { key: 'kategori', label: 'Kategori' },
  { key: 'ukuran_file', label: 'Ukuran File (bytes)', type: 'number' },
  { key: 'tipe_file', label: 'Tipe File (ext)' },
  {
    key: 'visibilitas',
    label: 'Visibilitas',
    type: 'select',
    options: [
      { value: 'publik', label: 'Publik' },
      { value: 'internal', label: 'Internal' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'aktif', label: 'Aktif' },
      { value: 'nonaktif', label: 'Nonaktif' },
    ],
  },
];

export default function TambahDokumenPage() {
  return (
    <CrudFormPage
      mode="create"
      resource="dokumen"
      title="Tambah Dokumen"
      backHref="/admin/dokumen"
      fields={fields}
      initialValues={{ visibilitas: 'publik', status: 'aktif', ukuran_file: '0', tipe_file: 'pdf' }}
      toPayload={(v) => ({ ...v, ukuran_file: parseInt(v.ukuran_file || '0', 10) || 0 })}
      validate={(v) => {
        if (!(v.judul_dokumen || '').trim()) return 'Judul dokumen wajib diisi';
        if (!(v.file_path || '').trim()) return 'Path file wajib diisi';
        return '';
      }}
    />
  );
}
