import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const author = await auth.api.getSession({ headers: await headers() });
  const postId = (await props.params).id;
  const { content, parentId } = await req.json();

  if (!author?.user) {
    return;
  }

  try {
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, postId: true },
      });

      if (parentComment) {
        const replyComment = await prisma.comment.create({
          data: {
            postId: parentComment.postId,
            authorId: author?.user.id,
            content: content,
            parentId: parentComment.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
        
        return NextResponse.json(
            { message: "Successfully commentting", replyComment },
            { status: 200 }
        );
        }

    }

    const newComment = await prisma.comment.create({
      data: {
        postId: postId,
        authorId: author?.user.id,
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      { message: "Successfully commentting", newComment },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Bad Request" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await auth.api.getSession({ headers: await headers() });
    const postId = (await props.params).id;
    const { commentId } = await req.json();

    if (!user?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const getComment = await prisma.comment.findFirst({
      where: {
        postId: postId,
      },
    });

    const isOwnerOfComment = getComment?.authorId === user?.user.id;

    if (!isOwnerOfComment) {
      return NextResponse.json(
        { message: `You're not owner of this comment` },
        { status: 405 }
      );
    }

    const deleteComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json(
      { message: "Comment Deleted Successfully", deleteComment },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Bad Request", error },
      { status: 500 }
    );
  }
}
