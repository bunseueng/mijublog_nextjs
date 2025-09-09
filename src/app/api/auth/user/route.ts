import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { image, image_public_id, name, email, description, password } =
      await req.json();
    const user = await auth.api.getSession({ headers: await headers() });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    if (image) {
      const imgId = image_public_id;
      if (imgId) {
        cloudinary.uploader.destroy(imgId);
      }
    }

    const uploadRes = await cloudinary.uploader.upload(image as string, {
      upload_preset: "mijublog_profile_avatar",
    });

    const updatingProfile = await prisma.user.update({
      where: {
        id: user.user.id,
      },
      data: {
        image: uploadRes.url,
        image_public_id: uploadRes.public_id,
        name,
        email,
        description,
        password,
      },
    });
    return NextResponse.json(
      { message: "Successfully updated", updatingProfile },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Bad Request", error },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const user = await auth.api.getSession({ headers: await headers() });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
    }

    const updatingProfile = await prisma.user.delete({
      where: {
        id: user.user.id,
      },
    });
    return NextResponse.json(
      { message: "Successfully updated", updatingProfile },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Bad Request", error },
      { status: 500 }
    );
  }
}
