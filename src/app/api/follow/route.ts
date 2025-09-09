import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {userId} = await req.json()
        const user = await auth.api.getSession({headers: await headers()})
    
        if(!user) {
            return NextResponse.json({message: "Unauthorized"}, { status: 404 })
        }

        if(user.user.id === userId) {
            return NextResponse.json({error: 'You cannot follow urself'}, {status: 405})
        }


        const follow = await prisma.follow.create({
            data: {
                followerId: user.user.id,
                followingId: userId
            }
        })

        return NextResponse.json({message: "Successfully following this user", follow}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "Bad Request", error}, {status: 500})
    }
}

export async function DELETE(req: Request) {
    try {
        const {userId} = await req.json()
        const user = await auth.api.getSession({headers: await headers()})
        
        if(!user) {
            return NextResponse.json({message: "Unauthorized"}, { status: 404 })
        }

        const isFollowing = await prisma.follow.findFirst({
            where: {
                followingId: userId,
                followerId: user.user.id
            }
        })

            const unfollow = await prisma.follow.delete({
                where: {
                    id: isFollowing?.id
                }
            })
            console.log(unfollow, 'unfollow')
        return NextResponse.json({message: "Successfully following this user", unfollow}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "Bad Request", error}, {status: 500})
    }
}