import { firestore } from "firebase-admin";
import { TransactionType } from "../core/enums";

export class Transaction {
    constructor(
        public id: string | undefined,
        public hash: string,
        public type: TransactionType,
        public amount: number,
        public timestamp: FirebaseFirestore.Timestamp
    ) {}

    static createWithdraw(hash: string, amount: number) {
        return new Transaction(undefined, hash, TransactionType.Withdraw, amount, firestore.Timestamp.now())
    }

    static createDeposit(hash: string, amount: number) {
        return new Transaction(undefined, hash, TransactionType.Deposit, amount, firestore.Timestamp.now())
    }
}