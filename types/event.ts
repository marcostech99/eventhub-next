export interface EventSearchParams {
  keyword?: string;        // Busca por nome/artista
  city?: string;           // Cidade
  startDateTime?: string;  // Data início (ISO)
  endDateTime?: string;    // Data fim (ISO)
  classificationName?: string; // Categoria (Music, Sports, etc)
  page?: number;
  size?: number;
}

export interface Event {
  id: string;
  name: string;
  url?: string;
  images?: Array<{
    url: string;
    ratio?: string;
    width?: number;
    height?: number;
  }>;
  dates?: {
    start: {
      localDate?: string;  // "2024-12-25"
      localTime?: string;  // "20:00:00"
    };
  };
  priceRanges?: Array<{
    min: number;
    max: number;
    currency: string;
  }>;
  _embedded?: {
    venues?: Array<{
      name: string;
      city?: {
        name: string;
      };
    }>;
  };
}

export interface TicketmasterResponse {
  _embedded?: {
    events: Event[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}