import { cp, mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir("dist", { recursive: true });
const source = await readFile("src/ps5-card.js", "utf8");
const logo = (await readFile("assets/playstation-logo.png")).toString("base64");
const banner = `/* ps5-card v${JSON.parse(await readFile("package.json", "utf8")).version} */\n`;
await writeFile("dist/ps5-card.js", `${banner}${source.replace("__PLAYSTATION_LOGO_DATA__", `data:image/png;base64,${logo}`)}`);
await cp("README.md", "dist/README.md");
