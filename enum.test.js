const enumlib = require('./enum');
const Enum = enumlib.Enum;
const InvalidArgumentException = enumlib.InvalidArgumentException;

test('creating new enum', () => {
    let MyEnum1 = class extends Enum {}.createEnum({1: 'mercury', 3: 'earth', 5: 'saturn'});

    expect(MyEnum1.MERCURY.value).toBe(1);
    expect(MyEnum1.EARTH.value).toBe(3);
    expect(MyEnum1.SATURN.value).toBe(5);

    expect(MyEnum1.MERCURY.name).toBe('mercury');
    expect(MyEnum1.EARTH.name).toBe('earth');
    expect(MyEnum1.SATURN.name).toBe('saturn');

    // may be requires babel to work
    // expect(MyEnum1.name).toBe('MyEnum1');

    let xExtra = {'foo': 'bar'};
    let MyEnum2 = class MyEnum2 extends Enum {}.createEnum({1: 'x', 2: 'y', 3: 'z'}, [xExtra, 10, 'hello']);

    expect(MyEnum2.X.value).toBe(1);
    expect(MyEnum2.Y.value).toBe(2);
    expect(MyEnum2.Z.value).toBe(3);

    expect(MyEnum2.X.name).toBe('x');
    expect(MyEnum2.Y.name).toBe('y');
    expect(MyEnum2.Z.name).toBe('z');

    expect(MyEnum2.X.extra).toBe(xExtra);
    expect(MyEnum2.Y.extra).toBe(10);
    expect(MyEnum2.Z.extra).toBe('hello');
});

test('ensure enums doesn\'t share items', () => {
    let extra1 = {};
    let extra2 = {};
    let MyEnum1 = class extends Enum {}.createEnum({1: 'x', 2: 'y', 3: 'z'}, [extra1, null, null]);
    let MyEnum2 = class extends Enum {}.createEnum({1: 'x', 2: 'y', 3: 'z'}, [extra2, null, null]);

    expect(MyEnum1).not.toBe(MyEnum2);
    expect(MyEnum1.X).not.toBe(MyEnum2.X);
    expect(MyEnum1.X.id).toBe(MyEnum2.X.id);
    expect(MyEnum1.X.name).toBe(MyEnum2.X.name);
    expect(MyEnum1.X.extra).not.toBe(MyEnum2.X.extra);
});

test('ensure enums have expected inheritance', () => {
    let MyEnumA = class extends Enum {}.createEnum({1: 'x', 2: 'y', 3: 'z'});
    let MyEnumBInstance = class extends Enum {}.createEnum({1: 'x', 2: 'y', 3: 'z'});

    // MyEnumA and MyEnumB are just frozen holders of enums, they're not Enums themselves
    expect(MyEnumA).not.toBeInstanceOf(Enum);
    expect(MyEnumBInstance).not.toBeInstanceOf(Enum);

    // But all fields in MyEnumA and MyEnumB are Enum instances
    // You can also do
    //      x = EnumName.KEY;
    //      x instanceof EnumName
    // to ensure that var is a item of EnumName. Or
    //      x instanceof Enum
    // to ensure x is an enum
    Object.keys(MyEnumA).map((key) => {
        expect(MyEnumA[key]).toBeInstanceOf(MyEnumA);
        expect(MyEnumA[key]).toBeInstanceOf(Enum);
        expect(MyEnumA[key]).not.toBeInstanceOf(MyEnumBInstance);
    });

    Object.keys(MyEnumBInstance).map((key) => {
        expect(MyEnumBInstance[key]).toBeInstanceOf(MyEnumBInstance);
        expect(MyEnumBInstance[key]).toBeInstanceOf(Enum);
        expect(MyEnumBInstance[key]).not.toBeInstanceOf(MyEnumA);
    });
});

test('enum is not created for the base Enum class', () => {
    expect(() => Enum.createEnum({1: 'x'})).toThrow(InvalidArgumentException);
    expect(() => Enum.createEnum({1: 'x'})).toThrow('Can\'t create enums for Enum class');
});

test('createEnum has to have correct extra argument', () => {
    expect(() => class Test extends Enum {}.createEnum({1: 'x'}))
        .not.toThrow();
    expect(() => class Test extends Enum {}.createEnum({1: 'x'}, null))
        .not.toThrow();
    expect(() => class Test extends Enum {}.createEnum({1: 'x'}, ['hello']))
        .not.toThrow();
    expect(() => class Test extends Enum {}.createEnum({1: 'x'}, 'hello'))
        .toThrow(InvalidArgumentException);
    expect(() => class Test extends Enum {}.createEnum({1: 'x'}, 'hello'))
        .toThrow('Extra params should be an array or null');

    expect(() => class Test extends Enum {}.createEnum({1: 'x', 2: 'y'}))
        .not.toThrow();
    expect(() => class Test extends Enum {}.createEnum({1: 'x', 2: 'y'}, null))
        .not.toThrow();
    expect(() => class Test extends Enum {}.createEnum({1: 'x', 2: 'y'}, ['hello', 'world']))
        .not.toThrow();
    expect(() => class Test extends Enum {}.createEnum({1: 'x', 2: 'y'}, ['hello']))
        .toThrow(InvalidArgumentException);
    expect(() => class Test extends Enum {}.createEnum({1: 'x', 2: 'y'}, ['hello']))
        .toThrow('Extra params should be an array of the same length as enum has or null');
    expect(() => class Test extends Enum {}.createEnum({1: 'x', 2: 'y'}, ['hello', 'world', '!']))
        .toThrow(InvalidArgumentException);
    expect(() => class Test extends Enum {}.createEnum({1: 'x', 2: 'y'}, ['hello', 'world', '!']))
        .toThrow('Extra params should be an array of the same length as enum has or null');
    expect(() => class Test extends Enum {}.createEnum({1: 'x', 2: 'y'}, 'hello', 'world'))
        .toThrow(InvalidArgumentException);
    expect(() => class Test extends Enum {}.createEnum({1: 'x', 2: 'y'}, 'hello', 'world'))
        .toThrow('Extra params should be an array or null');
});

test('Enum.valueOf', () => {
    let Foo = class extends Enum {}.createEnum({1: 'A', 2: 'B', 3: 'C'});

    expect(Foo.A).toBe(Foo.valueOf('a'));
    expect(Foo.A).toBe(Foo.valueOf('A'));
    expect(Foo.A).toBe(Foo.valueOf(1));

    expect(Foo.B).toBe(Foo.valueOf('b'));
    expect(Foo.B).toBe(Foo.valueOf('B'));
    expect(Foo.B).toBe(Foo.valueOf(2));

    expect(Foo.C).toBe(Foo.valueOf('c'));
    expect(Foo.C).toBe(Foo.valueOf('C'));
    expect(Foo.C).toBe(Foo.valueOf(3));
});

test('enum is not changeable', () => {
    let Bar = class extends Enum {}.createEnum({1: 'A', 2: 'B', 3: 'C'});

    Bar.D = new Enum(4, 'D');
    expect(Bar.D).toBeUndefined();

    Bar.B = new Enum(10, 'X', 'test');
    expect(Bar.B.value).toBe(2);
    expect(Bar.B.name).toBe('B');
    expect(Bar.B.extra).toBeNull();

    Bar.A.name = 'AAA';
    expect(Bar.A.name).toBe('A');

    Bar.A.value = -1;
    expect(Bar.A.value).toBe(1);
});