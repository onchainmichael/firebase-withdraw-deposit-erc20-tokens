import { Filter, FirestoreRepositoryBase as FirestoreRepositoryBase, IRepository } from "./abstractions";
import { User } from "../models";


export class UsersRepository extends FirestoreRepositoryBase implements IRepository<User> {
    constructor() {
        super("users");
    }

    async getOne(id: string): Promise<User | null> {
        const doc = await this.collection.doc(id).get();
        return this.mapUser(doc);
    }

    async filterAll(filter: Filter | Filter[] | null): Promise<User[]> {
        const snapshot = await this.filterSnapshot(filter);
        return snapshot.empty ? [] : this.mapResult(snapshot);
    }

    async filterOne(filter: Filter | Filter[] | null): Promise<User | null> {
        const snapshot = await this.filterSnapshot(filter);
        return snapshot.empty ? null : this.mapUser(snapshot.docs[0]);
    }

    async create(user: User): Promise<void> {
        await this.collection.add(Object.assign({}, user));
    }

    async update(user: User): Promise<void> {
        const doc = this.collection.doc(user.id);
        await doc.update(Object.assign({}, user));
    }

    async remove(id: string): Promise<void> {
        const doc = await this.collection.doc(id).get();
        await doc.ref.delete();
    }


    private mapUser(doc: any) {
        const e = doc.data();
        return e ? new User(doc.id, e.hash, e.nickname, e.balance) : null;
    }

    private mapResult(data: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) {
        const result: User[] = [];

        data.forEach(doc => {
            result.push(this.mapUser(doc) as User);
        });

        return result;
    }
}