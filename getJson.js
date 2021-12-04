let fs=require("fs")

let _=fs.readFileSync("dbs/db.json")
console.log(_.toString());