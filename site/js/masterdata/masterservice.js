import { APIGet } from "../api.js";
import { ServiceURL } from "../config.js";


let masterData = [];
APIGet(ServiceURL.MasterData.getServiceCategory).then(res => {
    let data = res.data.data;
    for(let i=0; i < data.length; i++) {
        masterData[i] = data[i];
    }
}).catch(err => {
    console.log(err)
});

export const MasterService = masterData;