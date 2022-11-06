const fs = require('fs');
const path = require('path')

let readSteam = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8")
readSteam.on("data", (chunk) => console.log(chunk))
