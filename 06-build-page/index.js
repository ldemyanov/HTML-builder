const { createWriteStream, stat} = require("fs")
const fsp = require("fs/promises")
const path = require("path")

async function build() {
  try {
    const htmlTemplate = path.join(__dirname, "template.html")
    const folderComponents = path.join(__dirname, "components")
    const folderStyles = path.join(__dirname, "styles")
    const folderAssets = path.join(__dirname, "assets")
    const dist = path.join(__dirname, "project-dist")
    const distAssets = path.join(dist, "assets")
    stat(distAssets, async (error) => {
      if (!error) {
        await fsp.rm(distAssets, {recursive: true})
      }
    })
    await fsp.mkdir(dist, {recursive: true})
    await createHtmlBundle(htmlTemplate, folderComponents, dist)
    await createCssBundle(folderStyles, dist)
    await copyFolder(folderAssets, distAssets)
  } catch (err) {
    console.error(err)
  }
}

async function createHtmlBundle(htmlTemplate, folderComponents, dist) {

  async function getComponent(folder, name) {
    try {
      const fullName = path.join(folder, `${name}.html`)
      const fileComponent = await fsp.open(fullName)
      const component = await fileComponent.readFile("utf-8")
      return component
    } catch (error) {
      console.error(error)
    }
  }

  try {
    const fileHtmlTemplate = await fsp.open(htmlTemplate)
    let dataHtmlTemplate = await fileHtmlTemplate.readFile("utf-8")
    const regExp = /{{(.*)}}/gm
    let matches = dataHtmlTemplate.matchAll(regExp)
    for (const match of matches) {
      const nameComponent = match[1]
      const component = await getComponent(folderComponents, nameComponent)
      dataHtmlTemplate = dataHtmlTemplate.replace(match[0], component)
    }
    const distHTML = path.join(dist, "index.html")
    await fsp.writeFile(distHTML, dataHtmlTemplate)
  } catch (error) {
    console.log(error)
  }
}

async function createCssBundle(folder, dist) {
  const bundle = path.join(dist, "style.css")
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

async function copyFolder(folder, copy) {
  try {
    await fsp.mkdir(copy, {recursive: true})
    const dirents = await fsp.readdir(folder, {withFileTypes: true})
    for (let dirent of dirents) {
      const what = path.join(folder, dirent.name)
      const where = path.join(copy, dirent.name)
      if (dirent.isFile()) {   
        fsp.copyFile(what, where)
      }
      if (dirent.isDirectory()){
        await copyFolder(what, where)
      }
    }
  } catch (err) { 
    console.error(err) 
  }
}

build()
