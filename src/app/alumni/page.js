'use client';

import { useEffect, useMemo, useState } from 'react';
import { publicAPI } from '@/lib/api';
import styles from './page.module.css';

const PAGE_SIZE = 12;
const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default function AlumniPublikPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(PAGE_SIZE));
    if (search) params.set('search', search);
    return params.toString();
  }, [page, search]);

  useEffect(() => {
    let mounted = true;

    publicAPI
      .getAlumni(query)
      .then((res) => {
        if (!mounted) return;
        setItems(res.data || []);
        setPagination(res.pagination || { page: 1, totalPages: 1 });
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
        setPagination({ page: 1, totalPages: 1 });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [query]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Portal Publik</p>
        <h1>Jejak Alumni</h1>
        <p>Profil singkat alumni dan perjalanan karier mereka setelah lulus.</p>
      </section>

      <section className={styles.filterBar}>
        <form
          className={styles.searchForm}
          onSubmit={(event) => {
            event.preventDefault();
            setLoading(true);
            setPage(1);
            setSearch(searchInput.trim());
          }}
        >
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari nama alumni atau pekerjaan..."
          />
          <button type="submit" className="btn btn-primary">Cari</button>
        </form>
      </section>

      <section className={styles.grid}>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <article key={index} className={styles.cardSkeleton} />)
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Data alumni belum tersedia</h3>
            <p>Coba kata kunci lain atau kembali lagi nanti.</p>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className={styles.card}>
              <h2>{item.nama}</h2>
              <p className={styles.meta}>Angkatan {item.angkatan}{item.tahunLulus ? ` • Lulus ${item.tahunLulus}` : ''}</p>
              {item.programStudi ? <p className={styles.meta}>Prodi: {item.programStudi}</p> : null}
              {item.pekerjaanSaatIni ? <p className={styles.job}>{item.pekerjaanSaatIni}</p> : null}
              {item.perusahaan ? <p className={styles.company}>{item.perusahaan}</p> : null}
              {item.testimoni ? <p className={styles.testimoni}>“{stripHtml(item.testimoni).slice(0, 140)}”</p> : null}
            </article>
          ))
        )}
      </section>

      {pagination.totalPages > 1 ? (
        <section className={styles.pagination}>
          <button
            className="btn btn-secondary"
            disabled={pagination.page <= 1}
            onClick={() => {
              setLoading(true);
              setPage((prev) => Math.max(1, prev - 1));
            }}
          >
            Sebelumnya
          </button>
          <span>Halaman {pagination.page} / {pagination.totalPages}</span>
          <button
            className="btn btn-secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => {
              setLoading(true);
              setPage((prev) => Math.min(pagination.totalPages, prev + 1));
            }}
          >
            Berikutnya
          </button>
        </section>
      ) : null}
    </div>
  );
}
