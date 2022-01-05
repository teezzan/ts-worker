require('dotenv').config()
const { getMetadata } = require("./src/controller/ffprobe");
import { fetchMetadata, saveMetadata } from "./src/controller/redis";
import { Queue, Worker } from 'bullmq'
import { Response } from "./src/types";


const metaWorker = new Worker(process.env.QUEUE_NAME, async (job) => {
    console.log(job.data);
    getMetadata(job.data.url).then(metadata => {
        let payload: Response = {
            ...job.data,
            result: metadata
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
    console.log(`${job.id}:${job.data.uuid} has completed!`);

    setTimeout(() => {

        fetchMetadata(job.data.uuid).then(data => {
            console.log(data);
        }).catch(err => {
            console.log('Not found!');
        })
    }, 5000);
});

metaWorker.on('failed', (job, err) => {
    console.log(`${job.id} has failed with ${err.message}`);
});



// fetchMetadata("Cd7qTmo-QAUIvt6CDZgST").then(data => {
//     console.log(data.metadata);
// }).catch(err => {
//     console.log('Not found!');

// })


