import globby from "globby";

export function glob(baseDir: string = "."): string[] {
  return globby.sync([`${baseDir}/**/*`], {
    expandDirectories: true,
  });
}
