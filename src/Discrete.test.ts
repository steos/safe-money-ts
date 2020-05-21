import test from "ava";
import Discrete from "./Discrete";
import Rational from "./Rational";

const eurCent = Discrete.scale("EUR", "cent", Rational.nat(100));
const eurEuro = Discrete.scale("EUR", "euro", Rational.nat(1));

test("converts to dense", (t) => {
  t.is(Discrete.of(0, eurCent).dense().toDecimal(), "0.0");

  t.is(Discrete.of(1, eurCent).dense().toDecimal(), "0.01");

  t.is(Discrete.of(1337, eurCent).dense().toDecimal(), "13.37");

  t.is(Discrete.of(42, eurEuro).dense().toDecimal(), "42.0");
});

test("converts negative value to dense", (t) => {
  t.is(Discrete.of(-1337, eurCent).dense().toDecimal(), "-13.37");

  t.is(Discrete.of(-42, eurEuro).dense().toDecimal(), "-42.0");
});

test("increments correctly", (t) => {
  t.is(Discrete.of(1, eurCent).increment().value.toString(), "2");
});

test("decrements correctly", (t) => {
  t.is(Discrete.of(1, eurCent).decrement().value.toString(), "0");
});
