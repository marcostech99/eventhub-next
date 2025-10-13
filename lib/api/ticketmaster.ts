import { TicketmasterResponse, Event, EventSearchParams } from '../../types/event';

const API_KEY = process.env.TICKETMASTER_API_KEY || process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

if (!API_KEY) {
  console.warn('⚠️  TICKETMASTER_API_KEY não configurada!');
}

export async function fetchEvents(params: EventSearchParams = {}): Promise<TicketmasterResponse> {
  const queryParams = new URLSearchParams({
    apikey: API_KEY!,
    locale: '*',
    page: (params.page || 0).toString(),
    size: (params.size || 20).toString()
  });

  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.city) queryParams.append('city', params.city);
  if (params.startDateTime) queryParams.append('startDateTime', params.startDateTime);
  if (params.endDateTime) queryParams.append('endDateTime', params.endDateTime);
  if (params.classificationName) queryParams.append('classificationName', params.classificationName);

  try {
    const response = await fetch(`${BASE_URL}/events.json?${queryParams}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ticketmaster API error (${response.status}): ${errorText}`);
    }

    const data: TicketmasterResponse = await response.json();
    return data;

  } catch (error) {
    console.error('❌ Erro ao buscar eventos:', error);
    throw error;
  }
}

export async function fetchEventById(eventId: string): Promise<Event> {
  const queryParams = new URLSearchParams({
    apikey: API_KEY!,
    locale: '*'
  });

  try {
    const response = await fetch(`${BASE_URL}/events/${eventId}.json?${queryParams}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Evento não encontrado');
      }
      const errorText = await response.text();
      throw new Error(`Ticketmaster API error (${response.status}): ${errorText}`);
    }

    const data: Event = await response.json();
    return data;

  } catch (error) {
    console.error('❌ Erro ao buscar detalhes do evento:', error);
    throw error;
  }
}

export async function fetchPopularEvents(): Promise<TicketmasterResponse> {
  return fetchEvents({ size: 12 });
}