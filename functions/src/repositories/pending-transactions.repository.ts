import { Filter, FirestoreRepositoryBase, IRepository } from "./abstractions";
import { PendingTransaction } from "../models";


export class PendingTransactionsRepository extends FirestoreRepositoryBase implements IRepository<PendingTransaction> {
    constructor() {
        super("pending-transactions");
    }

    async getOne(id: string): Promise<PendingTransaction | null> {
        const doc = await this.collection.doc(id).get();
        return this.mapTransaction(doc);
    }

    async filterAll(filter: Filter | Filter[] | null = null): Promise<PendingTransaction[]> {
        const snapshot = await this.filterSnapshot(filter);
        return snapshot.empty ? [] : this.mapResult(snapshot);
    }

    async filterOne(filter: Filter | Filter[] | null): Promise<PendingTransaction | null> {
        const snapshot = await this.filterSnapshot(filter);
        return snapshot.empty ? null : this.mapTransaction(snapshot.docs[0]);
    }

    async create(transaction: PendingTransaction): Promise<void> {
        transaction.id = undefined;
        await this.collection.add(Object.assign({}, transaction));
    }

    async update(transaction: PendingTransaction): Promise<void> {
        const doc = this.collection.doc(transaction.id as string);
        await doc.update(Object.assign({}, transaction));
    }

    async remove(id: string): Promise<void> {
        const doc = await this.collection.doc(id).get();
        await doc.ref.delete();
    }


    private mapTransaction(doc: any) {
        const e = doc.data();
        return e ? new PendingTransaction(doc.id, e.userId, e.address, e.timestamp) : null;
    }

    private mapResult(data: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) {
        const result: PendingTransaction[] = [];

        data.forEach(doc => {
            result.push(this.mapTransaction(doc) as PendingTransaction);
        });

        return result;
    }
}