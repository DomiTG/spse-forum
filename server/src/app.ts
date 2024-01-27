import "dotenv/config";
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import SessionMiddleware from "./middlewares/SessionMiddleware";

import BaseRouter from "./routes";
import AuthRouter from "./routes/auth";
import PostsRouter from "./routes/posts";

import prisma from "./prisma";

export const staticUsers = [
    //{ id: 0, username: "admin", "display_name": "Admin", password: bcrypt.hashSync("admin123", 10) },
    { id: 99999, username: "dontuse", "display_name": "Do not use this user, it won't work for you", password: bcrypt.hashSync("admin123", 10) },
];

try {
    const environments = [`PORT`, `DATABASE_URL`];
    const missingEnvironments = environments.filter((env) => !process.env[env]);
    if(missingEnvironments.length > 0) throw Error(`Missing environment variables: ${missingEnvironments.join(`, `)}`);

    const PORT = process.env.PORT || 5000;
    const app = express();

    app.disable(`x-powered-by`);
    app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(SessionMiddleware);

    const staticUser = async () => {
        const user = await prisma.user.findFirst({ where: { username: "admin" }});
        if(user) {
            if(!user.is_admin) {
                await prisma.user.updateMany({ where: { id: user.id }, data: { "is_admin": true } });
                console.log(`Updated user ${user.username} to admin`)
            } else {
                console.log(`Admin user registered`)
            }
            return;
        }
        await prisma.user.create({ data: { "is_admin": true, username: "admin", display_name: "Admin", password: bcrypt.hashSync("admin123", 10) }, });
    }
    staticUser();

    app.use(`/`, BaseRouter);
    app.use(`/auth`, AuthRouter);
    app.use(`/posts`, PostsRouter);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch(err) {
    console.log(err)
}