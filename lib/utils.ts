import { Event } from '@/types/event';

// Retorna a URL da primeira imagem disponível
export const getEventImage = (images?: Event['images']): string => {
  if (images && images.length > 0) {
    // Idealmente, aqui você escolheria a imagem com a melhor proporção (ratio)
    return images[0].url;
  }
  // Retorna uma imagem de placeholder caso nenhuma seja encontrada
  return 'https://via.placeholder.com/400x240.png?text=Evento+Sem+Imagem';
};

// Retorna o menor preço mínimo e o maior preço máximo
export const getEventPrice = (priceRanges?: Event['priceRanges']): { min: number; max: number } => {
  if (!priceRanges || priceRanges.length === 0) {
    return { min: 0, max: 0 };
  }

  const min = Math.min(...priceRanges.map(r => r.min));
  const max = Math.max(...priceRanges.map(r => r.max));

  return { min, max };
};

// Determina o status do evento (lógica de exemplo)
export const getEventStatus = (event: Event): string => {
  const startDate = event.dates?.start?.localDate;
  if (!startDate) return 'Data indefinida';

  const eventDate = new Date(startDate);
  const today = new Date();

  // Define a data do evento para o final do dia para comparação
  eventDate.setHours(23, 59, 59, 999);

  if (eventDate < today) {
    return 'Encerrado';
  }

  // Lógica para "Esgotado" precisaria de dados da API, então vamos simular
  // if (event.tickets?.availability === 0) return 'Esgotado';

  return 'Inscrições Abertas';
};

// Formata a data para o padrão brasileiro
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Data não informada';
  try {
    const date = new Date(dateString);
    // Adiciona o fuso horário para evitar problemas de data "um dia antes"
    const utcDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(utcDate);
  } catch (error) {
    return 'Data inválida';
  }
};

// Formata o número para moeda BRL
export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};
