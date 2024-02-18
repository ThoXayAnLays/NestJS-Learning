export class MovieNotFoundException extends Error {
    constructor(id: string) {
        super(`Movie with id ${id} not found`);
    }
}