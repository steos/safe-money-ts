# safe-money

An implementation of [safe-money](https://ren.zone/articles/safe-money) in typescript.

> WARNING: This is still in alpha. Not recommended for production.

## Documentation

- [API Reference](//steos.github.io/safe-money-ts/)

### Getting started

Install safe-money with npm or yarn:

```
yarn add safe-money
```

### Examples

#### Dense values

Dense values can represent arbitrary fractions of currency units.

```ts
import { Dense } from "safe-money";

const a = Dense.fromDecimal("0.2", "EUR");
const b = Dense.fromDecimal("0.1", "USD");

a.add(b); // type error
```

#### Discrete values

A discrete value can only represent an integer multiple of a currency unit.

A discrete value is based on a scale.
The scale is the ratio between the chosen unit and the main currency unit.

```ts
import { Discrete, Rational } from "safe-money";

const euroCent = Discrete.scale("EUR", "cent", Rational.of(100, 1));
const euro = Discrete.scale("EUR", "euro", Rational.of(1, 1));
const usdCent = Discrete.scale("USD", "cent", Rational.nat(100));

Discrete.of(42, euroCent).add(Discrete.of(1, usdCent)); // type error
Discrete.of(42, euroCent).add(Discrete.of(23, euro)); // type error
```

#### Conversions

To convert between currencies you can use an `ExchangeRate`:

```ts
import * as Money from "safe-money";

const a = Money.Dense.fromDecimal("0.2", "EUR");
const b = Money.Dense.fromDecimal("0.1", "USD");
const eurToUsd = Money.exchangeRate("EUR", "USD", Rational.fromDecimal("1.12"));

Money.exchange(eurToUsd, a).add(b); // ok
Money.exchange(eurToUsd, b); // type error
```

To convert a dense value to a discrete value you can use `floor`, `ceil` or `round`.
Those operations will return the closest discrete value and a dense remainder.

```ts
Money.floor(Dense.fromDecimal("1", "EUR"), usdCent); // type error
```

## License

Copyright © 2020, Stefan Oestreicher and contributors.

Distributed under the terms of the BSD-3-Clause license.
