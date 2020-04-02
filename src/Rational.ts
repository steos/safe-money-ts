export default class Rational {
  private readonly n: bigint;
  private readonly d: bigint;
  private constructor(n: bigint, d: bigint) {
    if (d === BigInt(0)) throw new TypeError("denominator cannot be 0");
    this.n = n;
    this.d = d;
  }

  static nat(n: bigint | number) {
    return new Rational(BigInt(n), BigInt(1));
  }

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

  static of(n: bigint | number, d: bigint | number) {
    return new Rational(BigInt(n), BigInt(d));
  }

  public add(that: Rational): Rational {
    const cd = this.d * that.d;
    return new Rational(this.n * that.d + that.n * this.d, cd);
  }

  public sub(that: Rational): Rational {
    const cd = this.d * that.d;
    return new Rational(this.n * that.d - that.n * this.d, cd);
  }

  public mul(that: Rational): Rational {
    return new Rational(this.n * that.n, this.d * that.d);
  }

  public div(that: Rational): Rational {
    return new Rational(this.n * that.d, this.d * that.n);
  }

  public negate() {
    return this.mul(Rational.nat(-1));
  }

  public asTuple(): [bigint, bigint] {
    return [this.n, this.d];
  }
  public normalize(): Rational {
    if (this.d < 0) {
      return new Rational(-this.n, -this.d);
    }
    return this;
  }
  public inverse(): Rational {
    return new Rational(this.d, this.n);
  }
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
    return sign + [integral, fractional.join("") || "0"].join(separator);
  }

  public toString() {
    return [this.n, this.d].join(" / ");
  }

  public toNumber() {
    return parseFloat(this.toDecimal());
  }
}
