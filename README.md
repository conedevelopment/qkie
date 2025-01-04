<p>
  <br>
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="./.github/qkie-logo-dark.svg">
    <source media="(prefers-color-scheme: dark)" srcset="./.github/qkie-logo-light.svg">
    <img alt="qkie" width="120" src="./.github/qkie-logo-dark.svg">
  </picture>
  <br>
</p>


# Simple Cookie Management

`qkie` is a simple and lightweight JavaScript package for managing cookies in the browser. It provides methods for setting, getting, checking existence, and removing cookies, with a namespace feature for easy organization. It also allows specifying expiration dates, path settings, and additional cookie options.

## Features

- **Set cookies**: Store cookies with optional expiration, path, and other settings.
- **Get cookies**: Retrieve the value of a specific cookie by its key.
- **Check if a cookie exists**: Easily check if a cookie with a given key is present.
- **Remove cookies**: Clear cookies by their key.
- **Namespace support**: Use a namespace for cookie keys to avoid key collisions.
- **Secure and SameSite options**: Default cookie attributes for security.
  
## Installation

You can include `qkie` in your project by using `npm` or `yarn`:

```bash
npm install @conedevelopment/qkie

# or

yarn add @conedevelopment/qkie
```

Without `npm` or `yarn`, you can download the file from this repository and manually add it to your project folder (index.js at the root).

## Usage

### Importing 

Because of the JS modules syntax, first, you need to import the library into any specific project file.

If you use a bundler that resolves your `node_modules` folder automatically, then:

```javascript
import Cookie from '@conedevelopment/qkie';
```

If you are NOT using a bundler, you can use [JS modules in the browser](https://www.w3schools.com/js/js_modules.asp).

```html
<script type="module">
    import Cookie from './qkie.js';
</script>
```
When you load the script that imports `qkie` add `type="module"` and make sure you use the exact path to the location (primarily relative).

### Creating a Cookie Instance

To use `qkie`, first instantiate a `Cookie` object. Optionally, you can provide a namespace to group your cookies.

```javascript
const cookie = new Cookie('myNamespace_');  // Cookies will have a "myNamespace_" prefix
```

### Setting a Cookie

Use the `set` method to store a cookie with a key-value pair. You can also set an expiration date, path, and additional options such as `Secure` and `SameSite`.

```javascript
cookie.set('user', 'john_doe', new Date('2025-01-01'), '/', { Secure: true, SameSite: 'Strict' });
```

- **key**: The name of the cookie.
- **value**: The value to store.
- **expires**: The cookie's expiration date (optional). It can be JS date object, a number (in days) or a string (UTC).
- **path**: The path for which the cookie is valid (default is `/`).
- **options**: Additional cookie settings like `Secure`, `SameSite`. These two options will always get default settings for better security.

### Getting a Cookie

Use the `get` method to retrieve the value of a cookie by its key.

```javascript
const user = cookie.get('user');
console.log(user);  // Outputs 'john_doe'
```

You can also provide a default value in case the cookie does not exist.

```javascript
const user = cookie.get('user', 'default_user');
console.log(user);  // Outputs 'default_user' if 'user' cookie is not set
```

### Checking If a Cookie Exists

To check if a specific cookie exists, use the `isset` method.

```javascript
const exists = cookie.isset('user');
console.log(exists);  // true if cookie exists, false if not
```

### Removing a Cookie

To remove a cookie, use the `remove` method.

```javascript
cookie.remove('user');
```

This will set the cookie's expiration date to a past date, effectively removing it from the browser.

## Example

Here’s an example that demonstrates setting, getting, and removing cookies:

```javascript
// Create a new Cookie instance with namespace
const cookie = new Cookie('app_');

// Set cookies
cookie.set('session_id', '123abc', new Date('2025-12-31'), '/');
cookie.set('session_id', '123abc', 30, '/');
cookie.set('theme', 'dark', null, '/');

// Get cookies
console.log(cookie.get('session_id')); // Outputs '123abc'
console.log(cookie.get('theme')); // Outputs 'dark'

// Check if cookies exist
console.log(cookie.isset('session_id')); // true
console.log(cookie.isset('non_existing')); // false

// Remove cookies
cookie.remove('session_id');
console.log(cookie.isset('session_id')); // false
```

## API Reference

### `new Cookie(namespace = '')`

Creates a new Cookie instance with an optional namespace. The namespace is used to prefix the cookie keys, allowing you to group them under a unique name.

### `set(key, value, expires = null, path = '/', options = {})`

Sets a cookie with the specified key and value. You can also specify expiration date, path, and additional cookie options.

- **key**: The cookie name.
- **value**: The value to store.
- **expires**: Expiration date of the cookie (optional).
- **path**: The path for the cookie (optional, default is `/`).
- **options**: Additional options such as `Secure`, `SameSite`, etc.

### `get(key, value = null)`

Retrieves the value of the cookie with the given key. If the cookie does not exist, the provided default value is returned.

- **key**: The cookie name.
- **value**: The default value to return if the cookie does not exist (optional).

### `isset(key)`

Checks if a cookie with the given key exists.

- **key**: The cookie name.

### `remove(key)`

Removes the cookie by setting its expiration date to a past date.

- **key**: The cookie name.

## License

MIT License. See [LICENSE](https://github.com/conedevelopment/qkie/blob/master/LICENSE) for more information.

## Contribution

If you find a bug or have a feature request, please open an issue or submit a pull request on GitHub. We welcome contributions to improve the library!

---

We are Cone (the maintainers), a small [Laravel and WordPress development](https://conedevelopment.com/) studio.

