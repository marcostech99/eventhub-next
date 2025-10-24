'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEventStore } from '@/store/eventStore';
import {
  formatDate,
  formatPrice,
  getEventImage,
  getEventPrice,
  getEventStatus,
  getEventCategories,
  getCountdown,
  CountdownResult
} from '@/lib/utils/helpers';
import { Event } from '@/types/event';
import { Button } from '@/components/ui/Button';

interface EventDetailsViewProps {
  event: Event;
  styles: { [key: string]: string };
}

const EventDetailsView = ({ event, styles }: EventDetailsViewProps) => {
  const router = useRouter();
  const { saveEvent, removeEvent, isEventSaved } = useEventStore();
  
  const [countdown, setCountdown] = useState<CountdownResult | null>(null);
  const isSaved = isEventSaved(event.id);

  useEffect(() => {
    const eventDateTime = event?.dates?.start?.dateTime;
    if (eventDateTime) {
      const updateCountdown = () => {
        setCountdown(getCountdown(eventDateTime));
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 60000);

      return () => clearInterval(interval);
    }
  }, [event]);

  const handleSaveToggle = () => {
    if (isSaved) {
      removeEvent(event.id);
    } else {
      const result = saveEvent(event);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  const eventImage = getEventImage(event.images || []);
  const eventPrice = getEventPrice(event.priceRanges || []);
  const eventStatus = getEventStatus(event);
  const categories = getEventCategories(event.classifications || []);
  const venue = event._embedded?.venues?.[0];
  const statusClass = eventStatus.toLowerCase().replace(/\s/g, '-');

  return (
    <div className={styles['event-details-page']}>
      <Button onClick={() => router.back()} className={styles['back-button']}>
        ← Voltar
      </Button>

      <div className={styles['event-hero']}>
        <Image 
          src={eventImage} 
          alt={event.name}
          className={styles['event-hero-image']}
          width={500} // Placeholder, adjust as needed
          height={300} // Placeholder, adjust as needed
        />
        <div className={styles['event-hero-overlay']}>
          <div className={styles['event-hero-content']}>
            <div className={styles['event-categories']}>
              {categories.map((cat, index) => (
                <span key={index} className={styles['category-tag']}>{cat}</span>
              ))}
            </div>
            <h1 className={styles['event-title']}>{event.name}</h1>
            <span className={`${styles['status-badge']} ${styles[`status-${statusClass}`]}`}>
              {eventStatus}
            </span>
          </div>
        </div>
      </div>

      <div className={styles['event-content']}>
        <div className={styles['event-main']}>
          <section className={styles['event-section']}>
            <h2>Informações do Evento</h2>
            <div className={styles['info-grid']}>
              <div className={styles['info-item']}>
                <span className={styles['info-label']}>📅 Data e Hora</span>
                <span className={styles['info-value']}>
                  {event.dates?.start && formatDate(event.dates.start.dateTime || event.dates.start.localDate || '')}
                </span>
              </div>

              {venue && (
                <>
                  <div className={styles['info-item']}>
                    <span className={styles['info-label']}>📍 Local</span>
                    <span className={styles['info-value']}>{venue.name}</span>
                  </div>

                  <div className={styles['info-item']}>
                    <span className={styles['info-label']}>🏙️ Cidade</span>
                    <span className={styles['info-value']}>
                      {venue.city?.name}, {venue.state?.stateCode}
                    </span>
                  </div>

                  {venue.address?.line1 && (
                    <div className={styles['info-item']}>
                      <span className={styles['info-label']}>📮 Endereço</span>
                      <span className={styles['info-value']}>{venue.address.line1}</span>
                    </div>
                  )}
                </>
              )}

              <div className={styles['info-item']}>
                <span className={styles['info-label']}>💰 Preço</span>
                <span className={styles['info-value']}>
                  {eventPrice.min > 0
                    ? `${formatPrice(eventPrice.min)} - ${formatPrice(eventPrice.max)}`
                    : 'Grátis'}
                </span>
              </div>
            </div>
          </section>

          {countdown && !countdown.expired && eventStatus === 'Inscrições abertas' && (
            <section className={`${styles['event-section']} ${styles['countdown-section']}`}>
              <h2>Tempo até o evento</h2>
              <div className={styles['countdown']}>
                <div className={styles['countdown-item']}>
                  <span className={styles['countdown-value']}>{countdown.days}</span>
                  <span className={styles['countdown-label']}>dias</span>
                </div>
                <div className={styles['countdown-item']}>
                  <span className={styles['countdown-value']}>{countdown.hours}</span>
                  <span className={styles['countdown-label']}>horas</span>
                </div>
                <div className={styles['countdown-item']}>
                  <span className={styles['countdown-value']}>{countdown.minutes}</span>
                  <span className={styles['countdown-label']}>minutos</span>
                </div>
              </div>
            </section>
          )}

          {event.info && (
            <section className={styles['event-section']}>
              <h2>Sobre o Evento</h2>
              <p className={styles['event-description']}>{event.info}</p>
            </section>
          )}

          {event.pleaseNote && (
            <section className={styles['event-section']}>
              <h2>Informações Importantes</h2>
              <p className={styles['event-note']}>{event.pleaseNote}</p>
            </section>
          )}
        </div>

        <div className={styles['event-sidebar']}>
          <div className={styles['action-card']}>
            <Button 
              className={`${styles['save-button-large']} ${isSaved ? styles['saved'] : ''}`}
              onClick={handleSaveToggle}
            >
              {isSaved ? '❤️ Salvo nos favoritos' : '🤍 Salvar evento'}
            </Button>

            {event.url && (
              <a 
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['buy-button']}
              >
                🎫 Comprar ingressos
              </a>
            )}
          </div>

          {event.seatmap?.staticUrl && (
            <div className={styles['seatmap-card']}>
              <h3>Mapa de Assentos</h3>
              <Image 
                src={event.seatmap.staticUrl}
                alt="Mapa de assentos"
                className={styles['seatmap-image']}
                width={400} // Placeholder, adjust as needed
                height={200} // Placeholder, adjust as needed
              />
            </div>
          )}

          {event.priceRanges && event.priceRanges.length > 1 && (
            <div className={styles['price-ranges-card']}>
              <h3>Faixas de Preço</h3>
              <ul className={styles['price-list']}>
                {event.priceRanges.map((price, index) => (
                  <li key={index}>
                    {formatPrice(price.min)} - {formatPrice(price.max)}
                    {price.type && <span className={styles['price-type']}> ({price.type})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsView;