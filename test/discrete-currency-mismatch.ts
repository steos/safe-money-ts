import { Rational, Discrete } from "../src";

const euroCent = Discrete.scale("EUR", "cent", Rational.of(100, 1));
const usdCent = Discrete.scale("USD", "cent", Rational.nat(100));

Discrete.of(42, euroCent).add(Discrete.of(1, usdCent));
