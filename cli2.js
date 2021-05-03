#!/usr/bin/env node

"use strict";

import util from 'util';
import path from 'path';
import fs from 'fs';

import minimist from 'minimist';
import { Transform } from 'stream';

const __dirname = path.resolve();

var args = minimist(process.argv.slice(2),{
  boolean: ['help', 'in'],
  string: ['file']
});

var BASH_PATH = path.resolve( process.env.BASE_PATH || __dirname)

if(args.help){
  printHelp();
}
else if(args.in || args._.includes('-')){
  processFile(process.stdin);
}
else if(args.file){
  const stream = fs.createReadStream(path.join(BASH_PATH,args.file));
  processFile(stream);
}
else{
  error('Incorrect usage',true)
}

// **************

function processFile (inStream){
  let outStream = inStream;
  const upperStream = new Transform({
    transform(chunk, enc, cb){
      this.push(chunk.toString().toUpperCase());
      cb();
    }
  });
  outStream = outStream.pipe(upperStream);
  const targetStream = process.stdout;
  outStream.pipe(targetStream);
}

function error(msg, includeHelp= false){
  console.log(msg);
  if(includeHelp){
    console.log('');
    printHelp();
  }
}

function printHelp(){
  console.log("cli usage:");
  console.log("  cli1.js --file={FILENAME}");
  console.log("");
  console.log(" --help          print this help");
  console.log(" --file          process the file");
  console.log(" --in, -         process stdin");
  console.log("");
}