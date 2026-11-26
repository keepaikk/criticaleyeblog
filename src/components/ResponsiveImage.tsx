import type { ComponentProps } from 'react';

const optimizedFiles = new Set([
  'accra-street-football.jpg',
  'criticaleye-banner-high-quality.jpeg',
  'doctor_clinical_journal_1794072083085.jpg',
  'featured_ghana_hospital_1793829875799.jpg',
  'labadi-football-park.jpg',
  'maternal_health_clinic_1793829877957.jpg',
  'midwife_field_notes_1794072095489.jpg',
  'movie-theater-seats.jpg',
  'public_health_malaria_lab_1793829876940.jpg',
  'rural_drone_delivery_health_1793829876949.jpg',
  'trigmatic-live-in-accra.jpg',
]);

const widths = [480, 960];

function imageSources(src?: string) {
  if (!src || typeof window === 'undefined') return undefined;

  let url: URL;
  try {
    url = new URL(src, window.location.origin);
  } catch {
    return undefined;
  }
  if (url.origin !== window.location.origin || url.search || url.hash) return undefined;

  const filename = url.pathname.slice('/images/'.length);
  if (url.pathname.startsWith('/images/') && optimizedFiles.has(filename)) {
    return widths.map((width) => `/images/optimized/${filename}-${width}.webp ${width}w`).join(', ');
  }
  if (/^\/api\/publish\/images\/[a-f0-9]{64}$/.test(url.pathname)) {
    return widths.map((width) => `${url.pathname}?w=${width} ${width}w`).join(', ');
  }
  return undefined;
}

export function ResponsiveImage({ src, sizes, loading = 'lazy', ...props }: ComponentProps<'img'>) {
  const srcSet = imageSources(src);
  return <img {...props} src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} loading={loading} />;
}
