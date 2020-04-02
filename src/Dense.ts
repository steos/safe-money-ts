import Rational from "./Rational";

export default class Dense<Currency extends string> {
  public readonly value: Rational;
  public readonly currency: Currency;
  private constructor(value: Rational, currency: Currency) {
    this.value = value;
    this.currency = currency;
  }
  static of<T extends string>(value: Rational, currency: T) {
    return new Dense(value, currency);
  }
  static fromDecimal<T extends string>(value: string, currency: T) {
    return new Dense(Rational.fromDecimal(value), currency);
  }
  static nat<T extends string>(value: bigint | number, currency: T) {
    return Dense.of(Rational.nat(value), currency);
  }
  add(that: Dense<Currency>): Dense<Currency> {
    return new Dense<Currency>(this.value.add(that.value), this.currency);
  }
  sub(that: Dense<Currency>): Dense<Currency> {
    return new Dense<Currency>(this.value.sub(that.value), this.currency);
  }
  mul(x: Rational): Dense<Currency> {
    return new Dense<Currency>(this.value.mul(x), this.currency);
  }
  div(x: Rational): Dense<Currency> {
    return new Dense<Currency>(this.value.div(x), this.currency);
  }
  toDecimal() {
    return this.value.toDecimal();
  }
  toNumber() {
    return this.value.toNumber();
  }
}
