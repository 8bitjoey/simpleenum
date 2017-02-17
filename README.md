# simpleenum
A package with base Enum class, which can be used to create enum-like classes in JavaScript

Usage examples:

```
let e = require('./enum')
let Enum = e.Enum;

let Planets = Enum.create({'mercury': 1, 'venus': 2, 'Mars': 4});

let isVenus = (planet) => planet == Planets.VENUS ? 'Yes' : 'No';
isVenus(Planets.MARS) // 'No'
isVenus(Planets.VENUS) // 'Yes'
isVenus('foo') // 'No'

Planets.VENUS instanceof Planets // true
Planets.VENUS instanceof Enum // true

let isVenusEx2 = (planet) => { if (planet instanceof Planets) { return planet == Planets.VENUS ? 'Yes' : 'No'} else { return 'Not even a planet'; }};

isVenusEx2(Planets.MARS) // 'No'
isVenusEx2(Planets.VENUS) // 'YES'
isVenusEx2('foo') // 'Not even a planet'

Planets.MARS.name // Mars
Planets.VENUS.name // venus
Planets.MERCURY.value // 1

let returnValue = planet => planet.value;
returnValue(Planets.MARS) // 4

Planets.valueOf(1) == Planets.MERCURY // true
Planets.valueOf('mars') == Planets.MARS // true

let ExtrasDemo = Enum.createEnum({'x': 1, 'y': 5}, [{description: 'Cool X'}, 'whatever']);
ExtrasDemo.X.extra.description // 'Cool X'
ExtrasDemo.Y.extra // 'whatever'
```

Run ```npm test``` to run unit tests.

License: MIT
