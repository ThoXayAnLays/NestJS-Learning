import { NotFoundException } from "@nestjs/common";

export default class GenreNotFoundException extends NotFoundException {
    constructor(movieId: string) {
        super(`Genre with id ${movieId} not found`);
    }
}