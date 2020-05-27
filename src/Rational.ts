/**
 * A Rational number
 *
 * This implementation uses bigint internally for the numerator and denominator.
 *
 * A rational is immutable.
 *
 * ```
 * const x = Rational.of(2, 3);
 * x.mul(Rational.nat(3)).toDecimal(); // => "2.0"
 * ```
 */
export default class Rational {
  private readonly n: bigint;
  private readonly d: bigint;
  private constructor(n: bigint, d: bigint) {
    if (d === BigInt(0)) throw new TypeError("denominator cannot be 0");
    this.n = n;
    this.d = d;
  }

  /**
   * creates a new rational representing the given natural number
   *
   * ```
   * const x = Rational.nat(42)
   * ```
   *
   * @param n the natural to represent as rational
   */
  static nat(n: bigint | number) {
    return new Rational(BigInt(n), BigInt(1));
  }

  /**
   * creates a new rational from the given decimal string
   *
   * ```
   * const x = Rational.fromDecimal("13.37")
   * ```
   *
   * @param s the decimal string
   */
  static fromDecimal(s: string) {
    const neg = s.startsWith("-");
    const abs = neg ? s.substring(1) : s;
    const [integral, fractional] = abs.split(".");
    const mag = (fractional && fractional.length) || 0;
    const denom = BigInt(Math.pow(10, mag));
    const absNum =
      (integral.length > 0 ? BigInt(integral) : BigInt(0)) * denom +
      (fractional ? BigInt(fractional) : BigInt(0));
    return Rational.of(neg ? -absNum : absNum, denom);
  }

  /**
   * creates a new rational with the given numerator and denominator
   *
   * @param n the numerator
   * @param d the denominator
   */
  static of(n: bigint | number, d: bigint | number) {
    return new Rational(BigInt(n), BigInt(d));
  }

  /**
   * adds the given rational to this rational
   *
   * @param that the rational to add
   */
  public add(that: Rational): Rational {
    const cd = this.d * that.d;
    return new Rational(this.n * that.d + that.n * this.d, cd);
  }

  /**
   * subtracts the given rational from this rational
   *
   * @param that the rational to subtract
   */
  public sub(that: Rational): Rational {
    const cd = this.d * that.d;
    return new Rational(this.n * that.d - that.n * this.d, cd);
  }

  /**
   * multiplies this rational with the given rational
   *
   * @param that the rational to multiply with
   */
  public mul(that: Rational): Rational {
    return new Rational(this.n * that.n, this.d * that.d);
  }

  /**
   * divides this rational by the given rational
   *
   * @param that the rational to divide by
   */
  public div(that: Rational): Rational {
    return new Rational(this.n * that.d, this.d * that.n);
  }

  /**
   * multiplies this rational with a negative 1
   */
  public negate() {
    return this.mul(Rational.nat(-1));
  }

  /**
   * returns a tuple of the numerator and denominator
   */
  public asTuple(): [bigint, bigint] {
    return [this.n, this.d];
  }

  /**
   * ensures that negative rationals have the sign in the numerator
   */
  public normalize(): Rational {
    if (this.d < 0) {
      return new Rational(-this.n, -this.d);
    }
    return this;
  }

  /**
   * returns the reciprocal value
   */
  public inverse(): Rational {
    return new Rational(this.d, this.n);
  }

  /**
   * formats this rational as decimal string
   */
  public toDecimal({ separator = ".", decimals = 12 } = {}) {
    const [num, denom] = this.normalize().asTuple();
    const sign = num < 0 ? "-" : "";
    const absNum = num < 0 ? -num : num;
    const integral = absNum / denom;
    let rem = (absNum - denom * integral) * BigInt(10);
    const fractional: bigint[] = [];
    while (rem > 0 && fractional.length < decimals) {
      const x = rem / denom;
      fractional.push(x);
      rem = (rem - denom * x) * BigInt(10);
    }
    return [sign, integral, separator, fractional.join("") || "0"].join("");
  }

  /**
   * formats this rational as string
   */
  public toString() {
    return [this.n, this.d].join(" / ");
  }

  /**
   * converts this rational to a float
   */
  public toNumber() {
    return parseFloat(this.toDecimal());
  }
}
