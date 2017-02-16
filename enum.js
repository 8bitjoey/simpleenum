class IllegalArgumentException extends Error {}

class Enum {

    /**
     * @param {int} value
     * @param {string} name
     * @param {*} extra any extra parameter(s)
     */
    constructor(value, name, extra) {
        /**
         * @var {int}
         */
        this._value = value;

        /**
         * @var {string}
         */
        this._name = name;

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
                propertyToEnumMap = this.nameToEnumMap;
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
    static createEnum(items, extra = null) {
        if (this.name == 'Enum') {
            throw new IllegalArgumentException('Can\'t create enums for Enum class');
        }

        if (extra && !Array.isArray(extra)) {
            throw new IllegalArgumentException('Extra params should be an array or null');
        }

        if (Array.isArray(extra) && extra.length != Object.keys(items).length) {
            throw new IllegalArgumentException('Extra params should be an array of the same length as enum has or null');
        }

        let newEnum = this;
        let valueToEnumMap = {};
        let nameToEnumMap = {};

        Object.keys(items).map((id, index) => {
            let name = items[id];
            let enumInstance = new this(parseInt(id), name, Array.isArray(extra) ? extra[index] : null);
            newEnum[name.toUpperCase()] = enumInstance;
            valueToEnumMap[id] = enumInstance;
            nameToEnumMap[name] = enumInstance;
        });

        // Define non-writable, non-enumerable properties
        Object.defineProperty(newEnum, 'valueToEnumMap', {value: valueToEnumMap});
        Object.defineProperty(newEnum, 'nameToEnumMap', {value: nameToEnumMap});

        return Object.freeze(newEnum);
    }
}

module.exports = {
    'Enum': Enum,
    'IllegalArgumentException': IllegalArgumentException
};

