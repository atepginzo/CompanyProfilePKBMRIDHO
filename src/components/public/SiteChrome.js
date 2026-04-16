'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './siteChrome.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Beranda' },
  {
    label: 'Tentang Kami',
    children: [
      { href: '/profil', label: 'Profil PKBM RIDHO', desc: 'Visi, misi, dan sejarah' },
      { href: '/struktur', label: 'Struktur Organisasi', desc: 'Bagan organisasi lembaga' },
      { href: '/dosen', label: 'Tenaga Pendidik', desc: 'Profil pengajar kami' },
      { href: '/fasilitas', label: 'Fasilitas', desc: 'Sarana dan prasarana' },
    ],
  },
  {
    label: 'Program',
    children: [
      { href: '/program/kesetaraan', label: 'Program Pendidikan', desc: 'Paket A, B, dan C' },
      { href: '/program/unggulan', label: 'Program Unggulan', desc: 'Tahfidz, wirausaha, dll' },
      { href: '/program/ekstrakurikuler', label: 'Ekstrakurikuler', desc: 'Pramuka, seni, olahraga' },
      { href: '/kegiatan-rutin', label: 'Kegiatan Rutin', desc: 'Agenda mingguan' },
    ],
  },
  {
    label: 'Informasi',
    children: [
      { href: '/berita', label: 'Berita & Kegiatan', desc: 'Kabar terkini' },
      { href: '/pengumuman', label: 'Pengumuman', desc: 'Info penting resmi' },
      { href: '/galeri', label: 'Galeri', desc: 'Dokumentasi foto' },
      { href: '/kalender', label: 'Kalender & Agenda', desc: 'Jadwal kegiatan' },
      { href: '/dokumen', label: 'Dokumen & Unduhan', desc: 'Berkas resmi' },
    ],
  },
  { href: '/kontak', label: 'Kontak' },
];

export default function SiteChrome({ children }) {
  const pathname = usePathname() || '/';
  const isAdminArea = pathname.startsWith('/admin');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAdminArea) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const targets = Array.from(
      document.querySelectorAll('main section, main article, main .card, main [class*="Card"], main [class*="card"]')
    ).filter((el) => !el.classList.contains('reveal-on-scroll'));

    targets.forEach((el, index) => {
      el.classList.add('reveal-on-scroll');
      el.style.setProperty('--reveal-delay', `${(index % 6) * 60}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    const onClickPop = (event) => {
      const hit = event.target.closest('a, button, .btn, [class*="card"], [class*="Card"]');
      if (!hit) return;
      hit.classList.remove('click-pop');
      requestAnimationFrame(() => {
        hit.classList.add('click-pop');
        setTimeout(() => hit.classList.remove('click-pop'), 260);
      });
    };

    document.addEventListener('click', onClickPop);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', onClickPop);
    };
  }, [pathname, isAdminArea]);

  if (isAdminArea) return children;

  return (
    <div className={styles.shell}>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>
            <Image src="/logo.png" alt="Logo PKBM RIDHO" width={40} height={40} className={styles.brandLogo} />
            <span className={styles.brandText}>PKBM RIDHO</span>
          </Link>

          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={mobileOpen ? styles.hamburgerOpen : ''} />
          </button>

          <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ''}`}>
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <DropdownItem
                  key={item.label}
                  label={item.label}
                  items={item.children}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`.trim()}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <Link href="/pendaftaran" className={styles.ctaBtn}>
            Daftar Sekarang
          </Link>
        </div>
      </header>

      <main className={styles.content}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.footerBrandHeader}>
              <Image src="/logo.png" alt="Logo PKBM RIDHO" width={44} height={44} />
              <strong>PKBM RIDHO</strong>
            </div>
            <p>Pusat Kegiatan Belajar Masyarakat. Mewujudkan pendidikan kesetaraan yang berkualitas dan gratis untuk semua.</p>
            <p className={styles.footerAddress}>
              Kecamatan Paseh, Kabupaten Bandung
            </p>
            <div className={styles.footerSocials}>
              <a href="https://wa.me/6281394223675" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="mailto:pkbmridho2000@gmail.com" aria-label="Email" className={styles.socialLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <h4>Tentang</h4>
              <Link href="/profil">Profil PKBM</Link>
              <Link href="/struktur">Struktur Organisasi</Link>
              <Link href="/dosen">Tenaga Pendidik</Link>
              <Link href="/fasilitas">Fasilitas</Link>
            </div>
            <div className={styles.footerCol}>
              <h4>Program</h4>
              <Link href="/program/kesetaraan">Kesetaraan (Paket A, B, C)</Link>
              <Link href="/program/unggulan">Program Unggulan</Link>
              <Link href="/program/ekstrakurikuler">Ekstrakurikuler</Link>
              <Link href="/kegiatan-rutin">Kegiatan Rutin</Link>
            </div>
            <div className={styles.footerCol}>
              <h4>Informasi</h4>
              <Link href="/berita">Berita & Kegiatan</Link>
              <Link href="/pengumuman">Pengumuman</Link>
              <Link href="/galeri">Galeri</Link>
              <Link href="/kontak">Kontak</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} PKBM RIDHO, Kecamatan Paseh, Kabupaten Bandung. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}

/* ===== HOVER DROPDOWN (Desktop) + Click (Mobile) ===== */
function DropdownItem({ label, items, pathname, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timeoutRef = useRef(null);
  const isActive = items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'));

  const close = useCallback(() => setOpen(false), []);

  // Desktop: hover open/close with delay
  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  // Mobile: click toggle
  const handleClick = () => {
    if (window.innerWidth <= 920) {
      setOpen((v) => !v);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Close on outside click (mobile)
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) close();
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, close]);

  return (
    <div
      ref={ref}
      className={styles.dropdown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`${styles.navLink} ${styles.dropdownTrigger} ${isActive ? styles.active : ''}`.trim()}
        onClick={handleClick}
        aria-expanded={open}
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 12 12" className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          <path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className={`${styles.dropdownMenu} ${open ? styles.dropdownMenuOpen : ''}`}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.dropdownLink} ${pathname === item.href ? styles.dropdownActive : ''}`.trim()}
            onClick={() => { close(); onNavigate(); }}
          >
            <span className={styles.dropdownLinkTitle}>{item.label}</span>
            {item.desc && <span className={styles.dropdownLinkDesc}>{item.desc}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
