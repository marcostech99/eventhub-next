import { NextRequest, NextResponse } from 'next/server';
import { fetchEventById } from '@/lib/api/ticketmaster';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Agora params é uma Promise, precisa do await
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do evento é obrigatório' },
        { status: 400 }
      );
    }

    // Busca o evento específico
    const event = await fetchEventById(id);

    // Retorna os dados com cache headers
    return NextResponse.json(event, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error(`Erro ao buscar evento:`, error);
    
    const isNotFound = error instanceof Error && error.message.includes('não encontrado');
    
    return NextResponse.json(
      { 
        error: isNotFound ? 'Evento não encontrado' : 'Falha ao buscar evento',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: isNotFound ? 404 : 500 }
    );
  }
}