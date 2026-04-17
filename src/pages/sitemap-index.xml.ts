import type { APIRoute } from 'astro';
import { buildSitemapIndexXml } from '../lib/sitemap';

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const xml = buildSitemapIndexXml(url.origin);
  return new Response(xml, {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
