import Link from 'next/link';
import EventCard from '@/components/ui/EventCard';
import { fetchPopularEvents } from '@/lib/api/ticketmaster';
import styles from './page.module.css';

export default async function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let featuredEvents: any[] = [];
  let error = null;

  try {
    const response = await fetchPopularEvents();
    featuredEvents = response._embedded?.events || [];
  } catch (err) {
    console.error('Failed to fetch popular events:', err);
    error = 'Não foi possível carregar os eventos populares. Tente novamente mais tarde.';
  }

  return (
    <div className={styles['home-page']}>
      <section className={styles['hero-section']}>
        <div className={styles['hero-content']}>
          <h1 className={styles['hero-title']}>Encontre o seu próximo grande evento</h1>
          <p className={styles['hero-subtitle']}>
            Explore conferências, shows, workshops e muito mais. A sua próxima experiência inesquecível está a apenas um clique de distância.
          </p>
          <Link href="/buscar" className={styles['hero-cta']}>
            Explorar Eventos
          </Link>
        </div>
      </section>

      <section className={styles['events-section']}>
        <div className={styles['section-header']}>
          <h2>Próximos Eventos</h2>
          <Link href="/buscar" className={styles['see-all-link']}>
            Ver todos
          </Link>
        </div>
        {error ? (
          <p className={styles['error-message']}>{error}</p>
        ) : (
          <div className="events-grid">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <section className={styles['features-section']}>
        <h2>Por que EventHub?</h2>
        <div className={styles['features-grid']}>
          <div className={styles['feature-card']}>
            <span className={styles['feature-icon']}>🔍</span>
            <h3>Busca Inteligente</h3>
            <p>Encontre eventos com filtros avançados por categoria, data, cidade e preço.</p>
          </div>
          <div className={styles['feature-card']}>
            <span className={styles['feature-icon']}>❤️</span>
            <h3>Favoritos</h3>
            <p>Salve os eventos que te interessam para não perder nenhuma oportunidade.</p>
          </div>
          <div className={styles['feature-card']}>
            <span className={styles['feature-icon']}>📅</span>
            <h3>Contagem Regressiva</h3>
            <p>Acompanhe o tempo restante para o início dos seus eventos salvos.</p>
          </div>
        </div>
      </section>
    </div>
  );
}