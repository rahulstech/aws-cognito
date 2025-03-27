const jwt = require('jwt-decode');

function jwtDecode(token) {
    const decoded = jwt.jwtDecode(token, { header: false });
    return decoded;
}

function pickOnly(src, keys, keepUndefined = true, dest = {}) {
    if (!src) {
        return dest;
    }
    const keySet = new Set(keys);
    const filtered = Object.fromEntries(
        Object.entries(src).filter(([k,v]) => {
            if (keySet.has(k)) {
                return keepUndefined || v !== undefined;
            }
            return false;
        })
    )
    const copy = { ...(dest || {}), ...filtered };
    return copy;
}

module.exports = { jwtDecode, pickOnly, }