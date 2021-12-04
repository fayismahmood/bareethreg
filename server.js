"use strict";

let _secret = "shhhhh";

const { v4: uuidv4 } = require("uuid");

const express = require("express");
var jwt = require("jsonwebtoken");

const { Server } = require("ws");
let app = express();
const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

const JSONdb = require("simple-json-db");
const db = new JSONdb("dbs/db.json");

//console.log(db.JSON());

app.use(express.static("static"));

let clients = [];
let _funcs = {
  _get: ({ ws, name, prog, socketId }) => {
    let clientIndx = clients.findIndex((e) => e.socketId == socketId);
    console.log(clientIndx);
    if (clientIndx < 0) {
      clients.push({ socketId: socketId, house: name, prog: prog, ws: ws });
    } else {
      clients[clientIndx].house = name;
      clients[clientIndx].prog = prog;
      clients[clientIndx].ws = ws;
    }
    console.log(clients, "Asdfasdf");

    let _;
    _ = db.get(prog);
    if (!_) {
      db.set(prog, []);
      _ = db.get(prog);
    }
    //console.log(_,"Asdfads");
    let __ = {
      yours: _.filter((e) => e.house == name),
      oth: _.filter((e) => e.house !== name).map((e) => ({ text: e.text })),
      house: name,
      prog,
      _func: "_get",
    };
    ws.send(JSON.stringify(__));
  },
  update: ({ ws, name, prog, text, progId }) => {
    if (!prog) return 0;
    var _;
    _ = db.get(prog);
    console.log(_, "Eraere", prog);

    let _index = _.findIndex((e) => e.progId == progId);
    //console.log(_index,"Er");
    if (_index < 0) {
      _.push({ progId: progId, house: name, text: text });
      //console.log(_,"f");
    } else {
      // console.log(_index);
      _[_index].text = text;
      // console.log(_,"w");
    }
    db.set(prog, _);
    console.log(_, "qqqqqqqqqqqqqqq");
    //ws.send(JSON.stringify({_func:"updated",status:"sucess"}))
    // wss.forEach(e => {
    //   e.send(JSON.stringify({_func:"updated",prog:prog,data:_}))
    // });
    clients
      .filter((e) => e.prog == prog && e.house !== name)
      .forEach((e) => {
        if (_) {
          e.ws.send(
            JSON.stringify({
              prog: prog,
              _func: "updated",
              oth: _.filter((_e) => _e.house !== e.house).map((e) => ({
                text: e.text,
              })),
            })
          );
        }
      });
  },
};

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// .use((req, res) => res.sendFile(INDEX, { root: __dirname }))

const wss = new Server({ server });

wss.on("connection", (ws, req) => {
  console.log("Client connected");
  let socketId = req.headers["sec-websocket-key"];

  ws.on("close", () => {
    let clientIndx = clients.findIndex((e) => e.socketId == socketId);
    //console.log(clientIndx,"Closed");
    if (clientIndx >= 0) {
      clients.splice(clientIndx, 1);
    }
    // console.log(clients,"Closed");
  });

  //console.log(socketId,"HEaddd");
  ws.onmessage = ({ data }) => {
    let _ = JSON.parse(data);
    var decoded;
    try {
      decoded = jwt.verify(_._id, "shhhhh");
    } catch (e) {
      return 0;
    }
    let _ret = _funcs[_._func]({ ws: ws, ..._, name: decoded.name, socketId });
    // console.log(_ret);
  };
});

setInterval(() => {}, 1000);
