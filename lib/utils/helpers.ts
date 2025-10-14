import { Event } from '@/types/event';

/**
 * Formata data para exibição
 * @param {string} dateString - Data em formato ISO
 * @returns {string} Data formatada
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('pt-BR', options);
};

/**
 * Formata preço em Real
 * @param {number} value - Valor numérico
 * @returns {string} Valor formatado em BRL
 */
export const formatPrice = (value: number): string => {
  if (!value) return 'Grátis';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Extrai a melhor imagem do evento
 * @param {Array} images - Array de imagens do evento
 * @returns {string} URL da imagem
 */
interface EventImage {
  url: string;
  ratio?: string;
  width?: number;
  [key: string]: unknown;
}

export const getEventImage = (images: EventImage[]): string => {
  if (!images || images.length === 0) {
    return 'https://via.placeholder.com/400x300?text=Sem+Imagem';
  }
  
  const largeImage = images.find(img => img.ratio === '16_9' && (img.width ?? 0) > 1000);
  const mediumImage = images.find(img => img.ratio === '16_9' && (img.width ?? 0) > 500);
  
  return largeImage?.url || mediumImage?.url || images[0].url;
};

/**
 * Extrai categorias do evento
 * @param {Object} classifications - Classificações do evento
 * @returns {Array} Array de categorias
 */
interface EventClassification {
  segment?: { name?: string };
  genre?: { name?: string };
  subGenre?: { name?: string };
  [key: string]: unknown;
}

export const getEventCategories = (classifications: EventClassification[]): string[] => {
  if (!classifications || classifications.length === 0) return [];
  
  const categories: string[] = [];
  const classification = classifications[0];
  
  if (classification.segment?.name) categories.push(classification.segment.name);
  if (classification.genre?.name) categories.push(classification.genre.name);
  if (classification.subGenre?.name) categories.push(classification.subGenre.name);
  
  return categories;
};

/**
 * Extrai preço do evento
 * @param {Array} priceRanges - Faixas de preço
 * @returns {Object} Preço mínimo e máximo
 */
interface EventPriceRange {
  min?: number;
  max?: number;
  currency?: string;
  [key: string]: unknown;
}

interface EventPrice {
  min: number;
  max: number;
  currency: string;
}

export const getEventPrice = (priceRanges: EventPriceRange[]): EventPrice => {
  if (!priceRanges || priceRanges.length === 0) {
    return { min: 0, max: 0, currency: 'BRL' };
  }
  
  const price = priceRanges[0];
  return {
    min: price.min || 0,
    max: price.max || 0,
    currency: price.currency || 'BRL'
  };
};

/**
 * Determina status do evento
 * @param {Object} event - Objeto do evento
 * @returns {string} Status do evento
 */
export const getEventStatus = (event: Event): string => {
  const startDate = new Date(event.dates?.start?.dateTime ?? '');
  const now = new Date();
  
  if (event.dates?.status?.code === 'cancelled') {
    return 'Cancelado';
  }
  
  if (event.dates?.status?.code === 'postponed') {
    return 'Adiado';
  }
  
  if (startDate < now) {
    return 'Encerrado';
  }
  
  if (event.sales?.public?.endDateTime) {
    const salesEnd = new Date(event.sales.public.endDateTime);
    if (salesEnd < now) {
      return 'Esgotado';
    }
  }
  
  return 'Inscrições abertas';
};

/**
 * Calcula contagem regressiva para o evento
 * @param {string} dateString - Data do evento
 * @returns {Object} Objeto com dias, horas, minutos
 */
export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
}

export const getCountdown = (dateString: string): CountdownResult => {
  const eventDate = new Date(dateString);
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  
  if (diff < 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, expired: false };
};

/**
 * Debounce function para otimizar buscas
 * @param {Function} func - Função a ser debounced
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função debounced
 */
type DebouncedFunction<T extends (...args: unknown[]) => void> = (...args: Parameters<T>) => void;

interface Debounce {
  <T extends (...args: unknown[]) => void>(func: T, wait: number): DebouncedFunction<T>;
}

export const debounce: Debounce = (func, wait) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<typeof func>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};