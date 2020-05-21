import test from "ava";
import * as Money from "./Money";
import Rational from "./Rational";
import Dense from "./Dense";
import Discrete from "./Discrete";
import { spawn } from "child_process";

const eurToUsd = Money.exchangeRate("EUR", "USD", Rational.fromDecimal("1.12"));

const eur = Discrete.scale("EUR", "euro", Rational.nat(1));
const eurCent = Discrete.scale("EUR", "cent", Rational.nat(100));
const usd = Discrete.scale("USD", "dollar", Rational.nat(1));

test("exchanges currencies", (t) => {
  const eur = Dense.fromDecimal("10", "EUR");
  const usd = Money.exchange(eurToUsd, eur);
  t.is(usd.toDecimal(), "11.2");
});

test("floors to EUR euros with remainder", (t) => {
  const [val, rem] = Money.floor(Dense.fromDecimal("1.337", "EUR"), eur);
  t.is(val.value.toString(), "1");
  t.is(rem.value.toDecimal(), "0.337");
});

test("floors exact value to EUR euros with remainder", (t) => {
  const [val, rem] = Money.floor(Dense.fromDecimal("42", "EUR"), eur);
  t.is(val.value.toString(), "42");
  t.is(rem.value.toDecimal(), "0.0");
});

test("floors negative to EUR euros with remainder", (t) => {
  const [val, rem] = Money.floor(Dense.fromDecimal("-2.342", "EUR"), eur);
  t.is(val.value.toString(), "-3");
  t.is(rem.value.toDecimal(), "0.658");
});

test("floors exact value to EUR cent", (t) => {
  const [val, rem] = Money.floor(Dense.fromDecimal("4.2", "EUR"), eurCent);
  t.is(val.value.toString(), "420");
  t.is(rem.value.toDecimal(), "0.0");
});

test("floors to EUR cent with remainder", (t) => {
  const [val, rem] = Money.floor(Dense.fromDecimal("1.337", "EUR"), eurCent);
  t.is(val.value.toString(), "133");
  t.is(rem.value.toDecimal(), "0.007");
});

test("floors negative to EUR cent with remainder", (t) => {
  const [val, rem] = Money.floor(Dense.fromDecimal("-2.342", "EUR"), eurCent);
  t.is(val.value.toString(), "-235");
  t.is(rem.value.toDecimal(), "0.008");
});

test("ceils to EUR euros with remainder", (t) => {
  const [val, rem] = Money.ceil(Dense.fromDecimal("1.337", "EUR"), eur);
  t.is(val.value.toString(), "2");
  t.is(rem.value.toDecimal(), "-0.663");
});

test("ceils exact value to EUR euros with remainder", (t) => {
  const [val, rem] = Money.ceil(Dense.fromDecimal("42", "EUR"), eur);
  t.is(val.value.toString(), "42");
  t.is(rem.value.toDecimal(), "0.0");
});

test("ceils negative to EUR euros with remainder", (t) => {
  const [val, rem] = Money.ceil(Dense.fromDecimal("-2.342", "EUR"), eur);
  t.is(val.value.toString(), "-2");
  t.is(rem.value.toDecimal(), "-0.342");
});

test("ceils exact value to EUR cent", (t) => {
  const [val, rem] = Money.ceil(Dense.fromDecimal("4.2", "EUR"), eurCent);
  t.is(val.value.toString(), "420");
  t.is(rem.value.toDecimal(), "0.0");
});

test("ceils to EUR cent with remainder", (t) => {
  const [val, rem] = Money.ceil(Dense.fromDecimal("1.337", "EUR"), eurCent);
  t.is(val.value.toString(), "134");
  t.is(rem.value.toDecimal(), "-0.003");
});

test("ceils negative to EUR cent with remainder", (t) => {
  const [val, rem] = Money.ceil(Dense.fromDecimal("-2.342", "EUR"), eurCent);
  t.is(val.value.toString(), "-234");
  t.is(rem.value.toDecimal(), "-0.002");
});

test("rounds up to EUR euros with remainder", (t) => {
  const [val, rem] = Money.round(Dense.fromDecimal("133.712", "EUR"), eur);
  t.is(val.value.toString(), "134");
  t.is(rem.value.toDecimal(), "-0.288");
});

test("rounds down to EUR euros with remainder", (t) => {
  const [val, rem] = Money.round(Dense.fromDecimal("13.37", "EUR"), eur);
  t.is(val.value.toString(), "13");
  t.is(rem.value.toDecimal(), "0.37");
});

test("rounds up to EUR cent with remainder", (t) => {
  const [val, rem] = Money.round(Dense.fromDecimal("1.337", "EUR"), eurCent);
  t.is(val.value.toString(), "134");
  t.is(rem.value.toDecimal(), "-0.003");
});

test("rounds down to EUR cent with remainder", (t) => {
  const [val, rem] = Money.round(Dense.fromDecimal("13.371", "EUR"), eurCent);
  t.is(val.value.toString(), "1337");
  t.is(rem.value.toDecimal(), "0.001");
});

test("rounds negative up to EUR euros with remainder", (t) => {
  const [val, rem] = Money.round(Dense.fromDecimal("-133.712", "EUR"), eur);
  t.is(val.value.toString(), "-134");
  t.is(rem.value.toDecimal(), "0.288");
});

test("rounds negative down to EUR euros with remainder", (t) => {
  const [val, rem] = Money.round(Dense.fromDecimal("-13.37", "EUR"), eur);
  t.is(val.value.toString(), "-13");
  t.is(rem.value.toDecimal(), "-0.37");
});

test("rounds negative up to EUR cent with remainder", (t) => {
  const [val, rem] = Money.round(Dense.fromDecimal("-1.337", "EUR"), eurCent);
  t.is(val.value.toString(), "-134");
  t.is(rem.value.toDecimal(), "0.003");
});

test("rounds negative down to EUR cent with remainder", (t) => {
  const [val, rem] = Money.round(Dense.fromDecimal("-13.371", "EUR"), eurCent);
  t.is(val.value.toString(), "-1337");
  t.is(rem.value.toDecimal(), "-0.001");
});

test("rounds with exact result", (t) => {
  const [val, rem] = Money.round(Dense.fromDecimal("0.01", "EUR"), eurCent);
  t.is(val.value.toString(), "1");
  t.is(rem.value.toDecimal(), "0.0");
});

test("CHF Rappen rounding", (t) => {
  const scale = Discrete.scale("CHF", "5-rappen", Rational.nat(20));

  let [val, rem] = Money.round(Dense.fromDecimal("1.075", "CHF"), scale);
  t.is(val.dense().toDecimal(), "1.1");
  t.is(rem.value.toDecimal(), "-0.025");

  [val, rem] = Money.round(Dense.fromDecimal("150.32567", "CHF"), scale);
  t.is(val.dense().toDecimal(), "150.35");
  t.is(rem.value.toDecimal(), "-0.02433");

  [val, rem] = Money.round(Dense.fromDecimal("150.32167", "CHF"), scale);
  t.is(val.dense().toDecimal(), "150.3");
  t.is(rem.value.toDecimal(), "0.02167");
});

type TscProcResult = {
  status: number | null;
  output: string;
};

const tsc = (file: string): Promise<TscProcResult> =>
  new Promise((resolve) => {
    const proc = spawn("yarn", ["tsc", file, "--noEmit"], { shell: true });
    let output = "";
    proc.stdout.on("data", (data) => (output += data));
    proc.stderr.on("data", (data) => (output += data));
    proc.on("close", (status) => resolve({ status, output }));
  });

test("dense currency mismatch", async (t) => {
  let x = await tsc("test/dense-currency-mismatch.ts");
  t.assert(
    x.output.includes(
      `Argument of type 'Dense<"USD">' is not assignable to parameter of type 'Dense<"EUR">'`
    )
  );
  t.not(x.status, null);
  t.not(x.status, 0);
});

test("discrete currency mismatch", async (t) => {
  let x = await tsc("test/discrete-currency-mismatch.ts");
  t.assert(
    x.output.includes(
      `Argument of type 'Discrete<"USD", "cent">' is not assignable to parameter of type 'Discrete<"EUR", "cent">'`
    )
  );
  t.not(x.status, null);
  t.not(x.status, 0);
});

test("discrete unit mismatch", async (t) => {
  let x = await tsc("test/discrete-unit-mismatch.ts");
  t.assert(
    x.output.includes(
      `Argument of type 'Discrete<"EUR", "euro">' is not assignable to parameter of type 'Discrete<"EUR", "cent">'`
    )
  );
  t.not(x.status, null);
  t.not(x.status, 0);
});

test("exchange currency mismatch", async (t) => {
  let x = await tsc("test/exchange-currency-mismatch.ts");
  t.assert(
    x.output.includes(
      `Argument of type 'Dense<"USD">' is not assignable to parameter of type 'Dense<"EUR">'`
    )
  );
  t.not(x.status, null);
  t.not(x.status, 0);
});

test("floor currency mismatch", async (t) => {
  let x = await tsc("test/floor-currency-mismatch.ts");
  t.assert(
    x.output.includes(
      `Argument of type 'Dense<"EUR">' is not assignable to parameter of type 'Dense<"USD">'`
    )
  );
  t.not(x.status, null);
  t.not(x.status, 0);
});
