import { Filter, IRepository } from "../repositories/abstractions";
import { UsersRepository } from "../repositories";
import { User } from "../models";


export class UsersService {
    repository: IRepository<User>

    constructor() {
        this.repository = new UsersRepository();
    }

    getByAddressHash(addressHash: string): Promise<User | null> {
        return this.repository.filterOne(new Filter("hash", "==", addressHash));
    }

    update(user: User): Promise<void> {
        return this.repository.update(user);
    }
}