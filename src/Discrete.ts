/*global BigInt*/
import Dense from "./Dense";
import Rational from "./Rational";

/**
 * A scale is the ratio between any chosen unit and a currency main unit
 */
export type Scale<Currency extends string, Unit extends string> = {
  /**
   * the name of the scale unit
   */
  tag: Unit;
  /**
   * the name of the currency
   */
  currency: Currency;
  /**
   * the ratio between the scale unit and the currency main unit
   */
  ratio: Rational;
};

/**
 * A discrete monetary value.
 *
 * A discrete value is always an integer multiple of a currency unit.
 *
 * Discrete instances are immutable.
 *
 * A discrete value is based on a scale.
 * The scale is the ratio between the chosen unit and the main currency unit.
 *
 * ```
 * const euroCent = Discrete.scale("EUR", "cent", Rational.of(100, 1));
 * const euro = Discrete.scale("EUR", "euro", Rational.of(1, 1));
 * Discrete.of(42, euroCent).add(Discrete.of(23, euro)); // type error, euro is not assignable to cent
 * ```
 */
export default class Discrete<Currency extends string, Unit extends string> {
  public readonly value: bigint;
  public readonly scale: Scale<Currency, Unit>;
  private constructor(value: bigint, scale: Scale<Currency, Unit>) {
    this.value = value;
    this.scale = scale;
  }

  /**
   * creates a new discrete value with the given amount and scale
   *
   * @param value the unit amount
   * @param scale the unit scale
   */
  static of<Currency extends string, Unit extends string>(
    value: bigint | number,
    scale: Scale<Currency, Unit>
  ): Discrete<Currency, Unit> {
    return new Discrete(BigInt(value), scale);
  }

  /**
   * creates a new scale based on the given currency, unit and ratio
   *
   * ```
   * const euroCent = Discrete.scale("EUR", "cent", Rational.of(100, 1));
   * const euro = Discrete.scale("EUR", "euro", Rational.of(1, 1));
   * const usdCent = Discrete.scale("USD", "cent", Rational.nat(100));
   * const xauTroyOunce = Discrete.scale("XAU", "troy-ounce", Rational.nat(1));
   * const xauGram = Discrete.scale("XAU", "gram", Rational.fromDecimal("31.103477"));
   * ```
   *
   * @param currency the currency name
   * @param tag the unit name
   * @param ratio the ratio between the unit and the currency main unit
   */
  static scale<Currency extends string, Unit extends string>(
    currency: Currency,
    tag: Unit,
    ratio: Rational
  ): Scale<Currency, Unit> {
    return {
      tag,
      currency,
      ratio,
    };
  }

  /**
   * adds the given discrete value to this value
   *
   * @param that the discrete value to add
   */
  add(that: Discrete<Currency, Unit>): Discrete<Currency, Unit> {
    return new Discrete(this.value + that.value, this.scale);
  }

  /**
   * subtracts the given discrete value from this value
   *
   * @param that the discrete value to subtract
   */
  sub(that: Discrete<Currency, Unit>): Discrete<Currency, Unit> {
    return new Discrete(this.value - that.value, this.scale);
  }

  /**
   * multiplies this value by the given factor
   *
   * @param x the factor to multiply by
   */
  mul(x: bigint | number): Discrete<Currency, Unit> {
    return new Discrete(this.value * BigInt(x), this.scale);
  }

  /**
   * creates a dense representation of this value
   */
  dense(): Dense<Currency> {
    return Dense.of(
      Rational.of(this.value, 1).div(this.scale.ratio),
      this.scale.currency
    );
  }
}
