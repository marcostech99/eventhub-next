// app/evento/[id]/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function EventError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erro ao carregar evento:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Algo deu errado!
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'Ocorreu um erro ao carregar os detalhes do evento.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} className="retry-button">
            Tentar novamente
          </Button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}