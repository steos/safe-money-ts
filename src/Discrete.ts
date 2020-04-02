/*global BigInt*/
import Dense from "./Dense";
import Rational from "./Rational";

export type Scale<Currency extends string, Unit extends string> = {
  tag: Unit;
  currency: Currency;
  ratio: Rational;
};

export default class Discrete<Currency extends string, Unit extends string> {
  public readonly value: bigint;
  public readonly scale: Scale<Currency, Unit>;
  private constructor(value: bigint, scale: Scale<Currency, Unit>) {
    this.value = value;
    this.scale = scale;
  }
  static of<Currency extends string, Unit extends string>(
    value: bigint | number,
    scale: Scale<Currency, Unit>
  ): Discrete<Currency, Unit> {
    return new Discrete(BigInt(value), scale);
  }
  static scale<Currency extends string, Unit extends string>(
    currency: Currency,
    tag: Unit,
    ratio: Rational
  ): Scale<Currency, Unit> {
    return {
      tag,
      currency,
      ratio
    };
  }
  add(that: Discrete<Currency, Unit>): Discrete<Currency, Unit> {
    return new Discrete(this.value + that.value, this.scale);
  }
  sub(that: Discrete<Currency, Unit>): Discrete<Currency, Unit> {
    return new Discrete(this.value - that.value, this.scale);
  }
  mul(x: bigint | number): Discrete<Currency, Unit> {
    return new Discrete(this.value * BigInt(x), this.scale);
  }
  dense(): Dense<Currency> {
    return Dense.of(
      Rational.of(this.value, 1).div(this.scale.ratio),
      this.scale.currency
    );
  }
}
