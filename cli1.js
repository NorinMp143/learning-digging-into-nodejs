#!/usr/bin/env node

"use strict";

// node cli.js --hello=world -c9
// console.log(process.argv); // ['/usr/...','/use/...','--hello=world -c9']
// console.log(process.argv.slice(2)); // ['--hello=world -c9']

const path = require('path');
const fs = require('fs');

var args = require("minimist")(process.argv.slice(2),{
  boolean: ['help'],
  string: ['file']
});
// console.log(args); // { _:[], hello:'world', c:9}

if(args.help){
  printHelp();
}
else if(args.file){
  const filepath = path.resolve(args.file);
  processFile(filepath);
  // console.log(filepath);
}
else{
  error('Incorrect usage',true)
}

// **************

function processFile (filepath){
  fs.readFile(filepath, (err, contents)=>{
    if(err){
      error(err.toString());
    }else{
      process.stdout.write(contents);
    }
  })
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
  console.log(" --file          process the file")
  console.log("");
}