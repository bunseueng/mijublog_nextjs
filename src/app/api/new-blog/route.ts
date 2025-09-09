import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await auth.api.getSession({headers: await headers()})
    if(!user) {
        return NextResponse.json({message: 'User Not Authorized'}, {status: 404})
    }

    const {
      title,
      metaTitle,
      slug,
      content,
      metaDescription,
      excerpt,
      featuredImage,
      status,
      readingTime,
      wordCount,
      authorId,
      tags,
      category
    } = await req.json();

    // Validate required fields
    if (!title || !slug || !content || !authorId) {
      return NextResponse.json(
        { message: "Missing required fields: title, slug, content, or authorId" },
        { status: 400 }
      );
    }

    let uploadRes = null;
    if (featuredImage) {
      try {
        uploadRes = await cloudinary.uploader.upload(featuredImage, {
          upload_preset: 'mijublog_featured_img'
        });
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return NextResponse.json(
          { message: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const data = await prisma.post.create({
      data: {
        title,
        metaTitle,
        slug,
        content,
        metaDescription,
        excerpt,
        featuredImage: uploadRes?.url || null,
        featuredImage_public_id: uploadRes?.public_id || null,
        status: status || "DRAFT",
        readingTime: readingTime ? parseInt(readingTime.toString()) : null,
        wordCount: wordCount ? parseInt(wordCount.toString()) : null,
        authorId: authorId,
        // Only create tags if they exist and are not empty
        ...(tags && tags.length > 0 && {
          tags: {
            create: tags.map((tagName: string) => ({
              tag: {
                connectOrCreate: {
                  where: {
                    name: tagName,
                  },
                  create: {
                    name: tagName,
                    slug: tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                  }
                }
              }
            }))
          }
        }),
        categoryId: category
      },
      include: {
        author: true,
        category: true,
        tags: { 
          include: { 
            tag: true 
          } 
        },
      },
    });

    return NextResponse.json({ 
      message: "Blog successfully created", 
      data 
    }, { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Full error details:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: "A post with this slug already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}