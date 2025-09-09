import { CommentType } from "@/types/Comment";

export function commentTree(comments: CommentType[]) {
    const map =  new Map()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roots: any[] = []

    comments.forEach(c => map.set(c.id, {...c, replies: []}))
    comments.forEach(c => {
        if(c.parentId) {
            map.get(c.parentId).replies.push(map.get(c.id))
        } else {
            roots.push(map.get(c.id))
        }
    })

    return roots
}