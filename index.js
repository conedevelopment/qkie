export default class Cookie
{
    /**
     * Make a new Cookie instance.
     *
     * @param  {string}  namespace
     */
    constructor(namespace = '')
    {
        this.namespace = namespace;
    }

    /**
     * Set a cookie value for the given key.
     *
     * @param  {string}  key
     * @param  {string}  value
     * @param  {Date|string|null}  expires
     * @param  {string}  path
     * @param  {object}  options
     * @return {void}
     */
    set(key, value, expires = null, path = '/', options = {})
    {
        key = this._qualify(key);

        const cookie = {
            [key]: value,
            expires: expires instanceof Date ? expires.toUTCString() : expires,
            path,
            SameSite: 'Lax',
            Secure: true,
            ...options,
        };

        /** @type {string[]} */
        const initialValue = [];

        document.cookie = Object.entries(cookie)
            .reduce((stack, entry) => stack.concat(entry.join('=')), initialValue)
            .join('; ');
    }

    /**
     * Get the cookie with the given key.
     *
     * @param  {string}  key
     * @param  {*}  value
     * @return {*}
     */
    get(key, value = null)
    {
        key = this._escape(this._qualify(key));

        const cookie = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));

        return (cookie && cookie[2]) ? cookie[2] : value;
    }

    /**
     * Determine if the given cookie exists.
     *
     * @param  {string}  key
     * @return {boolean}
     */
    isset(key)
    {
        key = this._escape(this._qualify(key));

        return document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)')) !== null;
    }

    /**
     * Remove the given cookie.
     *
     * @param  {string}  key
     * @return {void}
     */
    remove(key)
    {
        key = this._qualify(key);

        this.set(key, '', 'Thu, 01 Jan 1970 00:00:01 GMT');
    }

    /**
     * Qualify the given key.
     *
     * @param  {string}  key
     * @return {string}
     */
    _qualify(key)
    {
        return this.namespace + key;
    }

    /**
     * Esacpe the given key.
     *
     * @param  {string}  key
     * @return {string}
     */
    _escape(key)
    {
        return key = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
