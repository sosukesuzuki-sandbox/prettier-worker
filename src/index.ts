import { glob } from "./glob";
import { formatInParallel } from "./formatInParallel";

export function run(args: string[]) {
  const baseDir = args[0];
  const files = glob(baseDir ? baseDir : undefined);
  formatInParallel(files);
}
