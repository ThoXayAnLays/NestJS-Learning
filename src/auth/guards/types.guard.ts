import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";


@Injectable()
export class TypesGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean {
        console.log('TypesGuard');

        const requiredTypes = this.reflector.getAllAndOverride<string[]>('types', [
            context.getHandler(),
            context.getClass()
        ]);
        if(!requiredTypes){
            return true;
        }
        console.log("requiredUserTypes => ", requiredTypes);
        const {user} = context.switchToHttp().getRequest();
        console.log("user => ", user);
        return requiredTypes.some(type => user.types.split('.').includes(type));
    }
}