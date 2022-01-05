require('dotenv').config()
const { getMetadata } = require("./src/controller/ffprobe");
import { nanoid } from "nanoid";
import { fetchMetadata, saveMetadata } from "./src/controller/redis";
import { Queue, Worker } from 'bullmq'


// import IORedis from 'ioredis';

// const connection = new IORedis(`redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ADDRESS}/`);

// const metaWorker = new Worker(process.env.QUEUE_NAME, async (job) => {
//     console.log(job.data);

// }, { connection });


const metaWorker = new Worker(process.env.QUEUE_NAME, async (job) => {
    console.log(job.data);
    getMetadata(job.data.url).then(metadata => {
        let payload = {
            ...job.data,
            metadata
        }
        saveMetadata(payload.uuid, payload)
    }).catch(err => {
        console.log(err);
    })

}, {
    connection: {
        host: process.env.REDIS_ADDRESS.split(":")[0],
        port: process.env.REDIS_ADDRESS.split(":")[1],
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,

    }
});

metaWorker.on('completed', (job) => {
    console.log(`${job.id} has completed!`);
});

metaWorker.on('failed', (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});

// let payload: any = {
//     url: "https://vibesmediastorage.s3.amazonaws.com/uploads/61d05316d5d1d2000f61f2d0.mp3",
//     type: "meta",
//     uuid: nanoid()
// }






