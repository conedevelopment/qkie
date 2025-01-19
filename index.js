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
     * @param  {string} value
     * @param  {Date|string|number|null}  expires - Number of days, Date, or string for expiry.
     * @param  {string}  path
     * @param  {object}  options
     * @return {void}
     */
    set(key, value, expires = null, path = '/', options = {})
    {
        key = this._qualify(key);

        value = encodeURIComponent(value).replace(
            /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
            decodeURIComponent
        );

        if (typeof expires === 'number') {
            const date = new Date();
            date.setDate(date.getDate() + expires);
            expires = date;
        }

        if (expires instanceof Date) {
            expires = expires.toUTCString();
        }

        const cookie = {
            [key]: value,
            expires,
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
    get(key, value = '')
    {
        key = this._qualify(key);

        const cookie = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));

        value = (cookie && cookie[2]) ? cookie[2] : value;

        return value.toString().replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    }

    /**
     * Determine if the given cookie exists.
     *
     * @param  {string}  key
     * @return {boolean}
     */
    isset(key)
    {
        key = this._qualify(key);

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
        return encodeURIComponent(this.namespace + key)
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent);
    }
}
