import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";


@Injectable()
export class TypesGuard implements CanActivate{
    constructor(
        private reflector: Reflector,
        //private readonly authGuard: AuthGuard
        ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // await this.authGuard.canActivate(context);
        console.log('TypesGuard');

        const requiredTypes = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass()
        ]);
        if(!requiredTypes){
            return true;
        }
        console.log("requiredUserTypes => ", requiredTypes);
        const {user} = context.switchToHttp().getRequest();
        console.log("user => ", user);
        if (!user || typeof user.roles !== 'string') {
            // Handle case where user object or roles property is undefined
            return false; // Or throw an exception
        }
        return requiredTypes.some(role => user.roles.split(',').includes(role));
    }
}