const enumlib = require('./enum');
const Enum = enumlib.Enum;
const InvalidArgumentException = enumlib.InvalidArgumentException;

test('creating new enum', () => {
    let MyEnum1 = Enum.create({'mercury': 1, 'earth': 3, 'saturn': 5});

    expect(MyEnum1.MERCURY.value).toBe(1);
    expect(MyEnum1.EARTH.value).toBe(3);
    expect(MyEnum1.SATURN.value).toBe(5);

    expect(MyEnum1.MERCURY.name).toBe('mercury');
    expect(MyEnum1.EARTH.name).toBe('earth');
    expect(MyEnum1.SATURN.name).toBe('saturn');

    // may be requires babel to work
    // expect(MyEnum1.name).toBe('MyEnum1');

    let xExtra = {'foo': 'bar'};
    let MyEnum2 = Enum.create({'x': 1, 'y': 2, 'z': 3}, [xExtra, 10, 'hello']);

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
    let MyEnum1 = Enum.create({'x': 1, 'y': 2, 'z': 3}, [extra1, null, null]);
    let MyEnum2 = Enum.create({'x': 1, 'y': 2, 'z': 3}, [extra2, null, null]);

    expect(MyEnum1).not.toBe(MyEnum2);
    expect(MyEnum1.X).not.toBe(MyEnum2.X);
    expect(MyEnum1.X.id).toBe(MyEnum2.X.id);
    expect(MyEnum1.X.name).toBe(MyEnum2.X.name);
    expect(MyEnum1.X.extra).not.toBe(MyEnum2.X.extra);

    expect(MyEnum1.X).toBe(MyEnum1.X);
});

test('ensure enums have expected inheritance', () => {
    let MyEnumA = Enum.create({'x': 1, 'y': 2, 'z': 3});
    let MyEnumBInstance = Enum.create({'x': 1, 'y': 2, 'z': 3});

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

test('create has to have correct extra argument', () => {
    expect(() => Enum.create({'x': 1}))
        .not.toThrow();
    expect(() => Enum.create({'x': 1}, null))
        .not.toThrow();
    expect(() => Enum.create({'x': 1}, ['hello']))
        .not.toThrow();
    expect(() => Enum.create({'x': 1}, 'hello'))
        .toThrow(InvalidArgumentException);
    expect(() => Enum.create({'x': 1}, 'hello'))
        .toThrow('Extra params should be an array or null');

    expect(() => Enum.create({'x': 1, 'y': 2}))
        .not.toThrow();
    expect(() => Enum.create({'x': 1, 'y': 2}, null))
        .not.toThrow();
    expect(() => Enum.create({'x': 1, 'y': 2}, ['hello', 'world']))
        .not.toThrow();
    expect(() => Enum.create({'x': 1, 'y': 2}, ['hello']))
        .toThrow(InvalidArgumentException);
    expect(() => Enum.create({'x': 1, 'y': 2}, ['hello']))
        .toThrow('Extra params should be an array of the same length as enum has or null');
    expect(() => Enum.create({'x': 1, 'y': 2}, ['hello', 'world', '!']))
        .toThrow(InvalidArgumentException);
    expect(() => Enum.create({'x': 1, 'y': 2}, ['hello', 'world', '!']))
        .toThrow('Extra params should be an array of the same length as enum has or null');
    expect(() => Enum.create({'x': 1, 'y': 2}, 'hello', 'world'))
        .toThrow(InvalidArgumentException);
    expect(() => Enum.create({'x': 1, 'y': 2}, 'hello', 'world'))
        .toThrow('Extra params should be an array or null');
});

test('Enum.valueOf', () => {
    let Foo = Enum.create({'UPPERCASE': 1, 'lowercase': 2});

    expect(Foo.UPPERCASE).toBe(Foo.valueOf('uppercase'));
    expect(Foo.UPPERCASE).toBe(Foo.valueOf('UPPERCASE'));
    expect(Foo.UPPERCASE).toBe(Foo.valueOf(1));

    expect(Foo.LOWERCASE).toBe(Foo.valueOf('lowercase'));
    expect(Foo.LOWERCASE).toBe(Foo.valueOf('LOWERCASE'));
    expect(Foo.LOWERCASE).toBe(Foo.valueOf(2));
});

test('enum is not changeable', () => {
    let Bar = Enum.create({'A': 1, 'B': 2, 'C': 3});

    Bar.D = new Enum('D', 4);
    expect(Bar.D).toBeUndefined();

    Bar.B = new Enum('X', 10, 'test');
    expect(Bar.B.value).toBe(2);
    expect(Bar.B.name).toBe('B');
    expect(Bar.B.extra).toBeNull();

    Bar.A.name = 'AAA';
    expect(Bar.A.name).toBe('A');

    Bar.A.value = -1;
    expect(Bar.A.value).toBe(1);
});

// TODO: test with string values
