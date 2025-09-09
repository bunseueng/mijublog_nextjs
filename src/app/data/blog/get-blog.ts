import prisma from "@/lib/prisma";

export async function getBlog(skip?: number, POSTS_PER_PAGE?:number) {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
       author: true,
      category: true,
      tags: {
        include: {
          tag: true, // ✅ get the Tag info from PostTag
        },
      },
      likes: true
    },
    skip,
    take: POSTS_PER_PAGE
  });
}

export async function getBlogById(slug: string) {
  return prisma.post.findUnique({
    where: {
      slug: slug
    },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true, // ✅ get the Tag info from PostTag
        },
      },
      likes: true
    },
  })
}

export async function getCategories() {
  return prisma.category.findMany({})
}

export async function getComment(postId:string) {
  return prisma.comment.findMany({
    where: {
      postId: postId
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      likes: true
    }
  })
}

export async function getSavedPost(userId: string) {
  return prisma.savedPost.findMany({
    where: {
      userId
    },
    include: {
      post: true
    }
  })
}

export async function getTags() {
  return prisma.tag.findMany()
}

export async function getPopularMonthlyBlogs(limit: number = 4) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  try {
    const popularPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: {
        viewCount: 'desc',
      },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          take: 2,
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return popularPosts;
  } catch (error) {
    console.error('Error fetching popular monthly blogs:', error);
    return [];
  }
}

// Alternative function to get popular posts from all time if current month has no posts
export async function getPopularBlogs(limit: number = 4) {
  try {
    const popularPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        viewCount: 'desc',
      },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          take: 2,
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return popularPosts;
  } catch (error) {
    console.error('Error fetching popular blogs:', error);
    return [];
  }
}