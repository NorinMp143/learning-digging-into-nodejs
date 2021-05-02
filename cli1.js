#!/usr/bin/env node

"use strict";

// node cli.js --hello=world -c9
// console.log(process.argv); // ['/usr/...','/use/...','--hello=world -c9']
// console.log(process.argv.slice(2)); // ['--hello=world -c9']

var args = require("minimist")(process.argv.slice(2),{
  boolean: ['help'],
  string: ['file']
});
console.log(args); // { _:[], hello:'world', c:9}

// printHelp();

// **************
function printHelp(){
  console.log("cli usage:");
  console.log("  cli --help");
  console.log("");
  console.log(" --help          print this help");
  console.log("");
}