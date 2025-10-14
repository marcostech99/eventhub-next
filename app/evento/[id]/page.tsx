import { fetchEventById } from '@/lib/api/ticketmaster';
import EventDetailsView from '@/components/features/EventDetailsView';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import styles from './page.module.css';
import { Event } from '@/types/event';

interface PageProps {
  params: { id: string };
}

async function EventDetails({ id }: { id: string }) {
  let event: Event | null = null;
  try {
    event = await fetchEventById(id);
  } catch (err) {
    console.error('Erro ao carregar detalhes do evento:', err);
  }

  if (!event) {
    notFound();
  }

  return <EventDetailsView event={event} styles={styles} />;
}

export default function EventDetailsPage({ params }: PageProps) {
  return (
    <Suspense fallback={
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando evento...</p>
        </div>
    }>
        <EventDetails id={params.id} />
    </Suspense>
  );
}