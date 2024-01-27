import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { staticUsers } from '../app';

export default async (req: Request, res: Response, next: NextFunction) => {
    let { user } = req;

    if(!user) return res.status(401).json({ error: 'Unauthorized' });
    user = await prisma.user.findFirst({ where: { id: user.id } }) || staticUsers.find(u => u.id === user.id);
    if(!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    return next();
}