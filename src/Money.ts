import Rational from "./Rational";
import Dense from "./Dense";
import Discrete, { Scale } from "./Discrete";

export type ExchangeRate<Src extends string, Dst extends string> = {
  readonly src: Src;
  readonly dst: Dst;
  readonly ratio: Rational;
};

export const exchangeRate = <Src extends string, Dst extends string>(
  src: Src,
  dst: Dst,
  ratio: Rational
): ExchangeRate<Src, Dst> => ({ src, dst, ratio });

export const exchange = <
  Src extends string,
  Dst extends string,
  DenseSrc extends Dense<Src>
>(
  rate: ExchangeRate<Src, Dst>,
  src: DenseSrc
): Dense<Dst> => Dense.of(src.value.mul(rate.ratio), rate.dst);

export const floor = <
  Currency extends string,
  Unit extends string,
  DenseVal extends Dense<Currency>
>(
  value: DenseVal,
  scale: Scale<Currency, Unit>
): [Discrete<Currency, Unit>, Dense<Currency>] => {
  const [num, denom] = value.value
    .mul(scale.ratio)
    .normalize()
    .asTuple();
  const neg = num < 0;
  const absNum = neg ? -num : num;
  const x = absNum / denom;
  const rem = absNum - x * denom;
  const absVal = neg && rem > 0 ? x + BigInt(1) : x;
  const mag = Math.pow(10, rem.toString().length);
  const remVal = Rational.of(rem, mag).div(scale.ratio);
  return [
    Discrete.of(neg ? -absVal : absVal, scale),
    Dense.of(neg ? scale.ratio.inverse().sub(remVal) : remVal, scale.currency)
  ];
};

export const ceil = <
  Currency extends string,
  Unit extends string,
  DenseVal extends Dense<Currency>
>(
  value: DenseVal,
  scale: Scale<Currency, Unit>
): [Discrete<Currency, Unit>, Dense<Currency>] => {
  const [num, denom] = value.value
    .mul(scale.ratio)
    .normalize()
    .asTuple();
  const neg = num < 0;
  const absNum = neg ? -num : num;
  const x = absNum / denom;
  const rem = absNum - x * denom;
  const absVal = !neg && rem > 0 ? x + BigInt(1) : x;
  const mag = Math.pow(10, rem.toString().length);
  const remVal = Rational.of(rem, mag)
    .div(scale.ratio)
    .mul(Rational.nat(-1));
  return [
    Discrete.of(neg ? -absVal : absVal, scale),
    Dense.of(
      !neg && rem > 0
        ? scale.ratio
            .inverse()
            .negate()
            .sub(remVal)
        : remVal,
      scale.currency
    )
  ];
};

export const round = <
  Currency extends string,
  Unit extends string,
  DenseVal extends Dense<Currency>
>(
  value: DenseVal,
  scale: Scale<Currency, Unit>
): [Discrete<Currency, Unit>, Dense<Currency>] => {
  const [num, denom] = value.value
    .mul(scale.ratio)
    .normalize()
    .asTuple();
  const neg = num < 0;
  const absNum = neg ? -num : num;
  const x = absNum / denom;
  const rem = absNum - x * denom;
  const remStr = rem.toString();
  const down = parseInt(remStr[0], 10) < 5;
  const absVal = !down || (neg && rem > 0) ? x + BigInt(1) : x;
  const mag = Math.pow(10, remStr.length);
  const remVal = Rational.of(rem, mag).div(scale.ratio);
  return [
    Discrete.of(neg ? -absVal : absVal, scale),
    Dense.of(
      !down || neg
        ? scale.ratio
            .inverse()
            .sub(remVal)
            .mul(Rational.nat(!down ? -1 : 1))
        : remVal,
      scale.currency
    )
  ];
};
