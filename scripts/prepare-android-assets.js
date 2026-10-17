const { copyFile, mkdir } = require("node:fs/promises");
const { dirname, resolve } = require("node:path");

const projectRoot = resolve(__dirname, "..");
const webDirectory = resolve(projectRoot, "mobile/www");

(async () => {
  await mkdir(webDirectory, { recursive: true });

  for (const file of ["index.html", "styles.css", "app.js"]) {
    await copyFile(resolve(projectRoot, file), resolve(webDirectory, file));
  }

  console.log(`Prepared Android web assets in ${webDirectory}`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});