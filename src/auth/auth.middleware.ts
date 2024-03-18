import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) { }
    private excludedRoutes = ['/api/auth/login', '/api/auth/register'];

    use(req: Request, res: Response, next: NextFunction) {
        const path = req.path;
        if (this.excludedRoutes.includes(path)) {
            // Skip authentication middleware for excluded routes
            return next();
        }
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = this.jwtService.verify(token);
                req.user = decoded; // Assign decoded user data to request object
            } catch (error) {
                // Handle token verification error
            }
        } 
        // else {
        //     // Handle missing or invalid Authorization header
        //     // For example, you might want to return a 401 Unauthorized response
        //     res.status(401).json({ message: 'Unauthorized' });
        //     return;
        // }
        next();
    }
}
