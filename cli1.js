#!/usr/bin/env node

"use strict";

// node cli.js --hello=world -c9
// console.log(process.argv); // ['/usr/...','/use/...','--hello=world -c9']
// console.log(process.argv.slice(2)); // ['--hello=world -c9']

var args = require("minimist")(process.argv.slice(2),{
  boolean: ['help'],
  string: ['file']
});
// console.log(args); // { _:[], hello:'world', c:9}

if(args.help){
  printHelp();
}
else if(args.file){
  console.log(args.file);
}
else{
  error('Incorrect usage',true)
}

// **************

function error(msg, includeHelp= false){
  console.log(msg);
  if(includeHelp){
    console.log('');
    printHelp();
  }
}

function printHelp(){
  console.log("cli usage:");
  console.log("  cli --help");
  console.log("");
  console.log(" --help          print this help");
  console.log("");
}