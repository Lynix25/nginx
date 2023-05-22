import { APIGet } from "./api.js";
import { ServiceURL } from "./config.js";
import { getParamOnURL } from "./utils.js";

APIGet(ServiceURL.Transaction.get(getParamOnURL("id"))).then(res => {
    console.log(res);
})