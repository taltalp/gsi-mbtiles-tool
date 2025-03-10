#!/usr/bin/env node

import { Command } from "commander";
import tilesets from "../etc/gsi_tilesets";
import processor from "../processor";
const program = new Command();

interface CliOptions {
  output: string;
  maxzoom?: string;
  minzoom?: string;
}

async function run(inputName: string, options: CliOptions) {
  const name = inputName in tilesets && inputName;
  if (!name) {
    throw new Error(
      `'tileset-id' must be one of: ${Object.keys(tilesets).join(", ")}`
    );
  }
  const tilesetMeta = { ...tilesets[name] };
  console.time(name);
  console.timeLog(name, `Starting up ${tilesetMeta.name}...`);

  if (options.maxzoom) {
    tilesetMeta.maxZoom = parseInt(options.maxzoom, 10);
  }
  if (options.minzoom) {
    tilesetMeta.minZoom = parseInt(options.minzoom, 10);
  }

  console.timeLog(
    name,
    `出力は z${tilesetMeta.minZoom}-${tilesetMeta.maxZoom}`
  );
  await processor(name, tilesetMeta, options.output);

  console.timeEnd(name);
}

async function main() {
  program
    .argument("<tileset-id>", "GSIのタイルセットID")
    .option(
      "-o, --output <output>",
      "出力、または更新するファイル",
      "./out.mbtiles"
    )
    .option("--maxzoom <zoom>", "出力の最高ズームを指定する")
    .option("--minzoom <zoom>", "出力の最低ズームを指定する")
    .showHelpAfterError()
    .action(run);
  await program.parseAsync(process.argv);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error("An error occurred:", e);
    process.exit(1);
  });
