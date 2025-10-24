'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './SearchBar.module.css';
import { Button } from '@/components/ui/Button';

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (searchTerm) {
        params.set('q', searchTerm);
      } else {
        params.delete('q');
      }
      params.delete('page');
      if (params.toString() !== new URLSearchParams(Array.from(searchParams.entries())).toString()) {
        router.push(`/buscar?${params.toString()}`);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, router, searchParams]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (searchTerm) {
        params.set('q', searchTerm);
    } else {
        params.delete('q');
    }
    params.delete('page');
    router.push(`/buscar?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form className={styles['search-bar']} onSubmit={handleSubmit}>
      <div className={styles['search-input-container']}>
        <span className={styles['search-icon']}>🔍</span>
        <input
          type="text"
          className={styles['search-input']}
          placeholder="Buscar eventos por nome, artista, local..."
          value={searchTerm}
          onChange={handleInputChange}
          aria-label="Buscar eventos"
        />
        {searchTerm && (
          <Button
            type="button"
            className={styles['clear-button']}
            onClick={handleClear}
            aria-label="Limpar busca"
          >
            ✕
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;