const fs = require("fs")
const path = require("path")

const newFile = path.join(__dirname, "new-file.txt")

fs.writeFile(
    newFile, 
    "", 
    input
)

const writeStream = fs.createWriteStream(newFile)

function input() {
    process.stdout.write("Введите текст: \n")
    process.stdin.on("data", chunk => {
        if (chunk.toString().trim() === "exit") {
            process.emit("SIGINT")
        } else {
            writeStream.write(chunk)
        }
    })
}

process.on("SIGINT", () => {
    writeStream.end()
    process.stdout.write("Ввод закончен. \n")
    process.exit()
})




