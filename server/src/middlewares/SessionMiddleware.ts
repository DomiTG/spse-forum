import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export default (req: Request, _res: Response, next: NextFunction) => {
    const accessToken = req.headers['x-access-token'] && (req.headers['x-access-token'] as string).split(' ')[1];

    if (!accessToken) return next();

    try {
        const token: any = verify(accessToken, String(process.env.ACCESS_TOKEN_SECRET));
        req.user = token;

        next();
    } catch (err) {
        next();
    }
};