export default class Cookie
{
    /**
     * Make a new Cookie instance.
     *
     * @return {void}
     */
    constructor(namespace = '')
    {
        this.namespace = namespace;
    }

    /**
     * Set a cookie value for the given key.
     *
     * @param  {string}  key
     * @param  {string} value
     * @param  {Date|string|null}  expires
     * @param  {string}  path
     * @param  {object}  options
     * @return {void}
     */
    set(key, value, expires = null, path = '/', options = {})
    {
        key = this.namespace + key;

        const pairs = Object.assign({
            [key]: value,
            expires: expires instanceof Date ? expires.toUTCString() : expires,
            path,
        }, { SameSite: 'Lax', Secure: true }, options);

        document.cookie = Object.entries(pairs)
            .reduce((stack, entry) => stack.concat(entry.join('=')), [])
            .join('; ');
    }

    /**
     * Get the cookie with the given key.
     *
     * @param  {string}  key
     * @param  {mixed}  value
     * @return {mixed}
     */
    get(key, value = null)
    {
        key = this.namespace + key;

        const cookie = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));

        return (cookie && cookie[2]) ? cookie[2] : value;
    }

    /**
     * Determine if the given cookie exists.
     *
     * @param  {string}  key
     * @return {bool}
     */
    isset(key)
    {
        key = this.namespace + key;

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
        key = this.namespace + key;

        this.set(key, null, 'Thu, 01 Jan 1970 00:00:01 GMT');
    }
}
