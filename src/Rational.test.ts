import test from "ava";
import Ratio from "./Rational";

test("converts to decimal string", (t) => {
  t.is(Ratio.of(1, 2).toDecimal(), "0.5");
  t.is(Ratio.of(1, 3).toDecimal({ decimals: 4 }), "0.3333");
  t.is(Ratio.nat(1).toDecimal(), "1.0");
  t.is(Ratio.nat(0).toDecimal(), "0.0");
});

test("rounds when converting to decimal string", (t) => {
  t.is(Ratio.of(884, 1000).toDecimal({ round: true, decimals: 2 }), "0.88");
  t.is(Ratio.of(885, 1000).toDecimal({ round: true, decimals: 2 }), "0.89");
  t.is(Ratio.of(994, 1000).toDecimal({ round: true, decimals: 2 }), "0.99");
  t.is(Ratio.of(199, 100).toDecimal({ round: true, decimals: 1 }), "2.0");
  t.is(Ratio.of(995, 1000).toDecimal({ round: true, decimals: 2 }), "1.0");
  t.is(Ratio.of(895, 1000).toDecimal({ round: true, decimals: 1 }), "0.9");
  t.is(Ratio.of(895, 1000).toDecimal({ round: true, decimals: 2 }), "0.9");
  t.is(Ratio.of(894, 1000).toDecimal({ round: true, decimals: 2 }), "0.89");
  t.is(Ratio.of(8894, 10000).toDecimal({ round: true, decimals: 2 }), "0.89");
  t.is(Ratio.of(5, 1000).toDecimal({ round: true, decimals: 2 }), "0.01");
  t.is(Ratio.of(4, 1000).toDecimal({ round: true, decimals: 2 }), "0.00");
  t.is(Ratio.of(55, 1000).toDecimal({ round: true, decimals: 2 }), "0.06");
  t.is(Ratio.of(54, 1000).toDecimal({ round: true, decimals: 2 }), "0.05");
  t.is(Ratio.of(2, 3).toDecimal({ round: true, decimals: 4 }), "0.6667");
});

test("parses decimal string", (t) => {
  t.deepEqual(Ratio.fromDecimal("0.19"), Ratio.of(19, 100));
  t.deepEqual(Ratio.fromDecimal("0.5"), Ratio.of(5, 10));
  t.deepEqual(Ratio.fromDecimal("1"), Ratio.nat(1));
  t.deepEqual(Ratio.fromDecimal("-42"), Ratio.nat(-42));
});

test("does proper arithmetic", (t) => {
  t.is(Ratio.of(1, 3).mul(Ratio.nat(3)).toDecimal(), "1.0");

  t.is(Ratio.of(2, 3).add(Ratio.of(4, 3)).toDecimal(), "2.0");

  t.is(
    Ratio.fromDecimal("0.1").add(Ratio.fromDecimal("0.2")).toDecimal(),
    "0.3"
  );

  t.is(
    Ratio.fromDecimal("-0.3").add(Ratio.fromDecimal("0.1")).toDecimal(),
    "-0.2"
  );
});
