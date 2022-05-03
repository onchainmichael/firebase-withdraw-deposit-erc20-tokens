import { firestore } from "firebase-admin";

export class PendingTransaction {
    constructor(
        public id: string | undefined,
        public userId: string,
        public address: string,
        public timestamp: FirebaseFirestore.Timestamp
    ) {}

    static create(userId: string, address: string) {
        return new PendingTransaction(undefined, userId, address, firestore.Timestamp.now());
    }
}