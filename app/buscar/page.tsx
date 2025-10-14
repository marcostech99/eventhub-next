import EventCard from '@/components/ui/EventCard';
import SearchBar from '@/components/ui/SearchBar';
import EventFilters from '@/components/ui/EventFilters';
import { fetchEvents } from '@/lib/api/ticketmaster';
import { Suspense } from 'react';
import styles from './page.module.css';
import { Event } from '@/types/event';
import { PaginationLink } from '@/components/ui/PaginationLink';

type SearchParams = { [key: string]: string | string[] | undefined };

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function SearchResults({ searchParams }: PageProps) {
  // Await searchParams no Next.js 15
  const params = await searchParams;
  
  const keyword = (params?.q as string) || '';
  const city = (params?.city as string) || '';
  const category = (params?.category as string) || '';
  const startDate = (params?.startDate as string) || '';
  const endDate = (params?.endDate as string) || '';
  const page = parseInt((params?.page as string) || '0');

  const apiParams = {
    keyword,
    city,
    classificationName: category,
    startDateTime: startDate ? `${startDate}T00:00:00Z` : '',
    endDateTime: endDate ? `${endDate}T23:59:59Z` : '',
    page,
    size: 12
  };

  let events: Event[] = [];
  let pagination = { currentPage: 0, totalPages: 0, totalElements: 0 };
  let error: string | null = null;

  try {
    const data = await fetchEvents(apiParams);
    if (data._embedded?.events) {
      events = data._embedded.events;
      pagination = {
        currentPage: data.page.number,
        totalPages: data.page.totalPages,
        totalElements: data.page.totalElements
      };
    }
  } catch (err) {
    error = 'Erro ao buscar eventos. Tente novamente.';
    console.error('Erro:', err);
  }

  if (error) {
    return (
        <div className="error-container">
            <p className="error-message">{error}</p>
        </div>
    );
  }

  return (
    <>
      <div className={styles['search-results-info']}>
        {pagination.totalElements > 0 ? (
          <p>
            Encontrados <strong>{pagination.totalElements}</strong> eventos
            {keyword && ` para "${keyword}"`}
          </p>
        ) : (
          <p>Nenhum evento encontrado. Tente ajustar os filtros.</p>
        )}
      </div>

      {events.length > 0 && (
        <>
          <div className="events-grid">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className={styles['pagination']}>
                <PaginationLink page={page - 1} isDisabled={page === 0} searchParams={params}>
                    ← Anterior
                </PaginationLink>

                <span className={styles['pagination-info']}>
                    Página {page + 1} de {pagination.totalPages}
                </span>

                <PaginationLink page={page + 1} isDisabled={page >= pagination.totalPages - 1} searchParams={params}>
                    Próxima →
                </PaginationLink>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default async function SearchPage({ searchParams }: PageProps) {
  return (
    <div className={styles['search-page']}>
      <div className={styles['search-header']}>
        <h1>Buscar Eventos</h1>
        <SearchBar />
      </div>

      <EventFilters />
      
      <Suspense fallback={
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Buscando eventos...</p>
        </div>
      }>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}