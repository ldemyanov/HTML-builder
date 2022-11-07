const fs = require('fs');
const fsp = require("fs/promises")
const path = require("path")

const copyFolder = path.join(__dirname, "files-copy")
const folder = path.join(__dirname, "files")

async function copyDir(folder, copyFolder) {
  
  try {
    await fsp.mkdir(copyFolder, {recursive: true})
    const dirents = await fsp.readdir(folder, {withFileTypes: true})
    
    for (let dirent of dirents) {
      
      const what = path.join(folder, dirent.name)
      const where = path.join(copyFolder, dirent.name)
      
      if (dirent.isFile()) {   
        fsp.copyFile(what, where)
      }

      if (dirent.isDirectory()){
        await copyDir(what, where)
      }

    }

  } catch (err) { 
    console.error(err) 
  }

}

fs.stat(copyFolder, async (error) => {
  if (!error) {
    await fsp.rm(copyFolder, {recursive: true})
  }
})

copyDir(folder, copyFolder)


