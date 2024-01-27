import prisma from "../../prisma";

declare global {
    namespace Express {
        export interface Request {
            user: any;
        }
    }
}