var jwt = require("jsonwebtoken");
let names = ["ks", "kqs", "kss", "kll", "kun"];

names.forEach((e) => {
  var token = jwt.sign({ name: e }, "shhhhh");
  console.log(`${e} \n----------- \nhttps://bareethreg.glitch.me/?hash=${token} \n`);
});
