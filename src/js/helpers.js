import { TIMEOUT_SEC } from "./config.js";


const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};


export const getJSON = async function (url) {
    try {
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); //await promise from fetch. Promise.race will race to find which resolved first, either fetching url or the timeout
        //const res = await fetch(url);
        //Once we have the result convert to json
        const data = await res.json(); //data is the resulting promise value which will be awaited in the importing file
        //Handling wrong requests
        if (!res.ok) throw new Error(`${data.message} (${res.status})`)
        return data;
    } catch (err) {
        throw err;//Throw the new error. Now the promise that is returned from getJSON is actually rejected. The error will be handled in the importing file model.js. Instead, If we just log the error, the promise is still fulfilled
    }

}

export const sendJSON = async function (url, uploadData) {
    try {
        const res = await Promise.race([fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //Authorization: api_key,// This is an example of a best practise
            body: JSON.stringify(uploadData),
        }), timeout(TIMEOUT_SEC)]); //await promise from fetch. Promise.race will race to find which resolved first, either fetching url or the timeout
        //const res = await fetch(url);
        //Once we have the result convert to json
        const data = await res.json(); //data is the resulting promise value which will be awaited in the importing file
        //Handling wrong requests
        if (!res.ok) throw new Error(`${data.message} (${res.status})`)
        return data;
    } catch (err) {
        throw err;//Throw the new error. Now the promise that is returned from getJSON is actually rejected. The error will be handled in the importing file model.js. Instead, If we just log the error, the promise is still fulfilled
    }

}
