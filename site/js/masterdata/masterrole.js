import { APIGet } from "../api.js";
import { ServiceURL } from "../config.js";


let filteredData = [];
APIGet(ServiceURL.MasterData.getRole).then(res => {
    let rawData = res.data.data;
    let keysToAdd = ['id', 'name'];
    for(let i=0; i < rawData.length; i++) {
        let filteredDataIth = {}
        keysToAdd.forEach(keyToAdd => {
            Object.keys(rawData[i]).forEach(function(key) {
                if(key === keyToAdd) filteredDataIth[key] = rawData[i][key];
            });
        })
        filteredData[i] = filteredDataIth;
    }
}).catch(err => {
    console.log(err)
});

export const MasterRole = filteredData;