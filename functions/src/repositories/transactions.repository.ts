import { Filter, FirestoreRepositoryBase, IRepository } from "./abstractions";
import { Transaction } from "../models";


export class TransactionsRepository extends FirestoreRepositoryBase implements IRepository<Transaction> {
    constructor() {
        super("transactions");
    }

    async getOne(id: string): Promise<Transaction | null> {
        const doc = await this.collection.doc(id).get();
        return this.mapTransaction(doc);
    }

    async filterAll(filter: Filter | Filter[] | null = null): Promise<Transaction[]> {
        const snapshot = await this.filterSnapshot(filter);
        return snapshot.empty ? [] : this.mapResult(snapshot);
    }

    async filterOne(filter: Filter | Filter[] | null): Promise<Transaction | null> {
        const snapshot = await this.filterSnapshot(filter);
        return snapshot.empty ? null : this.mapTransaction(snapshot.docs[0]);
    }

    async create(transaction: Transaction): Promise<void> {
        transaction.id = undefined;
        await this.collection.add(Object.assign({}, transaction));
    }

    async update(transaction: Transaction): Promise<void> {
        const doc = this.collection.doc(transaction.id as string);
        await doc.update(Object.assign({}, transaction));
    }

    async remove(id: string): Promise<void> {
        const doc = await this.collection.doc(id).get();
        await doc.ref.delete();
    }


    private mapTransaction(doc: any) {
        const e = doc.data();
        return e ? new Transaction(doc.id, e.hash, e.type, e.amount, e.timestamp) : null;
    }

    private mapResult(data: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) {
        const result: Transaction[] = [];

        data.forEach(doc => {
            result.push(this.mapTransaction(doc) as Transaction);
        });

        return result;
    }
}