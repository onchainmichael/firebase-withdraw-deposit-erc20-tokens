import { Filter, IRepository } from "../repositories/abstractions";
import { TransactionsRepository } from "../repositories";
import { Transaction } from "../models";

export class TransactionsService {
    repository: IRepository<Transaction>

    constructor() {
        this.repository = new TransactionsRepository();
    }

    getByHash(hash: string): Promise<Transaction | null> {
        return this.repository.filterOne(new Filter("hash", "==", hash));
    }

    create(transaction: Transaction): Promise<void> {
        return this.repository.create(transaction);
    }
}