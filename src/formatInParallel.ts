import { Worker } from "worker_threads";
import chalk from "chalk";

const workerPath = require.resolve("./worker");

export function formatInParallel(files: string[]): Promise<void>[] {
  const promises: Promise<void>[] = [];

  for (let i = 0; i < files.length; i += 128) {
    const workerPromise: Promise<void> = new Promise((resolve, reject) => {
      const workerData = {
        files: files.slice(i, i + 128),
      };
      const worker = new Worker(workerPath, { workerData });
      worker.on("message", ({ file }) => {
        console.log(chalk.green.inverse("Done"), chalk.green(file));
      });
      worker.on("error", reject);
      worker.on("exit", (exitCode) => {
        if (exitCode) {
          reject(new Error(`Worker stopped with exit code ${exitCode}`));
        } else {
          resolve();
        }
      });
    });
    promises.push(workerPromise);
  }

  return promises;
}
