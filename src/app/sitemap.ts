import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://markdown.develop-on.co.kr'
  const locales = ['ko', 'en', 'ja', 'zh']
  const currentDate = new Date()

  // Generate sitemap entries for each locale
  const localeEntries = locales.map(locale => ({
    url: `${baseUrl}/${locale}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: locale === 'ko' ? 1.0 : 0.9,
    alternates: {
      languages: locales.reduce((acc, loc) => {
        acc[loc === 'zh' ? 'zh-CN' : loc === 'ja' ? 'ja-JP' : loc === 'ko' ? 'ko-KR' : 'en'] = `${baseUrl}/${loc}`
        return acc
      }, {} as Record<string, string>)
    }
  }))

  // Root URL redirects to default locale
  const rootEntry = {
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }

  return [
    rootEntry,
    ...localeEntries,
  ]
}
