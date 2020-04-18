import { Rational, Discrete } from "../src";

const euroCent = Discrete.scale("EUR", "cent", Rational.of(100, 1));
const euro = Discrete.scale("EUR", "euro", Rational.of(1, 1));

Discrete.of(42, euroCent).add(Discrete.of(23, euro));
