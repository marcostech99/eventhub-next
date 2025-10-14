
import { create } from 'zustand';
import { Event } from '@/types/event';

interface SavedEventsState {
  savedEvents: Event[];
  maxEvents: number;
  saveEvent: (event: Event) => { success: boolean; message?: string };
  removeEvent: (eventId: string) => void;
  clearSavedEvents: () => void;
  isEventSaved: (eventId: string) => boolean;
}

const getInitialSavedEvents = (): Event[] => {
  try {
    const storedEvents = localStorage.getItem('savedEvents');
    return storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error('Failed to load saved events from localStorage', error);
    return [];
  }
};

const updateLocalStorage = (events: Event[]) => {
  try {
    localStorage.setItem('savedEvents', JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save events to localStorage', error);
  }
};

export const useEventStore = create<SavedEventsState>((set, get) => ({
  savedEvents: getInitialSavedEvents(),
  maxEvents: 20, // Definindo um número máximo de eventos salvos
  saveEvent: (event) => {
    const { savedEvents, maxEvents } = get();
    if (savedEvents.length >= maxEvents) {
      return { success: false, message: `Você atingiu o limite de ${maxEvents} eventos salvos.` };
    }
    if (savedEvents.find((e) => e.id === event.id)) {
      return { success: false, message: 'Evento já salvo.' };
    }
    const newSavedEvents = [...savedEvents, event];
    set({ savedEvents: newSavedEvents });
    updateLocalStorage(newSavedEvents);
    return { success: true };
  },
  removeEvent: (eventId) => {
    const { savedEvents } = get();
    const newSavedEvents = savedEvents.filter((e) => e.id !== eventId);
    set({ savedEvents: newSavedEvents });
    updateLocalStorage(newSavedEvents);
  },
  clearSavedEvents: () => {
    set({ savedEvents: [] });
    updateLocalStorage([]);
  },
  isEventSaved: (eventId) => {
    const { savedEvents } = get();
    return savedEvents.some((e) => e.id === eventId);
  },
}));
