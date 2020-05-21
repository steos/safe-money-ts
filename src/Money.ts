import Rational from "./Rational";
import Dense from "./Dense";
import Discrete, { Scale } from "./Discrete";

/**
 * Represents the ratio to convert a source currency to a destination currency
 */
export type ExchangeRate<Src extends string, Dst extends string> = {
  /**
   * the name of the source currency
   */
  readonly src: Src;
  /**
   * the name of the target currency
   */
  readonly dst: Dst;
  /**
   * the ratio by which to multiply the source value to get the target value
   */
  readonly ratio: Rational;
};

/**
 * create a new exchange rate
 *
 * @param src the source currency name
 * @param dst the target currency name
 * @param ratio the ratio by which to multiply the source value to get the target value
 */
export const exchangeRate = <Src extends string, Dst extends string>(
  src: Src,
  dst: Dst,
  ratio: Rational
): ExchangeRate<Src, Dst> => ({ src, dst, ratio });

/**
 * converts a dense value from a source currency to a target currency based on the given exchange rate
 *
 * @param rate the exchange rate
 * @param src a dense value in the source currency
 */
export const exchange = <
  Src extends string,
  Dst extends string,
  DenseSrc extends Dense<Src>
>(
  rate: ExchangeRate<Src, Dst>,
  src: DenseSrc
): Dense<Dst> => Dense.of(src.value.mul(rate.ratio), rate.dst);

/**
 * floors the given dense value to the closest discrete value in the given scale
 *
 * @param value the dense value
 * @param scale the discrete scale
 */
export const floor = <
  Currency extends string,
  Unit extends string,
  DenseVal extends Dense<Currency>
>(
  value: DenseVal,
  scale: Scale<Currency, Unit>
): [Discrete<Currency, Unit>, Dense<Currency>] => {
  const [num, denom] = value.value.mul(scale.ratio).normalize().asTuple();
  const neg = num < 0;
  const absNum = neg ? -num : num;
  const x = absNum / denom;
  const rem = absNum - x * denom;
  const absVal = neg && rem > 0 ? x + BigInt(1) : x;
  const mag = Math.pow(10, rem.toString().length);
  const remVal = Rational.of(rem, mag).div(scale.ratio);
  return [
    Discrete.of(neg ? -absVal : absVal, scale),
    Dense.of(neg ? scale.ratio.inverse().sub(remVal) : remVal, scale.currency),
  ];
};

/**
 * ceils the given dense value to the closest discrete value in the given scale
 *
 * @param value the dense value
 * @param scale the discrete scale
 */
export const ceil = <
  Currency extends string,
  Unit extends string,
  DenseVal extends Dense<Currency>
>(
  value: DenseVal,
  scale: Scale<Currency, Unit>
): [Discrete<Currency, Unit>, Dense<Currency>] => {
  const [num, denom] = value.value.mul(scale.ratio).normalize().asTuple();
  const neg = num < 0;
  const absNum = neg ? -num : num;
  const x = absNum / denom;
  const rem = absNum - x * denom;
  const absVal = !neg && rem > 0 ? x + BigInt(1) : x;
  const mag = Math.pow(10, rem.toString().length);
  const remVal = Rational.of(rem, mag).div(scale.ratio).mul(Rational.nat(-1));
  return [
    Discrete.of(neg ? -absVal : absVal, scale),
    Dense.of(
      !neg && rem > 0 ? scale.ratio.inverse().negate().sub(remVal) : remVal,
      scale.currency
    ),
  ];
};

/**
 * rounds the given dense value to the closest discrete value with the given scale
 *
 * @param value the dense value
 * @param scale the discrete scale
 */
export const round = <
  Currency extends string,
  Unit extends string,
  DenseVal extends Dense<Currency>
>(
  value: DenseVal,
  scale: Scale<Currency, Unit>
): [Discrete<Currency, Unit>, Dense<Currency>] => {
  const [num, denom] = value.value.mul(scale.ratio).normalize().asTuple();
  const neg = num < 0;
  const absNum = neg ? -num : num;
  const x = absNum / denom;
  const rem = absNum - x * denom;
  const remStr = rem.toString();
  const sig = parseInt(remStr[0], 10);
  const absVal = sig >= 5 ? x + BigInt(1) : x;
  const mag = Math.pow(10, remStr.length);
  const remVal = Rational.of(rem, mag).div(scale.ratio);
  return [
    Discrete.of(neg ? -absVal : absVal, scale),
    Dense.of(
      sig >= 5 ? scale.ratio.inverse().sub(remVal) : remVal,
      scale.currency
    ).mul(Rational.nat((sig < 5 && neg) || (sig >= 5 && !neg) ? -1 : 1)),
  ];
};
