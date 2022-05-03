import { FirestoreRepositoryBase } from "../repositories/abstractions";
import { ConfigKeys } from "../core/enums";

export class ConfigurationService extends FirestoreRepositoryBase {
    constructor() {
        super("configurations");
    }

    async get(key: ConfigKeys): Promise<any> {
        const doc = await this.collection.doc(key).get();
        return doc.data();
    }
}