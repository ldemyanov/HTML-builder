const fs = require("fs")
const path = require("path")


const folder = path.join(__dirname, "secret-folder")

async function getInfo(folder) {

  function viewInfo(name, ext, size) {
    process.stdout.write(`${name} - ${ext.slice(1)} - ${size / 1000}kb\n`)
  }

  try {

    const dirents = await fs.promises.readdir(folder, {withFileTypes: true});
    const files = dirents.filter(dirent => dirent.isFile())

    for (const file of files) {
      
      const fullName = path.join(folder, file.name)
      
      fs.stat(fullName, (err, stats) => {
        viewInfo(
          path.parse(fullName).name,
          path.parse(fullName).ext,
          stats.size
        )
      })

    }

  } catch (err) {
    console.error(err);
  }
}

getInfo(folder)


