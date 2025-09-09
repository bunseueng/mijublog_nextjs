import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
    try {
        const user = await auth.api.getSession({headers: await headers()})
        
        if (!user?.user?.id) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        
        const commentId = (await props.params).id

        // Check if THIS user already liked THIS specific comment
        const existingLike = await prisma.commentLike.findFirst({
            where: {
                commentId: commentId,
                userId: user.user.id
            }
        })

        if (existingLike) {
            return NextResponse.json({
                message: "Already liked", 
                alreadyLiked: true
            }, {status: 400})
        }

        // Create the like
        const likes = await prisma.commentLike.create({
            data: {
                commentId: commentId,
                userId: user.user.id,
                createdAt: new Date()
            }
        })

        return NextResponse.json({
            message: "Successfully liked comment", 
            likes
        }, {status: 200})
        
    } catch (error) {
        console.error("Like error:", error)
        return NextResponse.json({
            message: "Failed to like comment", 
            error: error instanceof Error ? error.message : "Unknown error"
        }, {status: 500})
    }
}

export async function DELETE(
    req: Request, 
    props: {params: Promise<{id: string}>}
) {
    try {
        const user = await auth.api.getSession({headers: await headers()})

        if (!user?.user?.id) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const commentId = (await props.params).id

        // Find the specific like by THIS user for THIS comment
        const existingLike = await prisma.commentLike.findFirst({
            where: {
                commentId: commentId,
                userId: user.user.id
            }
        })

        if (!existingLike) {
            return NextResponse.json({
                message: "Like not found"
            }, {status: 404})
        }

        // Delete the like
        const unlike = await prisma.commentLike.delete({
            where: {
                id: existingLike.id
            }
        })

        return NextResponse.json({
            message: "Successfully unliked comment", 
            unlike
        }, {status: 200})
        
    } catch (error) {
        console.error("Unlike error:", error)
        return NextResponse.json({
            message: "Failed to unlike comment", 
            error: error instanceof Error ? error.message : "Unknown error"
        }, {status: 500})
    }
}