import { Rational, Dense } from "../src";
import * as Money from "../src";

const x = Dense.fromDecimal("0.1", "USD");

const eurToUsd = Money.exchangeRate("EUR", "USD", Rational.fromDecimal("1.12"));

Money.exchange(eurToUsd, x);
