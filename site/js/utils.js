import { Constant, END_POINT, Event, SECRET } from "./config.js"
import { getCookie } from "./cookiemanagement.js";

/**
 * Get inputvalue from a form
 * 
 * @param {FormElement} formElement 
 * @returns Object
 */
export function getFormValue(formElement) {
    // Make sure all input tag has name attribute

    const formData = new FormData(formElement), data = {};
    for (let [key, value] of formData) {
        data[key] = value;
    }

    formElement.querySelectorAll("[input]").forEach(element => {
        let key = element.name;
        let value = element.value;
        data[key] = value;
    })

    return isObjectEmpty(data) ? null : data;
}

export function getFormValueV2(element) {
    // Make sure all input tag has name attribute
    function getValue(element) {
        let hasAttrValue = element.hasAttribute("value") || element.value ? true : false;
        let valueValue = element.value || element.getAttribute("value");

        let tag = element.tagName;
        // if (tag != 'INPUT')
        //     return element.getAttribute("value");

        let type = element.type;
        if (type == "checkbox")
            valueValue = element.checked;

        if (type == "file")
            valueValue = element.files[0];

        return [hasAttrValue, valueValue];
    }

    function getName(element) {
        let hasAttrName = element.hasAttribute("name");
        let nameAttrValue = element.getAttribute("name");

        return [hasAttrName, nameAttrValue];
    }
    let result = {};

    let [hasName, name] = getName(element);
    let [hasValue, value] = getValue(element);

    if (hasName && hasValue) {
        result[name] = value;
        return result;
    }

    let isGroup = element.hasAttribute("group-name");
    if (isGroup) {
        let groupName = element.getAttribute("group-name");
        result[groupName] = [];
        forEach(element.children, (_, children) => {
            let data = getFormValueV2(children);
            if (!isObjectEmpty(data)) result[groupName].push(data);
        })
        return result;
    }

    forEach(element.children, (_, children) => {
        let data = getFormValueV2(children);
        Object.assign(result, data);
    })

    return result;
}

export function listenChangedInput() {
    document.addEventListener("change", e => {
        e.target.setAttribute("changed", "");
    });
}

export function getUpdateFormValue(element) {
    console.log(element);
    function getValue(element) {
        let hasAttrValue = element.hasAttribute("value") || element.value ? true : false;
        let valueValue = element.value || element.getAttribute("value");

        let tag = element.tagName;
        // if (tag != 'INPUT')
        //     return element.getAttribute("value");

        let type = element.type;
        if (type == "checkbox")
            valueValue = element.checked;

        if (type == "file")
            valueValue = element.files[0];

        return [hasAttrValue, valueValue];
    }

    function getName(element) {
        let hasAttrName = element.hasAttribute("name");
        let nameAttrValue = element.getAttribute("name");

        return [hasAttrName, nameAttrValue];
    }
    // Make sure all input tag has name attribute
    let result = {};

    let [hasName, name] = getName("name");
    let [hasValue, value] = getValue("value");
    let hasChange = element.hasAttribute("changed");
    if (hasName && hasValue && hasChange) {
        result[name] = value;
        return result;
    }

    if (hasName && hasChange) {
        result[name] = value;
        return result;
    }

    let isGroup = element.hasAttribute("group-name");
    if (isGroup) {
        let groupName = element.getAttribute("group-name");
        result[groupName] = [];
        forEach(element.children, (_, children) => {
            let data = getUpdateFormValue(children);
            if (!isObjectEmpty(data)) result[groupName].push(data);
        })
        return result;
    }

    forEach(element.children, (_, children) => {
        let data = getUpdateFormValue(children);
        Object.assign(result, data);
    })

    return result;
}

/**
 * 
 * 
 * @returns Boolean
 */
export function isMobileDevice() {
    let mobileList = /android|iphone|kindle|ipad/i;

    return mobileList.test(navigator.userAgent);
}

function isObject(data) {
    if (!(data instanceof Function) && data instanceof Object) return true;
    return false;
}

function isNum(val) {
    return !isNaN(val);
}

function isObjectEmpty(object) {
    return Object.keys(object).length <= 0 ? true : false;
}

export function map(array, callback) {
    let result = "";
    let temp = array.map(callback);
    for (let i = 0; i < temp.length; i++) {
        result += temp[i];
    }

    return result;
}

export function map2(object, callback) {
    let result = "";
    forEach(object, v => {
        let callbackResult = callback(v);
        result += callbackResult;
    });
    return result;
}
/*
{
    a : false
    b : false
    c : true
}
[
    {a:false}
    {b:false}
    {c:true}
]
[
    a,b,c
]
[
    false,false,true
]
*/
// filter(data, (k,v) => {
//     v === true
// })
export function filter(object, callback) {
    let result = [];
    let temp;
    forEach(object, (k, v) => {
        temp = callback(k, v);
        temp ? result.push(temp) : ""
    })
    return result;
}

export function range(stop, start = 0, step = 1) {
    stop--;
    return Array.from(
        { length: (stop - start) / step + 1 },
        (value, index) => start + index * step
    );
}

/**
 * 
 * @param {*} * 
 * 
 */

export function handleFormSubmited(callback, formSelector = "form", preventDefault = true, resetFormAfterSubmit = false) {
    let form = document.querySelector(formSelector)
    form.addEventListener('submit', e => {
        callback(e);
        if (resetFormAfterSubmit) form.reset();
        if (preventDefault) e.preventDefault();
    })
}

export function getElementUntilElementAvailable(selectors) {
    const TIME_OUT = 300;
    return new Promise((resolve, reject) => {
        let time = 0;
        let intervalId = setInterval(() => {
            let searchElement = document.querySelector(selectors);
            if (searchElement) {
                clearInterval(intervalId);
                resolve(searchElement);
            }
            if (time >= TIME_OUT) {
                clearInterval(intervalId);
                reject(`No Such Element ${selectors}`);
            }
            time += 50;
        }, 50);
    })
}

function getAllElementUntilElementAvailable(selectors) {
    const TIME_OUT = 300;
    return new Promise((resolve, reject) => {
        let time = 0;
        let intervalId = setInterval(() => {
            let searchElement = document.querySelectorAll(selectors);
            if (searchElement) {
                clearInterval(intervalId);
                resolve(searchElement);
            }
            if (time >= TIME_OUT) {
                clearInterval(intervalId);
                reject(`No Such Element ${selectors}`);
            }
            time += 50;
        }, 50);
    })
}

export async function addCustomEventListener(eventName, callback, element, triggerElement, triggerEvent = "click", preventDefault = false, stopBubbling = false) {
    element = element || document;
    element.addEventListener(eventName, e => {
        callback(e);
    });

    triggerElement = triggerElement || await getAllElementUntilElementAvailable(`[type=${eventName}]`);
    forEach(triggerElement, (key, el) => {
        el.addEventListener(triggerEvent, e => {
            const event = new CustomEvent(eventName, {
                detail: {
                    target: el
                }
            });
            if (preventDefault) e.preventDefault();
            if (stopBubbling) e.stopPropagation();
            element.dispatchEvent(event);
        });
    })
}

export function setAttributes(element, attribute) {
    Object.entries(attribute).forEach((key) => {
        element.setAttribute(key[0], key[1])
    })
};

export function forEach(data, callback, keySort = "none") {
    if (Array.isArray(data)) {
        let keys = keySort == "ASC" ? data.sort() : data;
        keys.forEach(value => {
            callback(value);
        });
    }
    else if (isObject(data)) {
        let keys = keySort == "ASC" ? Object.keys(data).sort() : Object.keys(data);
        keys.forEach(key => {
            callback(key, data[key]);
        });
    }
    else {
        callback(data);
    }
}

export function goTo(path, timeout) {
    // / Absolute
    // ./ relative
    if (getCurrentPath() === path) return;
    setTimeout(e => { window.location.href = path }, timeout ? timeout : Event.timeout);
}

export function goBack() {
    history.back();
}

export function numberWithThousandsSeparators(x, removedSeparator = ".", separator = ".") {
    if (isNum(x)) x = x.toString();
    x = x.replaceAll(removedSeparator, "");
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function convertImage64ToSrc(imageInBase64, imageExt = "png") {
    return `data:image/${imageExt};base64,` + imageInBase64;
}

export function convertImage64ToFile(imageInBase64){
    var base64 = imageInBase64;
    var base64Parts = base64.split(",");
    var fileFormat = base64Parts[0].split(";")[1];
    var fileContent = base64Parts[1];
    console.log(base64, fileFormat);
    var file = new File([fileContent], "KTP", {type: fileFormat});
    return file;
}

export function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function getCurrentPath() {
    let currentPath = window.location.pathname;
    return currentPath;
}

export function getParamOnURL(paramId) {
    let params = new URLSearchParams(location.search);
    return params.get(paramId);
}

export function getTempID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export function statusToString(statusCode) {
    if (statusCode === Constant.serviceRequestStatus.REJECTED) {
        return ["badge-red", Constant.serviceRequestStatus.REJECTED];
    }
    if (statusCode === Constant.serviceRequestStatus.SUBMITTED) {
        return ["badge-yellow", Constant.serviceRequestStatus.SUBMITTED];
    }
    if (statusCode === Constant.serviceRequestStatus.ACCEPTED) {
        return ["badge-blue", Constant.serviceRequestStatus.ACCEPTED];
    }
    if (statusCode === Constant.serviceRequestStatus.COMPLETED) {
        return ["badge-green", Constant.serviceRequestStatus.COMPLETED];
    }

    return ["badge-grey", `Invalid Status Code : ${statusCode}`]
}

export function paymentStatusToString(paymentStatus) {
    if (paymentStatus === "settlement") {
        return ["badge-green", "Berhasil Dibayar"];
    }
    else if (paymentStatus === "pending") {
        return ["badge-blue", "Menunggu Pembayaran"];
    }
    else if (paymentStatus === "not_selected") {
        return ["badge-yellow", "Belum Ada Metode Pembayaran"];
    }
    else if (paymentStatus === "cancel") {
        return ["badge-red", "Dibatalkan"];
    }

    return ["badge-grey", `Invalid Status Code : ${paymentStatus}`]
}

export function getUserID() {
    let cookie = getCookie("id");
    if (cookie == undefined) return undefined;
    return cookie;
}

export function getRoleOfUser() {
    let cookie = getCookie("role");
    if (cookie == undefined) return undefined;
    return cookie;
}

export function isOwnerOrAdmin() {
    if (getRoleOfUser() === Constant.role.OWNER || getRoleOfUser() === Constant.role.ADMIN) return true;
    else return false;
}

export function isOwner() {
    if (getRoleOfUser() === Constant.role.OWNER) return true;
    else return false;
}

export function isAdmin() {
    if (getRoleOfUser() === Constant.role.ADMIN) return true;
    else return false;
}

export function createElementFromString(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild;
}

export function getTicketRequest(id, date) {
    let uniqueCode = id.split('-')[2];
    return `T-${UNIXtimeConverter(date, "DD/MM/YY")}-${uniqueCode}`;
}

export function getInvoiceNumber(id, date) {
    return `INV/${UNIXtimeConverter(date, "YYYYMMDD")}/MPL/${id.substring(0, 8).toUpperCase()}`
}

// ====================================== DATE ======================================

export const minuteInMillis = 60_000;
export const hourInMillis = 3_600_000;
export const dayInMillis = 86_400_000;
export const weekInMillis = 7 * dayInMillis;
export const monthInMillis = 2_592_000_000; // 30 Days
export const yearInMillis = 31_536_000_000; //365 Days

export function groupingMillisecondsToSameDate(arrayData, dateKey, dateFormatKey) {
    let grouped = getCurrentWeekList(dateFormatKey);

    arrayData.forEach(data => {
        let date = UNIXtimeConverter(data[dateKey], dateFormatKey);
        if (date in grouped) {
            grouped[date].push(data);
        }
    })

    return grouped;
}

function getCurrentWeekList(dateFormat) {
    let weekList = {};

    let currentMillis = +new Date();
    // let currentMillis = 1675728001000;
    let currentDate = new Date(currentMillis);
    let currentDay = currentDate.getDay();

    for (let i = 0; i < 7; i++) {
        let offset = i - currentDay;
        let temp = currentMillis + (offset * dayInMillis);
        weekList[UNIXtimeConverter(temp, dateFormat)] = [];
    }

    return weekList;
}

export function getDateRange(startDateMillis, endDateMillis) {
    console.log(startDateMillis, endDateMillis);
    endDateMillis = isNum(endDateMillis) || endDateMillis > startDateMillis ? endDateMillis : startDateMillis + (6 * dayInMillis);
    let dateList = [];

    for (let i = startDateMillis; i <= endDateMillis; i += dayInMillis)
        // dateList[UNIXtimeConverter(i, dateFormat)] = [];
        dateList.push(UNIXtimeRemoveTime(i));

    return dateList;
}

export function getFirstMillisInWeek(currentMillis, isSundayFirst = true){
    let currentDay = new Date(currentMillis).getDay();
    
    let firstMillisInWeek = UNIXtimeRemoveTime(currentMillis - ((currentDay + isSundayFirst ? 1 : 2) * dayInMillis));

    return firstMillisInWeek;
}

export function isInSameDay(day1InMillis, day2InMillis) {
    let date1 = new Date(day1InMillis).toDateString();
    let date2 = new Date(day2InMillis).toDateString();

    return date1 == date2 ? true : false;
}

export function isUnderOneWeek(timeInMillis) {
    return (timeInMillis - Date.now()) / dayInMillis > 7 ? true : false;
}

export function UNIXtimeConverter(UNIXTimestamp, format = "MM/DD/YYYY hh:mm:ss UTZ", language = "id") {
    let a = new Date(UNIXTimestamp),
        months = {
            'eng': {
                long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            "id": {
                long: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                short: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"]
            }
        },
        dates = {
            'eng': {
                long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday"],
                short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            },
            'id': {
                long: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
                short: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
            }
        },
        year = a.getFullYear(),
        month = a.getMonth(),
        date = a.getDate(),
        day = a.getDay(),
        hour = a.getHours(),
        min = a.getMinutes(),
        sec = a.getSeconds(),
        tzn = a.toTimeString().substring(9);

    let tempFormat = {}
    let tempKey = ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "-", "="];

    let formatList = {
        DDDD: dates[language].long[day], //Sunday - Saturday
        DDD: dates[language].short[day], //Sun - Sat
        DD: date.toString().padStart(2, "0"), //01-31
        D: date, //1-31
        d: day, //0-6
        MMMM: months[language].long[month], //January - Desember
        MMM: months[language].short[month], //Jan - Des
        MM: (month + 1).toString().padStart(2, "0"), //01-12
        M: month + 1, //1-12
        YYYY: year, //1900-9999
        YY: year.toString().substring(2), // 00-99
        hh: hour.toString().padStart(2, "0"), //00-23
        mm: min.toString().padStart(2, "0"), //00-59
        ss: sec.toString().padStart(2, "0"), //00-59
        UTZ: tzn, //XXX+XXXX
    }

    for (let i = 0; i < Object.keys(formatList).length; i++) {
        let key = Object.keys(formatList)[i]
        tempFormat[key] = tempKey[i];
    }

    forEach(formatList, (key, value) => {
        format = format.replace(key, tempFormat[key])
    })

    forEach(formatList, (key, value) => {
        format = format.replace(tempFormat[key], value)
    })

    return format;
}

export function UNIXtimeRemoveTime(UNIXTimestamp) {
    let year = new Date(UNIXTimestamp).getFullYear();
    let month = new Date(UNIXTimestamp).getMonth();
    let date = new Date(UNIXTimestamp).getDate();

    let dateNoTime = new Date(year, month, date);
    dateNoTime.setHours(0);
    dateNoTime.setMinutes(0);
    dateNoTime.setSeconds(0);

    return dateNoTime.getTime();
}

export function convertDateToMillis(dateString) {
    let currentDate = new Date(dateString);
    return currentDate.getTime();
}

export function timeElapsed(UNIXTimestamp) {
    let millisSeconds = Math.floor(+new Date() - UNIXTimestamp);

    let interval = millisSeconds / monthInMillis;
    if (interval > 1) {
        return UNIXtimeConverter(UNIXTimestamp, "DD MMMM YYYY");
    }
    interval = millisSeconds / dayInMillis;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = millisSeconds / hourInMillis;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = millisSeconds / millisSeconds;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(millisSeconds/1000) + " seconds";
}

/**
 * 
 * @param {String} dateTimelocal 
 * @returns 
 */
export function dateTimeLocalInputToMilliseconds(dateTimelocal) {
    return new Date(dateTimelocal).getTime();
}