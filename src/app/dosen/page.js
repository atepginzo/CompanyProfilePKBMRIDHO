'use client';

import { useEffect, useMemo, useState } from 'react';
import { publicAPI } from '@/lib/api';
import { DUMMY_DOSEN } from '@/data/dummyData';
import styles from './page.module.css';

const PAGE_SIZE = 12;
const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default function TenagaPendidikPage() {
  const [items, setItems] = useState(DUMMY_DOSEN);
  const [loading, setLoading] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
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
      .getDosen(query)
      .then((res) => {
        if (!mounted) return;
        const data = res.data || [];
        if (data.length > 0) {
          setItems(data);
        } else if (!apiLoaded && !search && page === 1) {
          setItems(DUMMY_DOSEN);
        } else {
          setItems([]);
        }
        setPagination(res.pagination || { page: 1, totalPages: 1 });
        setApiLoaded(true);
      })
      .catch(() => {
        if (!mounted) return;
        if (!apiLoaded && !search && page === 1) {
          setItems(DUMMY_DOSEN);
        } else {
          setItems([]);
        }
        setPagination({ page: 1, totalPages: 1 });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [apiLoaded, page, query, search]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Tentang Kami</p>
        <h1>Tenaga Pendidik</h1>
        <p>Daftar tenaga pendidik PKBM RIDHO yang berdedikasi dan berpengalaman di bidang pendidikan nonformal.</p>
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
            placeholder="Cari nama tenaga pendidik..."
          />
          <button type="submit" className="btn btn-primary">Cari</button>
        </form>
      </section>

      <section className={styles.grid}>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <article key={index} className={styles.cardSkeleton} />)
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Data tenaga pendidik belum tersedia</h3>
            <p>Coba kata kunci lain atau kembali lagi nanti.</p>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className={styles.card}>
              {item.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.foto} alt={item.namaLengkap} className={styles.avatar} />
              ) : (
                <div className={styles.avatarFallback}>{item.namaLengkap?.charAt(0) || 'P'}</div>
              )}
              <h2>{item.namaLengkap}</h2>
              <p className={styles.job}>{item.jabatanFungsional || item.jabatanStruktural || 'Pendidik'}</p>
              {item.programStudi ? <p className={styles.meta}>Program: {item.programStudi}</p> : null}
              {item.bidangKeahlian ? <p className={styles.bio}>{stripHtml(item.bidangKeahlian).slice(0, 120)}</p> : null}
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
