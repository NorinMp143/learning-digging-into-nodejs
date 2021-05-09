#!/home/ubuntu/.nvm/versions/node/v14.16.1/bin/node

"use strict";

const util = require('util');
const path = require('path');
const http = require('http');

var sqlite3 = require('sqlite3');
var staticAlias = require('node-static-alias');

// ******************************

const DB_PATH  = path.join(__dirname, 'my.db');
const WEB_PATH = path.join(__dirname, "web");
const HTTP_PORT = 8039;

var delay = util.promisify(setTimeout);

// define some SQLite3 database helpers
//  (comment out if sqlite3 not working for you)
  var myDB = new sqlite3.Database(DB_PATH);
  var SQL3 = {
    run(...args){
      return new Promise(function c(resolve, reject){
        myDB.run(...args, function onResult(err){
          if(err){
            reject(err);
          }else{
            resolve(this);
          }
        })
      })
    },
    get: util.promisify(myDB.get.bind(myDB)),
    all: util.promisify(myDB.all.bind(myDB)),
    exec: util.promisify(myDB.exec.bind(myDB))
  };

  var fileServer = new staticAlias.Server(WEB_PATH,{
    cache: 100,
    serverInfo: "Node Practice: ex5",
    alias: [
      {
        match: /^\/(?:index\/?)?(?:[?#].*$)?$/,
        serve: 'index.html',
        force: true
      },
      {
        match: /^\/js\/.+$/,
        serve: '<% absPath %>',
        force: true
      },
      {
        match: /^\/(?:[\w\d]+)(?:[\/?#].*$)?$/,
        serve: function onMatch(params) {
          return `${params.basename}.html`;
        },
      },
      {
        match: /[^]/,
        serve: "404.html",
      },
    ]
  })

  var httpserv = http.createServer(handleRequest);

  main();

  // ****************************

  function main(){
    httpserv.listen(HTTP_PORT);
    console.log(`listening on http://localhost:${HTTP_PORT}...`);
  }

  async function handleRequest(req,res){
    if(req.url=='/get-records'){
      let records = await getAllRecords();
      res.writeHead(200,{
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      });
      res.end(JSON.stringify(records));
    }else{
      fileServer.serve(req,res);
    }
  }


async function getAllRecords(){
  let result = await SQL3.all(
    `
      SELECT
        Other.data as 'other',
        Something.data as 'something'
      FROM
        Something JOIN Other
        ON (Something.otherId = Other.id)
      ORDER BY
        Other.id DESC, Something.data ASC
    `
  );
  if(result && result.length > 0){
    return result;
  }
}


