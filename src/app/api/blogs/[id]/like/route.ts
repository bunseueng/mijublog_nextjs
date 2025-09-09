import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const postId = (await props.params).id;
    const user = await auth.api.getSession({ headers: await headers() });

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user?.user.id,
        postId: postId
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    if (existingLike) {
      return NextResponse.json(
        { message: "Already like this post" },
        { status: 400 }
      );
    }

    const like = await prisma.like.create({
      data: {
        userId: user.user.id,
        postId: postId,
      },
    });

    return NextResponse.json(
      { message: "You liked this post", like },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Bad Request", error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const postId = (await props.params).id;
    const user = await auth.api.getSession({ headers: await headers() });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId: postId,
        userId: user.user.id,
      },
    });

    if (!existingLike) {
      return NextResponse.json(
        {
          message: "Like not found",
        },
        { status: 404 }
      );
    }
    const unlike = await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
    return NextResponse.json(
      { message: "You unliked this post", unlike },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Bad Request", error },
      { status: 500 }
    );
  }
}
