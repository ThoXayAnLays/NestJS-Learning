import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private excludedRoutes = ['/api/auth/login', '/api/auth/register'];
    use(req: Request, res: Response, next: NextFunction) {
        const path = req.originalUrl;

        if (this.excludedRoutes.includes(path)) {
            // Skip authentication for excluded routes
            return next();
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid or missing Authorization header');
        }

        const token = authHeader.split(' ')[1];
        try {
            const decodedToken = jwt.verify(token, process.env.AT_SECRET) as { userId: string };
            req['userId'] = decodedToken.userId; // Add userId to the request object
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
