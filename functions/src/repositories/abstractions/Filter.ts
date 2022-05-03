export class Filter {
    constructor(
        private _field: string,
        private _op: FirebaseFirestore.WhereFilterOp,
        private _value: string
    ) {}

    public get field(): string {
        return this._field;
    }
    public get op(): FirebaseFirestore.WhereFilterOp {
        return this._op;
    }
    public get value(): string {
        return this._value;
    }

    toString(): string {
        return `${this._field} ${this._op} ${this._value}`;
    }
}
