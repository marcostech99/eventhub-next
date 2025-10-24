"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MouseEvent, useEffect, useState } from 'react';
import { Event } from '@/types/event';
import { useEventStore } from '@/store/eventStore';
import { 
  formatDate, 
  formatPrice, 
  getEventImage, 
  getEventPrice,
  getEventStatus 
} from '@/lib/utils'; // Assuming utils are in lib
import styles from './EventCard.module.css';
import { Button } from '@/components/ui/Button';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const { saveEvent, removeEvent, isEventSaved } = useEventStore();
  const [hasMounted, setHasMounted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    setIsSaved(isEventSaved(event.id));
  }, [event.id, isEventSaved]);

  const eventImage = getEventImage(event.images);
  const eventPrice = getEventPrice(event.priceRanges);
  const eventStatus = getEventStatus(event);
  const venue = event._embedded?.venues?.[0];

  const handleSaveToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaved) {
      removeEvent(event.id);
      setIsSaved(false); // Optimistically update UI
    } else {
      const result = saveEvent(event);
      if (result.success) {
        setIsSaved(true); // Optimistically update UI
      } else {
        alert(result.message); // Placeholder for a better notification system
      }
    }
  };

  const statusClass = eventStatus.toLowerCase().replace(/\s/g, '-');

  return (
    <Link href={`/evento/${event.id}`} className={styles['event-card']}>
      <div className={styles['event-card-image-container']}>
        <Image
          src={eventImage}
          alt={event.name}
          fill
          style={{ objectFit: 'cover' }}
          className={styles['event-card-image']}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {hasMounted && (
          <Button
            className={`${styles['save-button']} ${isSaved ? styles['saved'] : ''}`}
            onClick={handleSaveToggle}
            aria-label={isSaved ? 'Remover dos favoritos' : 'Salvar evento'}
          >
            {isSaved ? '❤️' : '🤍'}
          </Button>
        )}
        <span className={`${styles['status-badge']} ${styles[`status-${statusClass}`]}`}>
          {eventStatus}
        </span>
      </div>

      <div className={styles['event-card-content']}>
        <h3 className={styles['event-card-title']}>{event.name}</h3>
        
        <div className={styles['event-card-info']}>
          <div className={styles['info-item']}>
            <span className={styles['info-icon']}>📅</span>
            <span className={styles['info-text']}>
              {formatDate(event.dates?.start.localDate)}
            </span>
          </div>

          {venue && (
            <div className={styles['info-item']}>
              <span className={styles['info-icon']}>📍</span>
              <span className={styles['info-text']}>
                {venue.city?.name}, {venue.state?.stateCode}
              </span>
            </div>
          )}

          <div className={styles['info-item']}>
            <span className={styles['info-icon']}>💰</span>
            <span className={styles['info-text']}>
              {eventPrice.min > 0 
                ? `${formatPrice(eventPrice.min)} - ${formatPrice(eventPrice.max)}`
                : 'Grátis'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
