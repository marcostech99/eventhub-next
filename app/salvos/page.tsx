'use client';

import Link from 'next/link';
import { useEventStore } from '@/store/eventStore';
import EventCard from '@/components/ui/EventCard';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

const SavedEventsPage = () => {
  const { savedEvents, clearSavedEvents, maxEvents } = useEventStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const remainingSlots = maxEvents ? maxEvents - savedEvents.length : 0;

  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja remover todos os eventos salvos?')) {
      clearSavedEvents();
    }
  };

  return (
    <div className={styles['saved-events-page']}>
      <div className={styles['page-header']}>
        <div>
          <h1>Meus Eventos</h1>
          {isClient && (
            <p className={styles['page-subtitle']}>
              {savedEvents.length} de {maxEvents} eventos salvos
              {remainingSlots > 0 && ` • ${remainingSlots} ${remainingSlots === 1 ? 'vaga disponível' : 'vagas disponíveis'}`}
            </p>
          )}
        </div>
        
        {isClient && savedEvents.length > 0 && (
          <Button 
            onClick={handleClearAll}
            className={styles['clear-all-button']}
          >
            Limpar todos
          </Button>
        )}
      </div>

      {isClient && savedEvents.length === 0 ? (
        <div className="empty-state">
          <div className={styles['empty-state-icon']}>❤️</div>
          <h2>Nenhum evento salvo ainda</h2>
          <p>
            Explore eventos e salve seus favoritos para encontrá-los facilmente aqui.
          </p>
          <Link href="/buscar" className={styles['explore-button']}>
            Explorar Eventos
          </Link>
        </div>
      ) : isClient && (
        <>
          <div className={styles['saved-info']}>
            <p>
              💡 <strong>Dica:</strong> Você pode salvar até {maxEvents} eventos. 
              Clique no ❤️ nos cards para gerenciar seus favoritos.
            </p>
          </div>

          <div className="events-grid">
            {savedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SavedEventsPage;