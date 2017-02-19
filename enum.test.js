const Enum = require('./enum');
let exceptions = require('node-exceptions');
let InvalidArgumentException = exceptions.InvalidArgumentException;

describe('Creating basic enums', () => {
    test('Сreating new enum', () => {
        let MyEnum = Enum.create({'mercury': 1, 'earth': 3, 'Saturn': 5});

        expect(MyEnum.MERCURY.value).toBe(1);
        expect(MyEnum.EARTH.value).toBe(3);
        expect(MyEnum.SATURN.value).toBe(5);

        expect(MyEnum.MERCURY.name).toBe('mercury');
        expect(MyEnum.EARTH.name).toBe('earth');
        expect(MyEnum.SATURN.name).toBe('Saturn');
    });

    test('Сreating new enum with extras', () => {
        let xExtra = {'foo': 'bar'};
        let MyEnum = Enum.create({'x': 1, 'y': 2, 'z': 3}, [xExtra, 10, 'hello']);

        expect(MyEnum.X.value).toBe(1);
        expect(MyEnum.Y.value).toBe(2);
        expect(MyEnum.Z.value).toBe(3);

        expect(MyEnum.X.name).toBe('x');
        expect(MyEnum.Y.name).toBe('y');
        expect(MyEnum.Z.name).toBe('z');

        expect(MyEnum.X.extra).toBe(xExtra);
        expect(MyEnum.Y.extra).toBe(10);
        expect(MyEnum.Z.extra).toBe('hello');
    });

    test('Creating with incorrect extra argument', () => {
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
});

describe('Enums behavior', () => {
    test('enum has only keys for given names', () => {
        let MyEnum = Enum.create({'x': 1, 'y': 2, 'z': 3});

        expect(Object.keys(MyEnum)).toEqual(expect.arrayContaining(['X', 'Y', 'Z']));
        expect(Object.keys(MyEnum)).not.toContain('valueToEnumMap');
        expect(Object.keys(MyEnum)).not.toContain('nameToEnumMap');
    });

    test('enums don\'t share items', () => {
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

    test('enums have expected inheritance', () => {
        let MyEnumA = Enum.create({'x': 1, 'y': 2, 'z': 3});
        let MyEnumB = Enum.create({'x': 1, 'y': 2, 'z': 3});

        // MyEnumA and MyEnumB are just frozen holders of enums, they're not Enums themselves
        expect(MyEnumA).not.toBeInstanceOf(Enum);
        expect(MyEnumB).not.toBeInstanceOf(Enum);

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
            expect(MyEnumA[key]).not.toBeInstanceOf(MyEnumB);
        });

        Object.keys(MyEnumB).map((key) => {
            expect(MyEnumB[key]).toBeInstanceOf(MyEnumB);
            expect(MyEnumB[key]).toBeInstanceOf(Enum);
            expect(MyEnumB[key]).not.toBeInstanceOf(MyEnumA);
        });
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
});

describe('Enum.valueOf', () => {
    test('Lower and upper case of name', () => {
        let Foo = Enum.create({'UPPERCASE': 1, 'lowercase': 2});

        expect(Foo.UPPERCASE).toBe(Foo.valueOf('uppercase'));
        expect(Foo.UPPERCASE).toBe(Foo.valueOf('UPPERCASE'));
        expect(Foo.UPPERCASE).toBe(Foo.valueOf(1));

        expect(Foo.LOWERCASE).toBe(Foo.valueOf('lowercase'));
        expect(Foo.LOWERCASE).toBe(Foo.valueOf('LOWERCASE'));
        expect(Foo.LOWERCASE).toBe(Foo.valueOf(2));
    });

    test('Working with string values', () => {
        let Bar = Enum.create({'X': 1, 'Y': 'X', 'A': 'B'});

        expect(Bar.Y).toBe(Bar.valueOf('Y'));
        expect(Bar.Y).toBe(Bar.valueOf('y'));

        expect(Bar.X).toBe(Bar.valueOf('x'));
        expect(Bar.X).toBe(Bar.valueOf('X'));

        expect(Bar.A).toBe(Bar.valueOf('a'));
        expect(Bar.A).toBe(Bar.valueOf('A'));
        expect(Bar.A).toBe(Bar.valueOf('b'));
        expect(Bar.A).toBe(Bar.valueOf('B'));
    });
});

// valid property name - is a name which is available as CreatedEnum.<propertyName>
// non-valid one - is a name which is only available as CreatedEnum[propertyName]
describe('Enums with non-valid property names', () => {
    test('Creating enums with non valid property names', () => {
        let MyEnum = Enum.create({'X x': 1, '123': 2, '$x': 3, '$123': 4, 'X/Y': 5, 'X-Z': 6});

        expect(MyEnum.X_X.name).toBe('X x');
        expect(MyEnum.___.name).toBe('123');
        expect(MyEnum.$X.name).toBe('$x');
        expect(MyEnum.$123.name).toBe('$123');
        expect(MyEnum.X_Y.name).toBe('X/Y');
        expect(MyEnum.X_Z.name).toBe('X-Z');
    });

    test('Creating enums with non valid property names which cause property duplicates', () => {
        expect(() => Enum.create({'X x': 1, 'X/X': 2})).toThrow(InvalidArgumentException);
        expect(() => Enum.create({'X x': 1, 'X/X': 2}))
            .toThrow('Some names turn to be the same after making them valid JS IdentifierName');
    });

    test('Enum.valueOf works fine with invalid property names', () => {
        let MyEnum = Enum.create({'X x': 1});

        expect(MyEnum.X_X).toBe(MyEnum.valueOf(1));
        expect(MyEnum.X_X).toBe(MyEnum.valueOf('x x'));
        expect(MyEnum.X_X).toBe(MyEnum.valueOf('X X'));

        expect(() => MyEnum.valueOf('X_X')).toThrow(InvalidArgumentException);
        expect(() => MyEnum.valueOf('X_X')).toThrow('No enum with specified name');
    });
});

describe('Creating classes based on Enum', () => {
    test('Child class with additional getter', () => {
        class DescriptionEnum extends Enum {
            constructor(...args) {
                super(...args);
                if (!this.extra || !this.extra.description) {
                    throw new InvalidArgumentException('Description is a required property of an extra');
                }
            }

            get description() {
                return this.extra.description;
            }
        }

        expect(() => DescriptionEnum.create({'Add': 1, 'Remove': 2})).toThrow(InvalidArgumentException);
        expect(() => DescriptionEnum.create({'Add': 1, 'Remove': 2})).toThrow('Description is a required property of an extra');

        let MyDescriptionEnum = DescriptionEnum.create({'Add': 1}, [{description: 'Adds something'}]);

        expect(MyDescriptionEnum).not.toBeInstanceOf(MyDescriptionEnum);
        expect(MyDescriptionEnum).not.toBeInstanceOf(DescriptionEnum);
        expect(MyDescriptionEnum).not.toBeInstanceOf(Enum);

        expect(MyDescriptionEnum.ADD).toBeInstanceOf(MyDescriptionEnum);
        expect(MyDescriptionEnum.ADD).toBeInstanceOf(DescriptionEnum);
        expect(MyDescriptionEnum.ADD).toBeInstanceOf(Enum);

        expect(MyDescriptionEnum.ADD.description).toBe('Adds something');
    });
});
