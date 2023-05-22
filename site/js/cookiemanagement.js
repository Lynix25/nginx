/**
 * Get cookie from a cookies list
 * @param {String} cookieName 
 * @returns value of the cookie 
 */
export function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieList = decodedCookie.split(';');
    for (let i = 0; i < cookieList.length; i++) {
        let cookie = cookieList[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return undefined;
}

export function setCookie(key, value, expiresInHour) {
    const d = new Date();
    // d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    d.setTime(d.getTime() + (1 * expiresInHour * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
}

export function deleteCookie(...keys) {
    const cookies = document.cookie.split(";");
    cookies.forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const cookieName = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie;
        if (keys.includes(cookieName))
            document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";

    });
}