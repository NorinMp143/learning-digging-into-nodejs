#!/usr/bin/env node

"use strict";

import util from 'util';
import path from 'path';
import fs from 'fs';

import getStdin from 'get-stdin';
import minimist from 'minimist';

var args = minimist(process.argv.slice(2),{
  boolean: ['help', 'in'],
  string: ['file']
});

// if(process.env.HELLO){
//   console.log(process.env.HELLO);
// }
var BASH_PATH = path.resolve(
  process.env.BASE_PATH || __dirname
)

if(args.help){
  printHelp();
}
else if(args.in || args._.includes('-')){
  getStdin().then(processFile).catch(error);
}
else if(args.file){
  fs.readFile(path.join(BASH_PATH,args.file), (err, contents)=>{
    if(err){
      error(err.toString());
    }else{
      processFile(contents.toString());
    }
  })
}
else{
  error('Incorrect usage',true)
}

// **************

function processFile (contents){
  contents = contents.toUpperCase();
  console.log(contents);
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