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
            url: `https://verse.mp3quran.net/arabic/sahl_yassin/64/00${2}${parseInt(getRandomArbitrary(100, 283))}.mp3`,
            type: "meta",
            uuid: nanoid()
        })
    }, 5000);
}

addJobs().then((x) => {
    console.log("done");
}).catch((err) => {
    console.log(err);
})