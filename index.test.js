import { describe, it, expect, beforeEach, vi } from 'vitest';
import Cookie from './index.js';

// Helper to clear all cookies between tests
function clearAllCookies() {
    document.cookie.split(';').forEach((c) => {
        const key = c.trim().split('=')[0];
        document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
}

// Intercept document.cookie writes so we can inspect the raw cookie string.
function spyCookieSetter() {
    const calls = [];
    const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');

    Object.defineProperty(document, 'cookie', {
        get: descriptor.get.bind(document),
        set(value) {
            calls.push(value);
            descriptor.set.call(document, value);
        },
        configurable: true,
    });

    return {
        calls,
        restore() {
            Object.defineProperty(document, 'cookie', descriptor);
        },
    };
}

describe('Cookie', () => {
    let cookie;

    beforeEach(() => {
        cookie = new Cookie();
        clearAllCookies();
    });

    // -------------------------------------------------------------------------
    // constructor
    // -------------------------------------------------------------------------

    describe('constructor', () => {
        it('defaults namespace to empty string', () => {
            expect(cookie.namespace).toBe('');
        });

        it('stores the given namespace', () => {
            const ns = new Cookie('app_');
            expect(ns.namespace).toBe('app_');
        });
    });

    // -------------------------------------------------------------------------
    // set()
    // -------------------------------------------------------------------------

    describe('set()', () => {
        it('sets a simple cookie', () => {
            cookie.set('name', 'alice');
            expect(document.cookie).toContain('name=alice');
        });

        it('encodes special characters in the value', () => {
            cookie.set('greeting', 'hello world');
            expect(cookie.get('greeting')).toBe('hello world');
        });

        it('accepts a numeric expiry (days in the future)', () => {
            cookie.set('name', 'alice', 7);
            expect(document.cookie).toContain('name=alice');
        });

        it('accepts a Date expiry', () => {
            const future = new Date(Date.now() + 86_400_000);
            cookie.set('name', 'alice', future);
            expect(document.cookie).toContain('name=alice');
        });

        it('accepts a UTC string expiry', () => {
            const future = new Date(Date.now() + 86_400_000).toUTCString();
            cookie.set('name', 'alice', future);
            expect(document.cookie).toContain('name=alice');
        });

        it('emits Secure without a value (not Secure=true)', () => {
            const spy = spyCookieSetter();

            cookie.set('name', 'alice');

            expect(spy.calls[0]).toContain('; Secure');
            expect(spy.calls[0]).not.toContain('Secure=true');

            spy.restore();
        });

        it('omits Secure when overridden with false', () => {
            const spy = spyCookieSetter();

            cookie.set('name', 'alice', null, '/', { Secure: false });

            expect(spy.calls[0]).not.toContain('Secure');

            spy.restore();
        });

        it('respects a custom path', () => {
            const spy = spyCookieSetter();

            cookie.set('name', 'alice', null, '/admin');

            expect(spy.calls[0]).toContain('path=/admin');

            spy.restore();
        });

        it('spreads additional options into the cookie string', () => {
            const spy = spyCookieSetter();

            cookie.set('name', 'alice', null, '/', { SameSite: 'Strict' });

            expect(spy.calls[0]).toContain('SameSite=Strict');

            spy.restore();
        });
    });

    // -------------------------------------------------------------------------
    // get()
    // -------------------------------------------------------------------------

    describe('get()', () => {
        it('retrieves the value of an existing cookie', () => {
            cookie.set('color', 'blue');
            expect(cookie.get('color')).toBe('blue');
        });

        it('returns the default value when the cookie does not exist', () => {
            expect(cookie.get('missing', 'default')).toBe('default');
        });

        it('returns an empty string by default when the cookie does not exist', () => {
            expect(cookie.get('missing')).toBe('');
        });

        it('decodes percent-encoded values', () => {
            cookie.set('msg', 'héllo');
            expect(cookie.get('msg')).toBe('héllo');
        });

        it('handles values containing an equals sign', () => {
            cookie.set('token', 'a=b');
            expect(cookie.get('token')).toBe('a=b');
        });
    });

    // -------------------------------------------------------------------------
    // isset()
    // -------------------------------------------------------------------------

    describe('isset()', () => {
        it('returns true when the cookie exists', () => {
            cookie.set('present', '1');
            expect(cookie.isset('present')).toBe(true);
        });

        it('returns false when the cookie does not exist', () => {
            expect(cookie.isset('absent')).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // remove()
    // -------------------------------------------------------------------------

    describe('remove()', () => {
        it('removes an existing cookie', () => {
            cookie.set('temp', 'data');
            expect(cookie.isset('temp')).toBe(true);

            cookie.remove('temp');
            expect(cookie.isset('temp')).toBe(false);
        });

        it('does not throw when removing a non-existent cookie', () => {
            expect(() => cookie.remove('ghost')).not.toThrow();
        });
    });

    // -------------------------------------------------------------------------
    // namespace
    // -------------------------------------------------------------------------

    describe('namespace', () => {
        it('prefixes the key with the namespace when setting', () => {
            const ns = new Cookie('app_');
            ns.set('user', 'bob');
            expect(document.cookie).toContain('app_user=bob');
        });

        it('retrieves the namespaced cookie with the same instance', () => {
            const ns = new Cookie('app_');
            ns.set('user', 'bob');
            expect(ns.get('user')).toBe('bob');
        });

        it('does not expose the cookie to a different namespace', () => {
            const ns1 = new Cookie('a_');
            const ns2 = new Cookie('b_');

            ns1.set('key', 'one');
            ns2.set('key', 'two');

            expect(ns1.get('key')).toBe('one');
            expect(ns2.get('key')).toBe('two');
        });

        it('isset() respects the namespace', () => {
            const ns = new Cookie('ns_');
            expect(ns.isset('x')).toBe(false);
            ns.set('x', '1');
            expect(ns.isset('x')).toBe(true);
            expect(cookie.isset('x')).toBe(false);
        });

        it('remove() respects the namespace', () => {
            const ns = new Cookie('ns_');
            ns.set('y', '1');
            ns.remove('y');
            expect(ns.isset('y')).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // _qualify()
    // -------------------------------------------------------------------------

    describe('_qualify()', () => {
        it('returns the key unchanged when no namespace and no special chars', () => {
            expect(cookie._qualify('simple')).toBe('simple');
        });

        it('prepends the namespace', () => {
            const ns = new Cookie('ns_');
            expect(ns._qualify('key')).toBe('ns_key');
        });

        it('escapes regex-special characters so they match literally', () => {
            const qualified = cookie._qualify('foo.bar');
            expect(qualified).toBe('foo\\.bar');
        });
    });

    // -------------------------------------------------------------------------
    // _getCookiePattern()
    // -------------------------------------------------------------------------

    describe('_getCookiePattern()', () => {
        it('returns a RegExp', () => {
            expect(cookie._getCookiePattern('key')).toBeInstanceOf(RegExp);
        });

        it('matches a cookie at the start of the cookie string', () => {
            const pattern = cookie._getCookiePattern('key');
            expect('key=value').toMatch(pattern);
        });

        it('matches a cookie that follows another cookie', () => {
            const pattern = cookie._getCookiePattern('second');
            expect('first=1; second=2').toMatch(pattern);
        });

        it('does not match a partial key name', () => {
            const pattern = cookie._getCookiePattern('key');
            expect('mykey=value').not.toMatch(pattern);
        });
    });
});
