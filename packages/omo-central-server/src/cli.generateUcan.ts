import {buildUcan, publicKeyToDid, stripPem} from "omo-ucan/dist";
const crypto = require('crypto');
const fs = require('fs');

const args = process.argv.slice(2);

const generateKeyPair = () => new Promise<{
    publicKey:string,
    privateKey:string
}>((resolve, reject) => {
    const options = {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    };
    crypto.generateKeyPair("rsa", options,  (err:any, publicKey:string, privateKey:string) => {
        if (err) {
            reject(err);
            return;
        }
        resolve({
            publicKey,
            privateKey
        });
    });
});

const audienceDid = "did:key:zStEZpzSMtTt9k2vszgvCwF4fLQQSyA15W5AQ4z3AR6Bx4eFJ5crJFbuGxKmbma4";
const username = args[0];

export async function execute(uname?:string) : Promise<{
    keyPair:{
        publicKey:string,
        privateKey:string
    },
    ucan:string
    username:string
}> {
    uname = uname ?? username;
    const keyPair = await generateKeyPair();
    const issuerDid = publicKeyToDid(stripPem(keyPair.publicKey));
    const ucan = await buildUcan(keyPair.privateKey, {
        audience: audienceDid,
        issuer: issuerDid,
        lifetimeInSeconds: 3600,
        potency: 'APPEND',
        resource: {
            "username": uname
        }
    });

    return {
        username:uname,
        keyPair,
        ucan
    }
}

execute().then(async result =>
{
    if (result.username) {
        await new Promise((resolve) => fs.writeFile(result.username + '.key', result.keyPair.privateKey, resolve));
        await new Promise((resolve) => fs.writeFile(result.username + '.public.key', result.keyPair.publicKey, resolve));
        await new Promise((resolve) => fs.writeFile(result.username + '.ucan', result.ucan, resolve));
        await new Promise((resolve) => fs.writeFile(result.username + '.txt', result.username, resolve));
    }
});