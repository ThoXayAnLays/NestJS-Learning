import { SetMetadata } from "@nestjs/common";

export const Roles = (...types: string[]) => SetMetadata('types', types);