import { PrismaClient } from "../../prisma/generated/prisma"

const prisma = new PrismaClient()

export interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export async function generateDynamicSitemapEntries(baseUrl: string): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = []

  try {
    // Get all published blog posts
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

    // Add blog post entries with dynamic priority based on view count
    posts.forEach((post) => {
      const priority = calculatePostPriority(post.viewCount)
      entries.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority,
      })
    })

    // Get categories with published posts
    const categories = await prisma.category.findMany({
      include: {
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

    // Add category entries
    categories
      .filter((category) => category._count.posts > 0)
      .forEach((category) => {
        entries.push({
          url: `${baseUrl}/category/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })

    // Get active authors (users with published posts)
    const authors = await prisma.user.findMany({
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

    // Add author profile entries
    authors.forEach((author) => {
      const priority = calculateAuthorPriority(author._count.posts)
      entries.push({
        url: `${baseUrl}/profile/${author.id}`,
        lastModified: author.updatedAt,
        changeFrequency: 'monthly',
        priority,
      })
    })

    return entries
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error)
    return []
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

export async function getRecentPosts(limit: number = 50) {
  return await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  })
}

export async function getCategoriesWithPosts() {
  return await prisma.category.findMany({
    where: {
      posts: {
        some: {
          status: 'PUBLISHED',
        },
      },
    },
    select: {
      slug: true,
      name: true,
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
}