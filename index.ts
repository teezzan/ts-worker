require('dotenv').config()
const { getMetadata } = require("./src/controller/ffprobe");
// import { fetchMetadata } from "./src/controller/redis";

console.log("hello world!");

getMetadata("https://vibesmediastorage.s3.amazonaws.com/uploads/61d05316d5d1d2000f61f2d0.mp3").then(metadata => {
    console.log(metadata);
}).catch(err => {
    console.log(err);
})

