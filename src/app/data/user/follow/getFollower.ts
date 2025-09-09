import prisma from "@/lib/prisma";

// ✅ Users this user is following
export async function getFollowing(followerId: string) {
  return await prisma.user.findMany({
    where: {
      followers: {
        some: {
          followerId: followerId,
        },
      },
    },
    include: {
      followers: true
    }
  });
}

// ✅ Users who follow this user
export async function getFollowers(followingId: string) {
  return await prisma.user.findMany({
    where: {
      following: {
        some: {
          followingId: followingId,
        },
      },
    },
    include: {
      following: true
    }
  });
}
