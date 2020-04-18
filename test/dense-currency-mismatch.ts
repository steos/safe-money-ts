import { Dense } from "../src";

const foo = Dense.fromDecimal("0.2", "EUR");
const bar = Dense.fromDecimal("0.1", "USD");

console.log(foo.add(bar).toDecimal());
