import test from "ava";
import Ratio from "./Rational";

test("converts to decimal string", t => {
  t.is(Ratio.of(1, 2).toDecimal(), "0.5");
  t.is(Ratio.of(1, 3).toDecimal({ decimals: 4 }), "0.3333");
  t.is(Ratio.nat(1).toDecimal(), "1.0");
  t.is(Ratio.nat(0).toDecimal(), "0.0");
});

test("parses decimal string", t => {
  t.deepEqual(Ratio.fromDecimal("0.19"), Ratio.of(19, 100));
  t.deepEqual(Ratio.fromDecimal("0.5"), Ratio.of(5, 10));
  t.deepEqual(Ratio.fromDecimal("1"), Ratio.nat(1));
  t.deepEqual(Ratio.fromDecimal("-42"), Ratio.nat(-42));
});

test("does proper arithmetic", t => {
  t.is(
    Ratio.of(1, 3)
      .mul(Ratio.nat(3))
      .toDecimal(),
    "1.0"
  );

  t.is(
    Ratio.fromDecimal("0.1")
      .add(Ratio.fromDecimal("0.2"))
      .toDecimal(),
    "0.3"
  );

  t.is(
    Ratio.fromDecimal("-0.3")
      .add(Ratio.fromDecimal("0.1"))
      .toDecimal(),
    "-0.2"
  );
});
