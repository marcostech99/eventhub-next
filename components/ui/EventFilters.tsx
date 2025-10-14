'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './EventFilters.module.css';

const CATEGORIES = [
  { value: '', label: 'Todas as categorias' },
  { value: 'Music', label: 'Música' },
  { value: 'Sports', label: 'Esportes' },
  { value: 'Arts & Theatre', label: 'Arte e Teatro' },
  { value: 'Family', label: 'Família' },
  { value: 'Film', label: 'Cinema' },
  { value: 'Miscellaneous', label: 'Diversos' }
];

const CITIES = [
  { value: '', label: 'Todas as cidades' },
  { value: 'São Paulo', label: 'São Paulo' },
  { value: 'Rio de Janeiro', label: 'Rio de Janeiro' },
  { value: 'Belo Horizonte', label: 'Belo Horizonte' },
  { value: 'Brasília', label: 'Brasília' },
  { value: 'Curitiba', label: 'Curitiba' },
  { value: 'Porto Alegre', label: 'Porto Alegre' },
  { value: 'Recife', label: 'Recife' },
  { value: 'Salvador', label: 'Salvador' }
];

interface FiltersState {
  city: string;
  category: string;
  startDate: string;
  endDate: string;
  priceRange: 'all' | 'free' | 'paid';
}

const EventFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    city: '',
    category: '',
    startDate: '',
    endDate: '',
    priceRange: 'all'
  });

  useEffect(() => {
    setFilters({
      city: searchParams.get('city') || '',
      category: searchParams.get('category') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      priceRange: (searchParams.get('priceRange') as FiltersState['priceRange']) || 'all'
    });
  }, [searchParams]);

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.delete('page');
    router.push(`/buscar?${params.toString()}`);
  };

  const handleReset = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    Object.keys(filters).forEach(key => params.delete(key));
    router.push(`/buscar?${params.toString()}`);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'all'
  );

  return (
    <div className={styles['event-filters']}>
      <div className={styles['filters-header']}>
        <button 
          className={styles['toggle-filters-btn']}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? '▼' : '▶'} Filtros
          {hasActiveFilters && <span className={styles['active-indicator']}>•</span>}
        </button>
        
        {hasActiveFilters && (
          <button className={styles['reset-filters-btn']} onClick={handleReset}>
            Limpar filtros
          </button>
        )}
      </div>

      {showFilters && (
        <div className={styles['filters-content']}>
          <div className={styles['filter-group']}>
            <label htmlFor="city-filter">Cidade</label>
            <select
              id="city-filter"
              name="city"
              value={filters.city}
              onChange={handleInputChange}
            >
              {CITIES.map(city => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['filter-group']}>
            <label htmlFor="category-filter">Categoria</label>
            <select
              id="category-filter"
              name="category"
              value={filters.category}
              onChange={handleInputChange}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['filter-group']}>
            <label htmlFor="start-date-filter">Data início</label>
            <input
              id="start-date-filter"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles['filter-group']}>
            <label htmlFor="end-date-filter">Data fim</label>
            <input
              id="end-date-filter"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleInputChange}
              min={filters.startDate}
            />
          </div>

          <div className={styles['filter-group']}>
            <label htmlFor="price-filter">Preço</label>
            <select
              id="price-filter"
              name="priceRange"
              value={filters.priceRange}
              onChange={handleInputChange}
            >
              <option value="all">Todos os preços</option>
              <option value="free">Gratuito</option>
              <option value="paid">Pago</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters;