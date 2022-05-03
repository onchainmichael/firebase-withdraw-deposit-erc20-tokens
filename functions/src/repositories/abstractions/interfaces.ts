import { firestore } from "firebase-admin";
import { Filter } from ".";

export abstract class FirestoreRepositoryBase {
    private readonly _collection: firestore.CollectionReference<firestore.DocumentData>;

    constructor(collectionName: string) {
        this._collection = firestore().collection(collectionName);
    }

    get collection(): firestore.CollectionReference <firestore.DocumentData> {
        return this._collection;
    }

    protected async filterSnapshot(filter: Filter | Filter[] | null): Promise<firestore.QuerySnapshot<firestore.DocumentData>> {
        let query = this.collection;
        if (Array.isArray(filter)) {
            filter.forEach((f: Filter) => {
                query = query.where(f.field, f.op, f.value) as any;
            });
        } else if (filter) {
            query = query.where(filter.field, filter.op, filter.value) as any;
        }

        return await query.get();
    }
}

export type RepoFilter = Filter | Filter[] | null;

export interface IRepository<T> {
    getOne(id: string): Promise<T | null>;

    filterAll(filter?: RepoFilter): Promise<T[]> ;
    filterOne(filter: RepoFilter): Promise<T | null>;

    create(e: T): Promise<void>;
    update(e: T): Promise<void>;
    remove(id: string): Promise<void>;
}

