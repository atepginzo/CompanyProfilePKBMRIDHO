'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import FormInput from '@/components/admin/FormInput';
import FormTextarea from '@/components/admin/FormTextarea';
import FormSelect from '@/components/admin/FormSelect';
import FormFileUpload from '@/components/admin/FormFileUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useToast } from '@/context/ToastContext';

export default function CrudFormPage({
  mode,
  resource,
  title,
  backHref,
  fields,
  initialValues,
  toPayload,
  fromData,
  validate,
}) {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === 'edit');
  const [values, setValues] = useState(initialValues || {});

  useEffect(() => {
    if (mode !== 'edit') return;

    adminAPI
      .getOne(resource, params.id)
      .then((res) => {
        const data = fromData ? fromData(res.data) : res.data;
        setValues(data);
      })
      .catch(() => {
        toast.error('Gagal memuat data');
        router.push(backHref);
      })
      .finally(() => setInitialLoading(false));
  }, [mode, resource, params.id, fromData, toast, router, backHref]);

  const submitLabel = useMemo(() => {
    if (loading) return 'Menyimpan...';
    return mode === 'edit' ? 'Update' : 'Simpan';
  }, [loading, mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate) {
      const message = validate(values);
      if (message) {
        toast.error(message);
        return;
      }
    }

    setLoading(true);
    try {
      const valuesWithUpload = { ...values };
      const fileFields = fields.filter((field) => field.type === 'file');

      for (const field of fileFields) {
        const fileValue = valuesWithUpload[field.key];
        if (!(fileValue instanceof File)) continue;

        const upload = await adminAPI.upload({
          file: fileValue,
          folder: field.uploadFolder || resource,
          maxWidth: field.maxWidth,
          quality: field.quality,
        });

        const targetKey = field.uploadTargetKey || field.key;
        valuesWithUpload[targetKey] = upload.data?.url || '';

        if (field.uploadMetaMap && upload.data) {
          Object.entries(field.uploadMetaMap).forEach(([payloadKey, responseKey]) => {
            valuesWithUpload[payloadKey] = upload.data[responseKey];
          });
        }

        delete valuesWithUpload[field.key];
      }

      const payload = toPayload ? toPayload(valuesWithUpload) : valuesWithUpload;

      if (mode === 'edit') {
        await adminAPI.update(resource, params.id, payload);
        toast.success('Data berhasil diperbarui');
      } else {
        await adminAPI.create(resource, payload);
        toast.success('Data berhasil ditambahkan');
      }

      router.push(backHref);
    } catch (error) {
      toast.error(error.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  if (initialLoading) {
    return <div className="card" style={{ padding: 'var(--space-6)' }}>Memuat data...</div>;
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 'var(--space-5)' }}>{title}</h2>

        {fields.map((field) => {
          if (field.type === 'textarea') {
            return (
              <FormTextarea
                key={field.key}
                id={field.key}
                label={field.label}
                required={field.required}
                value={values[field.key] ?? ''}
                onChange={(event) => setField(field.key, event.target.value)}
                rows={field.rows || 5}
                placeholder={field.placeholder || ''}
              />
            );
          }

          if (field.type === 'select') {
            return (
              <FormSelect
                key={field.key}
                id={field.key}
                label={field.label}
                required={field.required}
                value={values[field.key] ?? ''}
                onChange={(event) => setField(field.key, event.target.value)}
                options={field.options || []}
              />
            );
          }

          if (field.type === 'file') {
            return (
              <FormFileUpload
                key={field.key}
                id={field.key}
                label={field.label}
                required={field.required}
                accept={field.accept || '*/*'}
                hint={field.hint || ''}
                file={values[field.key] instanceof File ? values[field.key] : null}
                onChange={(file) => setField(field.key, file)}
                onRemove={() => setField(field.key, null)}
              />
            );
          }

          if (field.type === 'richtext') {
            return (
              <RichTextEditor
                key={field.key}
                id={field.key}
                label={field.label}
                required={field.required}
                value={values[field.key] ?? ''}
                onChange={(html) => setField(field.key, html)}
                placeholder={field.placeholder || ''}
                hint={field.hint || ''}
              />
            );
          }

          return (
            <FormInput
              key={field.key}
              id={field.key}
              type={field.type || 'text'}
              label={field.label}
              required={field.required}
              value={values[field.key] ?? ''}
              onChange={(event) => setField(field.key, event.target.value)}
              placeholder={field.placeholder || ''}
            />
          );
        })}

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {submitLabel}
          </button>
          <Link href={backHref} className="btn btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
