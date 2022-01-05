import Ffmpeg, { ffprobe } from 'fluent-ffmpeg'

const getMetadata = async (url: string): Promise<Ffmpeg.FfprobeData> => {
    return new Promise<any>(async (resolve, reject) => {
        ffprobe(url, (err, metadata) => {
            if (err)
                reject(err)
            resolve(metadata)
        })
    })
}

export = { getMetadata }