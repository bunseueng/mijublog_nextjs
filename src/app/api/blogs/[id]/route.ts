import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await auth.api.getSession({headers: await headers()})
    const post = await prisma.post.findUnique({
      where: {
        id: (await props.params).id
      }
    })
    const owner = post?.authorId === user?.user.id

    if(!owner) {
        return NextResponse.json({message: `You're not owner of this blog`}, {status: 404})
    }

    const postId = (await props.params).id;

    const formData = await req.json();

    if (formData?.isOldImage.startsWith('https:')) {
      const imgId = formData.featuredImage_public_id;
      if (imgId) {
        await cloudinary.uploader.destroy(imgId);
      }
    }

    const uploadRes = await cloudinary.uploader.upload(
      formData?.featuredImage,
      {
        upload_preset: "mijublog_featured_img",
      }
    );

    const data_to_upload = {
      title: formData?.title,
      slug: formData?.slug,
      metaTitle: formData?.metaTitle,
      content: formData?.content,
      metaDescription: formData?.metaDescription,
      excerpt: formData?.excerpt,
      status: formData?.status,
      readingTime: formData?.readingTime,
      wordCount: formData?.wordCount,
      authorId: formData?.authorId,
      // Only create tags if they exist and are not empty
      ...(formData?.tags &&
        formData?.tags.length > 0 && {
          tags: {
            deleteMany: {
              postId: postId,
            },
            create: formData?.tags.map((tagName: string) => ({
              tag: {
                connectOrCreate: {
                  where: {
                    name: tagName,
                  },
                  create: {
                    name: tagName,
                    slug: tagName
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, ""),
                  },
                },
              },
            })),
          },
        }),
      category: {
        connect: {
          name: formData.category
        }
      }
    };

    if (uploadRes) {
      const data = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          ...data_to_upload,
          featuredImage: uploadRes?.url || null,
          featuredImage_public_id: uploadRes?.public_id || null,
        },
        include: {
          author: true,
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      return NextResponse.json(
        {
          message: "Blog successfully created",
          data,
        },
        { status: 200 }
      );
    }

    const data = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...data_to_upload,
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Blog successfully created",
        data,
      },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Full error details:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
