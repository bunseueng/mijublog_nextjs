import { MetadataRoute } from 'next'
import { PrismaClient } from '../../prisma/generated/prisma'

const prisma = new PrismaClient()


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mijudramablog.vercel.app'

  // Static routes - high priority pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    // Add blog pagination pages
    const POSTS_PER_PAGE = 12
    const totalPosts = await prisma.post.count({
      where: {
        status: 'PUBLISHED',
      },
    })
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
    
    const blogPaginationRoutes: MetadataRoute.Sitemap = []
    for (let page = 1; page <= totalPages; page++) {
      blogPaginationRoutes.push({
        url: `${baseUrl}/blog/page/${page}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: page === 1 ? 0.9 : 0.7, // First page gets higher priority
      })
    }

    // Dynamic routes - blog posts
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
        viewCount: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    })

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: calculatePostPriority(post.viewCount),
    }))

    // Dynamic routes - categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
    })

    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((category) => category._count.posts > 0) // Only include categories with published posts
      .map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))

    // Dynamic routes - user profiles (only for users with published posts)
    const activeUsers = await prisma.user.findMany({
      where: {
        posts: {
          some: {
            status: 'PUBLISHED',
          },
        },
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
    })

    const userRoutes: MetadataRoute.Sitemap = activeUsers.map((user) => ({
      url: `${baseUrl}/profile/@${user.name}`,
      lastModified: user.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: calculateAuthorPriority(user._count.posts),
    }))

    return [...staticRoutes, ...blogPaginationRoutes, ...postRoutes, ...categoryRoutes, ...userRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes if database query fails
    return staticRoutes
  } finally {
    await prisma.$disconnect()
  }
}

function calculatePostPriority(viewCount: number): number {
  // Higher view count = higher priority
  if (viewCount > 1000) return 0.9
  if (viewCount > 500) return 0.8
  if (viewCount > 100) return 0.7
  if (viewCount > 50) return 0.6
  return 0.5
}

function calculateAuthorPriority(postCount: number): number {
  // More posts = higher priority
  if (postCount > 20) return 0.7
  if (postCount > 10) return 0.6
  if (postCount > 5) return 0.5
  return 0.4
}