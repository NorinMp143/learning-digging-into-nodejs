#!/usr/bin/env node

"use strict";

import util from 'util';
import path from 'path';
import fs from 'fs';

import minimist from 'minimist';
import { Transform } from 'stream';

const __dirname = path.resolve();

var args = minimist(process.argv.slice(2),{
  boolean: ['help', 'in', 'out'],
  string: ['file']
});

var BASH_PATH = path.resolve( process.env.BASE_PATH || __dirname)

var OUTFILE = path.join(BASH_PATH, 'out.txt');

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
  let targetStream;
  if(args.out){
    targetStream = process.stdout;
  }
  else{
     targetStream = fs.createWriteStream(OUTFILE);
  }
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