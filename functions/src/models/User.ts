export class User {
    constructor(
        public id: string,
        public hash: string,
        public nickname: string,
        public balance: number,
    ) {}
}