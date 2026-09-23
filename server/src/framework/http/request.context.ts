import type { FastifyRequest } from 'fastify';

/** 接受 Fastify request 或測試用的精簡物件（只需 url / raw.url）。 */
type UrlSource = { url?: string; raw?: { url?: string } };
export function getRequestUrl(request: UrlSource | FastifyRequest): string {
  return request.url ?? request.raw?.url ?? '';
}

export function getRequestPath(request: UrlSource | FastifyRequest): string {
  return getRequestUrl(request).split('?')[0] || '/';
}
