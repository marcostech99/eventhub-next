'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEventStore } from '@/store/eventStore';
import styles from './Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname();
  const { savedEvents } = useEventStore();

  const isActive = (path: string) => {
    return pathname === path ? styles['active'] : '';
  };

  return (
    <nav className={styles['navbar']}>
      <div className={styles['navbar-container']}>
        <Link href="/" className={styles['navbar-logo']}>
          🎉 EventHub
        </Link>

        <ul className={styles['navbar-menu']}>
          <li>
            <Link href="/" className={`${styles['navbar-link']} ${isActive('/')}`}>
              Início
            </Link>
          </li>
          <li>
            <Link href="/buscar" className={`${styles['navbar-link']} ${isActive('/buscar')}`}>
              Buscar Eventos
            </Link>
          </li>
          <li>
            <Link href="/salvos" className={`${styles['navbar-link']} ${isActive('/salvos')}`}>
              Meus Eventos
              {savedEvents.length > 0 && (
                <span className={styles['badge']}>{savedEvents.length}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
