import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mijudramablog.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/setting*',
          '/new-blog*',
          '/login*',
          '/signup*',
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/private/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}