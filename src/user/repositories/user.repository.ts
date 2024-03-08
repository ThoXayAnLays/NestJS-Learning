interface User {
    id: string;
    userName: string;
    email: string;
    password: string;
    refreshToken: string;
    types: string[];
}
export class UserRepository {
    private users: User[] = [];

    public create(user: User): User {
        this.users.push(user);
        return user;
    }

    public findById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    public findAll(): User[] {
        return this.users;
    }

    public update(id: string, updatedUser: Partial<User>): User | undefined {
        const user = this.findById(id);
        if (user) {
            Object.assign(user, updatedUser);
        }
        return user;
    }

    public delete(id: string): void {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
        }
    }
}