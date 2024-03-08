import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";


@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean {
        console.log('RolesGuard');

        const requiredRoles = this.reflector.getAllAndOverride<string[]>('types', [
            context.getHandler(),
            context.getClass()
        ]);
        if(!requiredRoles){
            return true;
        }
        console.log("requiredRoles => ", requiredRoles);
        const {user} = context.switchToHttp().getRequest();
        console.log("user => ", user);
        return requiredRoles.some(type => user.types.split('.').includes(type));
    }
}