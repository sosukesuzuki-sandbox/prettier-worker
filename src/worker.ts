import { workerData, parentPort, threadId } from "worker_threads";
import fs from "fs";
import { promisify } from "util";
import { format, getFileInfo } from "prettier";
import chalk from "chalk";

const { files } = workerData as { files: string[] };

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

Promise.all(
  files.map(async (file) => {
    const { inferredParser } = await getFileInfo(file);
    if (!inferredParser) return;
    const fileData = await readFile(file, "utf8");
    const result = format(fileData, { parser: inferredParser as any });
    await writeFile(file, result);
    if (parentPort) {
      parentPort.postMessage({ file });
    }
  })
)
  .then(() => {
    console.log(chalk.green.inverse("Finish thread ", threadId));
  })
  .catch(() => {
    process.exitCode = 1;
  });
