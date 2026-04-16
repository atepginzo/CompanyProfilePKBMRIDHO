'use client';

import CrudFormPage from '@/components/admin/CrudFormPage';

const fields = [
  { key: 'judul_dokumen', label: 'Judul Dokumen', required: true },
  { key: 'deskripsi', label: 'Deskripsi', type: 'textarea', rows: 5 },
  {
    key: 'upload_file',
    label: 'Ganti File Dokumen',
    type: 'file',
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip',
    hint: 'Opsional. Jika diisi, file lama akan diganti.',
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

export default function EditDokumenPage() {
  return (
    <CrudFormPage
      mode="edit"
      resource="dokumen"
      title="Edit Dokumen"
      backHref="/admin/dokumen"
      fields={fields}
      initialValues={{ visibilitas: 'publik', status: 'aktif', ukuran_file: '0', tipe_file: 'pdf' }}
      fromData={(d) => ({
        judul_dokumen: d.judulDokumen || '',
        deskripsi: d.deskripsi || '',
        file_path: d.filePath || '',
        kategori: d.kategori || '',
        ukuran_file: String(d.ukuranFile ?? 0),
        tipe_file: d.tipeFile || 'pdf',
        visibilitas: d.visibilitas || 'publik',
        status: d.status || 'aktif',
      })}
      toPayload={(v) => ({ ...v, ukuran_file: parseInt(v.ukuran_file || '0', 10) || 0 })}
      validate={(v) => {
        if (!(v.judul_dokumen || '').trim()) return 'Judul dokumen wajib diisi';
        if (!(v.file_path || '').trim()) return 'Path file wajib diisi';
        return '';
      }}
    />
  );
}
