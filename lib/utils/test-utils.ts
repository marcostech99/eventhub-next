
import { NextRequest } from 'next/server';

export function createRequest(method: string, url = 'http://localhost', headers = {}): NextRequest {
  return new NextRequest(new URL(url), {
    method,
    headers,
  });
}
