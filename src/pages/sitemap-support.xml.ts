import type { APIRoute } from 'astro';
import { buildSitemapXml, groups } from '../lib/sitemap';

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const xml = buildSitemapXml(url.origin, groups.support);
  return new Response(xml, {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
