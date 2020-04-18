import { Rational, Dense, Discrete } from "../src";
import * as Money from "../src";

const usdCent = Discrete.scale("USD", "cent", Rational.nat(100));

Money.floor(Dense.fromDecimal("1", "EUR"), usdCent);
