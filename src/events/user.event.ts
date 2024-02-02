export class UserCreatedEvent {
    constructor(
        public readonly userId: string, 
        public readonly fullName: string,
    ) {}
}