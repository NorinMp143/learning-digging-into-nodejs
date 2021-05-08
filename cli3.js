#!/usr/bin/env node

"use strict";

const util = require('util');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

const minimist = require('minimist');
const { Transform } = require('stream');
const CAF = require('caf');

var args = minimist(process.argv.slice(2),{
  boolean: ['help', 'in', 'out', 'compress', 'uncompress'],
  string: ['file']
});

processFile = CAF(processFile);

function streamComplete(stream){
  return new Promise (function c(res){
    stream.on("end",res);
  })
} 

var BASH_PATH = path.resolve( process.env.BASE_PATH || __dirname)

var OUTFILE = path.join(BASH_PATH, 'out.txt');

if(args.help){
  printHelp();
}
else if(args.in || args._.includes('-')){
  const timeoutToken = CAF.timeout(23, "Timeout!");
  processFile(timeoutToken,process.stdin)
  .catch(error);
}
else if(args.file){
  const stream = fs.createReadStream(path.join(BASH_PATH,args.file));
  const timeoutToken = CAF.timeout(23, "Timeout!");
  processFile(timeoutToken,stream)
  .then((data)=>{
    console.log('Complete!');
  })
  .catch(error);
}
else{
  error('Incorrect usage',true)
}

// **************

function *processFile (signal,inStream){
  let outStream = inStream;

  if(args.uncompress){
    const gunzipStream = zlib.createGunzip();
    outStream = outStream.pipe(gunzipStream);
  }

  const upperStream = new Transform({
    transform(chunk, enc, cb){
      this.push(chunk.toString().toUpperCase());
      cb();
    }
  });
  outStream = outStream.pipe(upperStream);
  if(args.compress){
    const gzipStream = zlib.createGzip();
    outStream = outStream.pipe(gzipStream);
    OUTFILE = `${OUTFILE}.gz`;
  }
  let targetStream;
  if(args.out){
    targetStream = process.stdout;
  }
  else{
     targetStream = fs.createWriteStream(OUTFILE);
  }
  outStream.pipe(targetStream);
  signal.pr.catch(function f(){
    outStream.unpipe(targetStream);
    outStream.destroy();
  })
  yield streamComplete(outStream)
}

function error(msg, includeHelp= false){
  console.log(msg);
  if(includeHelp){
    console.log('');
    printHelp();
  }
}

function printHelp(){
  console.log("cli3 usage:");
  console.log("  cli3.js --file={FILENAME}");
  console.log("");
  console.log(" --help          print this help");
  console.log(" --file          process the file");
  console.log(" --in, -         process stdin");
  console.log(" --out           print the output");
  console.log(" --compress      gzip the output");
  console.log(" --uncompress    un-zip the input");
  console.log("");
}