import { Router } from "express";
import prisma from "../../prisma";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { staticUsers } from "../../app";

const router = Router();

router.post("/refresh", async (req, res) => {
    const cookie = req.cookies["x-refresh-token"];
    if(!cookie) return res.status(401).send({ success: false, message: "Unauthorized" });

    try {
        const refreshToken = await prisma.refreshTokens.findFirst({ where: { token: cookie } });
        if(!refreshToken || refreshToken.expires.getTime() < Date.now()) {
            if(refreshToken) await prisma.refreshTokens.delete({ where: { id: refreshToken.id } });
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }

        const user = await prisma.user.findFirst({ where: { id: refreshToken.user_id } }) || staticUsers.find(user => user.id === refreshToken.user_id);
        if(!user) return res.status(401).send({ success: false, message: "Unauthorized" });

        const accessToken = jsonwebtoken.sign({ id: user.id }, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: "15m" });
        return res.status(200).send({ success: true, accessToken, user: { ...user, password: null } });
    } catch(err) {
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ success: false, message: "You haven't entered a username or password" });
    try {
        const user = await prisma.user.findFirst({ where: { username: username.toLowerCase() } }) || staticUsers.find(user => user.username === username.toLowerCase());
        if(!user) return res.status(400).json({ success: false, message: "User not found" });
        if(!bcrypt.compareSync(password, user.password)) return res.status(401).json({ success: false, message: "Incorrect password" });
        
        const refreshToken = jsonwebtoken.sign({ id: user.id }, String(process.env.REFRESH_TOKEN_SECRET), { expiresIn: "7d" });
        await prisma.refreshTokens.create({ data: { token: refreshToken, user_id: user.id, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) } });
        const accessToken = jsonwebtoken.sign({ id: user.id }, String(process.env.ACCESS_TOKEN_SECRET), { expiresIn: "15m" });
        return res.status(200).cookie("x-refresh-token", refreshToken, { httpOnly: true }).json({ success: true, accessToken, user: { ...user, password: null } });
    } catch(err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/register", async (req, res) => {
    const { username, display_name, password } = req.body;
    if(!username || !display_name || !password) return res.status(400).json({ success: false, message: "You haven't entered a username, display name or password" });
    try {
        const usernameExists = await prisma.user.findFirst({ where: { username: username.toLowerCase() } }) || staticUsers.find(user => user.username === username.toLowerCase());
        if(usernameExists) return res.status(400).json({ success: false, message: "Username already exists" });
        await prisma.user.create({ data: { username: username.toLowerCase(), display_name, password: bcrypt.hashSync(password, 10) } });
        return res.status(200).json({ success: true, message: "Your account has been created, you can now login" });
    } catch(err) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/logout", async (req, res) => {
    const cookie = req.cookies["x-refresh-token"];
    if(!cookie) return res.status(401).send({ success: false, message: "Unauthorized" });

    try {
        const refreshToken = await prisma.refreshTokens.findFirst({ where: { token: cookie } });
        if(!refreshToken || refreshToken.expires.getTime() < Date.now()) {
            if(refreshToken) await prisma.refreshTokens.delete({ where: { id: refreshToken.id } });
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }

        await prisma.refreshTokens.delete({ where: { id: refreshToken.id } });
        return res.status(200).send({ success: true, message: "Logged out" });
    } catch(err) {
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
});

export default router;