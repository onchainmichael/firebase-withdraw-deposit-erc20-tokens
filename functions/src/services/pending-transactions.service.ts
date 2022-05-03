import { Filter, IRepository } from "../repositories/abstractions";
import { PendingTransaction } from "../models";
import { PendingTransactionsRepository } from "../repositories";

export class PendingTransactionsService {
    repository: IRepository<PendingTransaction>

    constructor() {
        this.repository = new  PendingTransactionsRepository();
    }

    getByAddressHash(addressHash: string): Promise<PendingTransaction | null> {
        return this.repository.filterOne(new Filter("address", "==", addressHash));
    }

    create(transaction: PendingTransaction): Promise<void> {
        return this.repository.create(transaction);
    }

    remove(id: string): Promise<void> {
        return this.repository.remove(id);
    }
}