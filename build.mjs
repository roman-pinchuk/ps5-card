import { cp, mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir("dist", { recursive: true });
const source = await readFile("src/ps5-card.js", "utf8");
const banner = `/* ps5-card v${JSON.parse(await readFile("package.json", "utf8")).version} */\n`;
await writeFile("dist/ps5-card.js", `${banner}${source}`);
await cp("README.md", "dist/README.md");
