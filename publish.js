let { Queue, Worker } = require('bullmq');
const { nanoid } = require('nanoid');
require('dotenv').config()


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const myQueue = new Queue(process.env.QUEUE_NAME, {
    connection: {
        host: process.env.REDIS_ADDRESS.split(":")[0],
        port: process.env.REDIS_ADDRESS.split(":")[1],
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,

    }
});

async function addJobs() {
    setInterval(async () => {

        await myQueue.add('meta', {
            url: `http://api.alquran.cloud/v1/ayah/${2}:${getRandomArbitrary(1, 283)}`,
            type: "meta",
            uuid: nanoid()
        })
    }, 8000);
}

addJobs().then((x) => {
    console.log("done");
}).catch((err) => {
    console.log(err);
})













// const metaQueue = new Queue(process.env.QUEUE_NAME, {
//     connection: {
//         host: process.env.REDIS_ADDRESS.split(":")[0],
//         port: process.env.REDIS_ADDRESS.split(":")[1],
//         username: process.env.REDIS_USERNAME,
//         password: process.env.REDIS_PASSWORD,

//     }
// });