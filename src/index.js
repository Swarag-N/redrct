const ejs = require("ejs");
const util = require("util");
const fs = require("fs");

const config = require("./redirect.config.json");
console.log(config);

//promisify
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function render() {
  try {
    //create output directory
    await mkdir("dist", { recursive: true });

    //render ejs template to html string
    //pass pageModel in to render content

    const indexHtml = await ejs
      .renderFile("./src/template/index.ejs", { data: config })
      .then((output) => output);

    //create file and write html
    await writeFile("dist/index.html", indexHtml, "utf8");

    config.urls.forEach(async(url)=>{
        let htmlData = await ejs
        .renderFile("./src/template/redirect.ejs", { data: url })
        .then((output) => output);
        //create file and write html
        await writeFile(`dist/${url.key}.html`, htmlData, "utf8");
    })


  } catch (error) {
    console.log(error);
  }
}
render();
