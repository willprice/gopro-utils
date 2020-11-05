#!/usr/bin/env node

const cliparse = require('cliparse')
const parsers = cliparse.parsers;
const gpmfExtract = require('gpmf-extract')
const goproTelemetry = require('gopro-telemetry')
const fs = require('fs').promises
const { createReadStream } = require('fs')
const package = require('./package.json')


/**
 * @param {*} path The path to video file
 * @param {*} chunkSize As of August 9, 2020, there is a problem with mp4box.js, 
 * so please specify a sufficiently large chunksize for the file size.
 * @return {Function}
 */
function bufferAppender(path, chunkSize) {
  return function(mp4boxFile) {
    var stream = createReadStream(path, {'highWaterMark': chunkSize})
    var bytesRead = 0
    stream.on('end', () => {
      mp4boxFile.flush()
    })
    stream.on('data', (chunk) => {
      var arrayBuffer = new Uint8Array(chunk).buffer
      arrayBuffer.fileStart = bytesRead
      var next = mp4boxFile.appendBuffer(arrayBuffer)
      bytesRead += chunk.length
    })
    stream.resume()
  }
}

async function extract(params) {
  [videoPath, jsonPath] = params.args;
  const jsonAlreadyExists = await fs.access(jsonPath).then(() => true).catch((err) => false)
  const videoExists = await fs.access(videoPath).then(() => true).catch((err) => false)

  if (jsonAlreadyExists && !params.options.force) {
    console.log(`${jsonPath} already exists and --force was not specified, quitting.`)
    process.exit(1)
  }
  if (!videoExists) {
    console.log(`${videoPath} does not exist, please check the path.`)
    process.exit(2)
  }

  const result = await gpmfExtract(bufferAppender(videoPath, 10 * 1024 * 10240))
  const telemetry = await goproTelemetry(result)
  await fs.writeFile(jsonPath, JSON.stringify(telemetry))
}

const cliParser = cliparse.cli({
  name: 'gpmd-extract',
  description: 'Extract embedded metadata from GoPro videos',
  version: package.version,
  args: [
    cliparse.argument("video", { description: "Path to video file from which to extract metdata" }) ,
    cliparse.argument("json", { description: "Path to JSON file to store metadata" }) ,
  ],
  options: [
    cliparse.flag("force", { description: "Overwrite existing JSON file" })
  ]
}, extract)

cliparse.parse(cliParser)
