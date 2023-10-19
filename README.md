# qkie - Simple cookie managment

## Installation

```sh
npm install @conedevelopment/qkie

# or

yarn add @conedevelopment/qkie
```

## Usage

```js
import Cookie from '@conedevelopment/qkie';

const handler = new Cookie();
```

### Writing Cookies

```js
handler.set('theme', 'dark');

// Passing extra options
handler.set('theme', 'dark', new Date('2024-10-10'), '/', {
    SameSite: 'Lax',
    Secure: true,
});
```

### Reading Cookies

```js
let theme = handler.get('theme');

// With default value

let theme = handler.get('theme', 'dark');
```

### Checking Cookies

```js
if (handler.isset('theme')) {
    //
}
```

### Deleting Cookies

```js
handler.remove('theme');
```
