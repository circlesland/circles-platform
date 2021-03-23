export const a = "";
/*
import {execute} from "../dist/cli.generateUcan";

const https = require('https')
const http = require('http')

function request(ucan:string, data: string) {

    const options = {
        hostname: 'localhost',
        port: 8989,
        path: '/graphql',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Authorization': ucan,
        }
    }
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res: any) => {
            console.log(`statusCode: ${res.statusCode}`)

            res.on('data', (d: any) => {
                resolve(d);
            })
        })

        req.on('error', (error: any) => {
            reject(error);
        })

        req.write(data)
        req.end()
    });
}

async function generateLoad(i: number) {
    const ucan = await execute(i.toString());
    let data = "";

    data = JSON.stringify({
        "operationName": null,
        "variables": {},
        "query": "mutation { upsertProfile(data: {omoFirstName: \"" + i + "\", omoLastName: \"" + i + "\"}) { fissionName omoFirstName omoLastName } }"
    });
    console.log(data);


    // upsert profile 'i'
    let response = await request(ucan.ucan, data);
    console.log(response.toString());

    // create offer
    data = JSON.stringify({
        "operationName": null,
        "variables": {},
        "query": "mutation { createOffer(data: { title: \"abc\" price: \"100\" description: \"abc\" category: \"Category 1\" country: \"DE\" city: \"München\" deliveryTerms: \"pickup\" pictures: []}) { id }"
    });
    console.log(data);
    response = await request(ucan.ucan, data);
    console.log(response.toString());

    // Query 20 other profiles
    for (let a = 0; a < 20; a++) {
        const rnd = (Math.random() * (1000 - 1) + 1).toFixed(0);
        data = JSON.stringify({
            "operationName": null,
            "variables": {},
            "query": "query { profiles(query: {fissionName: \"" + rnd + "\"}) { fissionName offers { id publishedAt title description }}}"
        });
        console.log(data);

        response = await request(ucan.ucan, data);
        console.log(response.toString());
    }
}

generateLoad(1);

*/