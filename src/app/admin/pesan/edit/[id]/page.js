'use client';

import CrudFormPage from '@/components/admin/CrudFormPage';

const fields = [
  { key: 'nama_pengirim', label: 'Nama Pengirim', required: true },
  { key: 'email_pengirim', label: 'Email Pengirim', type: 'email', required: true },
  { key: 'telepon_pengirim', label: 'Telepon Pengirim' },
  { key: 'subjek', label: 'Subjek', required: true },
  { key: 'isi_pesan', label: 'Isi Pesan', type: 'textarea', required: true, rows: 8 },
  {
    key: 'tipe_pesan',
    label: 'Tipe Pesan',
    type: 'select',
    options: [
      { value: 'kontak', label: 'Kontak' },
      { value: 'pengaduan', label: 'Pengaduan' },
      { value: 'saran', label: 'Saran' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'unread', label: 'Belum Dibaca' },
      { value: 'read', label: 'Sudah Dibaca' },
      { value: 'archived', label: 'Arsip' },
    ],
  },
];

export default function EditPesanPage() {
  return (
    <CrudFormPage
      mode="edit"
      resource="pesan"
      title="Detail Pesan"
      backHref="/admin/pesan"
      fields={fields}
      initialValues={{ tipe_pesan: 'kontak', status: 'unread' }}
      fromData={(d) => ({
        nama_pengirim: d.namaPengirim || '',
        email_pengirim: d.emailPengirim || '',
        telepon_pengirim: d.teleponPengirim || '',
        subjek: d.subjek || '',
        isi_pesan: d.isiPesan || '',
        tipe_pesan: d.tipePesan || 'kontak',
        status: d.status || 'unread',
      })}
      validate={(v) => {
        if (!(v.nama_pengirim || '').trim()) return 'Nama pengirim wajib diisi';
        if (!(v.email_pengirim || '').trim()) return 'Email pengirim wajib diisi';
        if (!(v.subjek || '').trim()) return 'Subjek wajib diisi';
        if (!(v.isi_pesan || '').trim()) return 'Isi pesan wajib diisi';
        return '';
      }}
    />
  );
}
