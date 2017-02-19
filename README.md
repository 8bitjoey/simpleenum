# simpleenum
A package with base Enum class, which can be used to create enum-like classes in JavaScript

Installation:

```
npm install --save simpleenum
```

Usage examples:

```
let Enum = require('simpleenum')

let Planets = Enum.create({'mercury': 1, 'venus': 2, 'Mars': 4});

let isVenus = (planet) => planet == Planets.VENUS ? 'Yes' : 'No';
isVenus(Planets.MARS) // 'No'
isVenus(Planets.VENUS) // 'Yes'
isVenus('foo') // 'No'

Planets.VENUS instanceof Planets // true
Planets.VENUS instanceof Enum // true

let isVenus2 = (planet) => {
    if (planet instanceof Planets) {
        return planet == Planets.VENUS ? 'Yes' : 'No'
    } else {
        return 'Not even a planet'; 
    }
};

isVenus2(Planets.MARS) // 'No'
isVenus2(Planets.VENUS) // 'Yes'
isVenus2('foo') // 'Not even a planet'

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

You can find more usage examples in unit tests. Run ```npm test``` to run them.

License: MIT
