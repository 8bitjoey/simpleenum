class IllegalArgumentException extends Error {}

class Enum {

    /**
     * @param {string} name
     * @param {string|int} value
     * @param {*} extra any extra parameter(s)
     */
    constructor(name, value, extra) {
        /**
         * @var {string}
         */
        this._name = name;

        /**
         * @var {string|int}
         */
        this._value = value;

        /**
         * @var {*}
         */
        this._extra = extra;
    }

    /**
     * @return {int}
     */
    get value() {
        return this._value;
    }

    /**
     * @return {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @return {*}
     */
    get extra() {
        return this._extra;
    }

    /**
     * @param {string|int} property
     * @return {Enum}
     * @throws {IllegalArgumentException}
     */
    static valueOf(property) {
        let propertyType = typeof property;
        let propertyToEnumMap = null;

        switch (propertyType) {
            case 'string':
                property = property.toUpperCase();
                propertyToEnumMap = this.nameToEnumMap[property] ? this.nameToEnumMap : this.valueToEnumMap;
                break;

            case 'number':
                propertyToEnumMap = this.valueToEnumMap;
        }

        if (propertyToEnumMap && propertyToEnumMap[property]) {
            return propertyToEnumMap[property];
        }

        throw new IllegalArgumentException('No constant with specified name');
    }

    /**
     * @param {Object.<int, string>} items
     * @param {*[]|null} [extra] extra values stored in enums
     */
    static create(items, extra = null) {
        if (extra && !Array.isArray(extra)) {
            throw new IllegalArgumentException('Extra params should be an array or null');
        }

        if (Array.isArray(extra) && extra.length != Object.keys(items).length) {
            throw new IllegalArgumentException('Extra params should be an array of the same length as enum has or null');
        }

        let newEnum = class extends this {};
        let valueToEnumMap = {};
        let nameToEnumMap = {};

        // TODO: use getValidPropertyName for prop names and add a test for that
        Object.keys(items).map((name, index) => {
            let value = items[name];
            let enumInstance = new newEnum(name, value, Array.isArray(extra) ? extra[index] : null);
            newEnum[name.toUpperCase()] = enumInstance;
            valueToEnumMap[value] = enumInstance;
            nameToEnumMap[name.toUpperCase()] = enumInstance;
        });

        // Define non-writable, non-enumerable properties
        Object.defineProperty(newEnum, 'valueToEnumMap', {value: valueToEnumMap});
        Object.defineProperty(newEnum, 'nameToEnumMap', {value: nameToEnumMap});

        return Object.freeze(newEnum);
    };
}

module.exports = {
    'Enum': Enum,
    'IllegalArgumentException': IllegalArgumentException
};
