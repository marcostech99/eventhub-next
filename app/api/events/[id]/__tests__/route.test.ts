
import { GET } from '../route';
import { fetchEventById } from '@/lib/api/ticketmaster';
import { NextRequest } from 'next/server';
import { createRequest } from '@/lib/utils/test-utils'; // Helper to create requests

jest.mock('@/lib/api/ticketmaster');

const mockedFetchEventById = fetchEventById as jest.Mock;

describe('GET /api/events/[id]', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return event data for a valid ID', async () => {
    const mockEvent = { id: '123', name: 'Test Event' };
    mockedFetchEventById.mockResolvedValue(mockEvent);

    const request = createRequest('GET');
    const response = await GET(request, { params: Promise.resolve({ id: '123' }) });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockEvent);
    expect(mockedFetchEventById).toHaveBeenCalledWith('123');
  });

  it('should return 404 if event is not found', async () => {
    mockedFetchEventById.mockRejectedValue(new Error('Evento não encontrado'));

    const request = createRequest('GET');
    const response = await GET(request, { params: Promise.resolve({ id: '404' }) });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe('Evento não encontrado');
  });

  it('should return 400 if event ID is missing', async () => {
    const request = createRequest('GET');
    const response = await GET(request, { params: Promise.resolve({ id: '' }) });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('ID do evento é obrigatório');
  });

  it('should return 500 for other errors', async () => {
    mockedFetchEventById.mockRejectedValue(new Error('Some other error'));

    const request = createRequest('GET');
    const response = await GET(request, { params: Promise.resolve({ id: '500' }) });
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Falha ao buscar evento');
  });
});
