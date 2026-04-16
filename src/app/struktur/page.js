'use client';

import { useEffect, useState } from 'react';
import { publicAPI } from '@/lib/api';
import { DUMMY_STRUKTUR } from '@/data/dummyData';
import styles from './page.module.css';

export default function StrukturPage() {
  const [tree, setTree] = useState(DUMMY_STRUKTUR); // Start with dummy data instantly
  const [loading, setLoading] = useState(false); // No loading state needed

  useEffect(() => {
    let mounted = true;
    publicAPI
      .getStruktur()
      .then((res) => {
        if (mounted && res.data && res.data.length > 0) {
          setTree(res.data);
        }
      })
      .catch(() => {
        // Keep dummy data on error
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Tentang Kami</p>
        <h1>Struktur Organisasi</h1>
        <p>Bagan organisasi dan pejabat struktural PKBM RIDHO.</p>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          {tree.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Data Belum Tersedia</h3>
              <p>Struktur organisasi belum dimasukkan oleh administrator.</p>
            </div>
          ) : (
            <div className={styles.orgChart}>
              {tree.map((node) => (
                <OrgNode key={node.id} node={node} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function OrgNode({ node }) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={styles.nodeWrapper}>
      <div className={styles.card}>
        <div className={styles.avatarWrap}>
          {node.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={node.foto} alt={node.namaPejabat} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>
              {node.namaPejabat.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
            </div>
          )}
        </div>
        <h3 className={styles.cardName}>{node.namaPejabat}</h3>
        <p className={styles.cardRole}>{node.jabatan}</p>
        {node.periode ? <span className={styles.cardPeriode}>{node.periode}</span> : null}
      </div>

      {hasChildren ? (
        <div className={styles.childrenWrap}>
          <div className={styles.connectorLine} />
          <div className={styles.childrenRow}>
            {node.children.map((child) => (
              <OrgNode key={child.id} node={child} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
