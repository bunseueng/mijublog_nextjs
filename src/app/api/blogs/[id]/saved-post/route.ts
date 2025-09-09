import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req:Request, {params} : {params: Promise<{id: string}>}) {
    try {
        const postId = (await params).id
        const user = await auth.api.getSession({headers: await headers()})

        if(!user) {
            return NextResponse.json({error: "Unauthorized"}, {status: 404})
        }

        const saved_post = await prisma.savedPost.create({
            data: {
                postId,
                userId: user.user.id
            }
        })

        if(!saved_post) {
            return NextResponse.json({error: "Failed to save post"}, {status: 405})
        }

        return NextResponse.json({saved_post}, {status: 200})
    } catch (error) {
            return NextResponse.json({message: "Bad Request", error}, {status: 500})
    }
}

export async function DELETE(req:Request, {params} : {params: Promise<{id: string}>}) {
    try {
        const postId = (await params).id
        const user = await auth.api.getSession({headers: await headers()})

        if(!user) {
            return NextResponse.json({error: "Unauthorized"}, {status: 404})
        }

        const getPost = await prisma.savedPost.findFirst({
            where: {
                postId,
                userId: user.user.id
            }
        })

        const deleting_post = await prisma.savedPost.delete({
            where: {
                id: getPost?.id,
                userId: user.user.id
            }
        })

        if(!deleting_post) {
            return NextResponse.json({error: "Failed to save post"}, {status: 405})
        }

        return NextResponse.json({deleting_post}, {status: 200})
    } catch (error) {
            return NextResponse.json({message: "Bad Request", error}, {status: 500})
    }
}