// Route JS
let routeJs = document.createElement("script");
routeJs.setAttribute("src", "js/routes.js");
routeJs.setAttribute("type", "module");
document.head.appendChild(routeJs);

// General CSS
let fontAwesomeV6 = document.createElement("link");
fontAwesomeV6.setAttribute("rel", "stylesheet");
fontAwesomeV6.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css");
document.head.appendChild(fontAwesomeV6);

let bootstrapCss = document.createElement("link");
bootstrapCss.setAttribute("rel", "stylesheet");
bootstrapCss.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css");
document.head.appendChild(bootstrapCss);

let styleCSS = document.createElement("link");
styleCSS.setAttribute("rel", "stylesheet");
styleCSS.setAttribute("href", "css/style.css");
document.head.appendChild(styleCSS);

let navbarCss = document.createElement("link");
navbarCss.setAttribute("rel", "stylesheet");
navbarCss.setAttribute("href", "css/navbar.css");
document.head.appendChild(navbarCss);

let toastCss = document.createElement("link");
toastCss.setAttribute("rel", "stylesheet");
toastCss.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css");
document.head.appendChild(toastCss);

// General JS
let bootstrapJs = document.createElement("script");
bootstrapJs.setAttribute("src", "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js");
document.head.appendChild(bootstrapJs);

let fontAwesomeV5Premium = document.createElement("script");
fontAwesomeV5Premium.setAttribute("src", "https://kit-pro.fontawesome.com/releases/v5.10.1/js/pro.min.js");
fontAwesomeV5Premium.setAttribute("data-auto-fetch-svg", "");
document.head.appendChild(fontAwesomeV5Premium);

let axiosJs = document.createElement("script");
axiosJs.setAttribute("src", "https://cdn.jsdelivr.net/npm/axios@1.2.0/dist/axios.min.js")
document.head.appendChild(axiosJs);

// let jQueryJs = document.createElement("script");
// jQueryJs.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js")
// document.head.appendChild(jQueryJs);

let navbarJs = document.createElement("script");
navbarJs.setAttribute("type", "module");
navbarJs.setAttribute("src", "js/component/navbar.js");
document.head.appendChild(navbarJs);

let mainJs = document.createElement("script");
mainJs.setAttribute("type", "module");
mainJs.setAttribute("src", "js/main.js");
document.head.appendChild(mainJs);

// let chartJs = document.createElement("script");
// chartJs.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js");
// chartJs.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js");
// document.head.appendChild(chartJs);