import { createClient } from 'redis';
import { Payload, Response } from '../types'


const client = createClient({
    url: process.env.REDIS_QUEUE_URI,
    database: 0,
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect().then(() => {
    console.log("Connected To Redis Successfully! ");

}).catch((err) => {
    console.error(err)
})



let saveMetadata = async (uuid: string, payload: Response): Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        client.set(uuid, JSON.stringify(payload), {
            EX: 60 * 60 * 24,
        }).then(() => {
            resolve(true)
        }).catch((err) => {
            console.log(err);
            reject(false)
        })
    })
}

let fetchMetadata = async (uuid: string): Promise<Response | string> => {

    return new Promise<Response | string>(async (resolve, reject) => {
        client.get(uuid).then((metadata) => {
            resolve(metadata)

        }).catch((err) => {
            console.log(err);
            reject("false")
        })
    })
}

export {
    client, saveMetadata, fetchMetadata
}