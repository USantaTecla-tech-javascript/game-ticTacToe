# JavaScript library for enums

Simple JS library for enums. https://www.npmjs.com/package/enums-js

### Installation
```
npm install enums-js
```

### Usage:
Pass list of entries to constructor.
Entry can be simple string. In this case, this string is used as enum key, and value is set automatically, similar to TypeScript enums. 
```
const Color = new Enum('red', 'green', 'blue');

console.log(Color.keys()); // ['RED', 'GREEN', 'BLUE']
console.log(Color.RED.value); // 0
console.log(Color.RED === Color.GREEN); // false
console.log(Color.BLUE === Color.BLUE); // true
console.log(Color.GREEN.value === 1); // true
console.log(Color.RED.ordinal); // 0
console.log(Color.BLUE.ordinal); // 2
```

You can also use a key-value pair as a value. Just define it as an array. If only key is passed to array, value is equal to key.
```
const Color = new Enum(['red', 'color-red'], ['green', 'color-green'], ['blue']);

console.log(Color.keys()); // ['RED', 'GREEN', 'BLUE']
console.log(Color.RED.value); // color-red
console.log(Color.BLUE.value); // blue
console.log(Color.RED === Color.GREEN); // false
console.log(Color.GREEN.value === 'green'); // false
console.log(Color.GREEN.value === 'color-green'); // true
```

If you set value as a number, all subsequent values will be greater than that number, similar to TypeScript
```
const ActiveStatus = new Enum('off', 'on', ['error_missing_data', 10], 'error_access_denied', 'error_not_found', ['undefined', 255]);

console.log(ActiveStatus.OFF.value); // 0
console.log(ActiveStatus.ON.value); // 1
console.log(ActiveStatus.ERROR_MISSING_DATA.value); // 10
console.log(ActiveStatus.ERROR_ACCESS_DENIED.value); // 11
console.log(ActiveStatus.ERROR_NOT_FOUND.value); // 12
console.log(ActiveStatus.UNDEFINED.value); // 255
```
