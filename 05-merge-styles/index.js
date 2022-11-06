const { createWriteStream } = require("fs")
const fsp = require("fs/promises")
const path = require("path")

const bundle = path.join(__dirname, "project-dist", "bundle.css")
const folder = path.join(__dirname, "styles")

async function createBundle(bundle, folder) {
    const writeStream = createWriteStream(bundle, "utf-8")
    try {
        const dirents = await fsp.readdir(folder, {withFileTypes: true})
        for (let dirent of dirents) {
            if (dirent.isFile() && path.parse(dirent.name).ext === ".css") {
                const fullName = path.join(folder, dirent.name) 
                const file = await fsp.open(fullName)
                const data = await file.readFile("utf-8")
                writeStream.write(`/* From file: ${fullName} */ \n`)
                writeStream.write(data)
                writeStream.write("\n")
            }
        }
    } catch (err) {
        console.log(err)
    } finally {
        writeStream.close()
    }
}

createBundle(bundle, folder)