import { Router } from "express";
import prisma from "../../prisma";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
const router = Router();

router.get("/:limit/:offset", async (req, res) => {
    const { limit, offset } = req.params;
    const posts = await prisma.post.findMany({
        take: Number(limit),
        skip: Number(offset),
        orderBy: { created: "desc" },
        include: {
            comments: {
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            display_name: true
                        }
                    }
                }
            },
            likes: {
                include: {
                    user:  {
                        select: {
                            id: true,
                            username: true,
                            display_name: true
                        }
                    }
                }
            },
            author: {
                select: {
                    id: true,
                    username: true,
                    display_name: true
                }
            }
        }
    });
    return res.status(200).json({ success: true, posts });
});

router.post("/", AuthMiddleware, async (req, res) => {
    const { user } = req;
    const { title, description, content } = req.body;

    try {
        const post = await prisma.post.create({
            data: {
                title,
                description,
                content,
                author_id: user.id
            }
        });
        return res.status(201).json({ success: true, post });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to create post" });
    }
});

router.post("/comment", AuthMiddleware, async (req, res) => {
    const { user } = req;
    const { post_id, content } = req.body;

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                author_id: user.id,
                post_id
            }
        });
        return res.status(201).json({ success: true, comment });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Failed to create comment" });
    }
});

router.post("/like", AuthMiddleware, async (req, res) => {
    //if already liked just remove like
    const { user } = req;
    const { post_id } = req.body;
    try {
        const like = await prisma.postLike.findFirst({ where: { post_id, user_id: user.id } });
        if(like) {
            await prisma.postLike.delete({ where: { id: like.id } });
            return res.status(200).json({ success: true, message: "Like removed" });
        }
        await prisma.postLike.create({ data: { post_id, user_id: user.id } });
        return res.status(201).json({ success: true, message: "Post liked" });
    } catch(err) {
        return res.status(500).json({ success: false, error: "Failed to like post" });
    }
});

router.delete("/:id", AuthMiddleware, async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    //admin can delete all posts, user can only delete their own posts
    try {
        const post = await prisma.post.findFirst({ where: { id: Number(id) } });
        if(!post) return res.status(404).json({ success: false, error: "Post not found" });
        if(post.author_id !== user.id && !user.is_admin) return res.status(401).json({ success: false, error: "Unauthorized" });
        await prisma.comment.deleteMany({ where: { post_id: Number(id) } });
        await prisma.postLike.deleteMany({ where: { post_id: Number(id) } });
        await prisma.post.delete({ where: { id: Number(id) } });
        return res.status(200).json({ success: true, message: "Post deleted" });
    } catch(err) {
        console.log(err)
        return res.status(500).json({ success: false, error: "Failed to delete post" });
    }
});

export default router;