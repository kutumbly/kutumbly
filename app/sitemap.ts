/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. Mallah
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 * Contact     :  kutumbly@outlook.com
 * Web         :  kutumbly.com | aitdl.com | aitdl.in
 *
 * © 2026 Kutumbly.com — All Rights Reserved
 * Unauthorized use or distribution is prohibited.
 *
 * "Memory, Not Code."
 * ============================================================ */

import { MetadataRoute } from 'next'

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://kutumbly.com'
  const languages = ['en', 'hi', 'mr', 'gu', 'pa', 'ta', 'bho', 'kn', 'te', 'ne', 'bn', 'mni']
  const routes = ['', '/product', '/founders', '/contact', '/privacy', '/terms']
  
  const entries: MetadataRoute.Sitemap = []

  // Global routes
  routes.forEach(route => {
    entries.push({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : 0.5,
    })
  })

  // Language specific landing pages
  languages.forEach(lang => {
    entries.push({
      url: `${base}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })

  return entries
}
