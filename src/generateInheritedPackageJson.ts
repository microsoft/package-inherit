import fs from "fs";
import path from "path";
import { getPackageInfos, PackageInfos } from "workspace-tools";
import { InheritsInfo } from "./InheritsInfo";
import parsePackageName from "parse-package-name";

export function generateInheritedPackageJson(cwd: string) {
  const allPackages = getPackageInfos(cwd);
  const modifiedPackages: string[] = [];

  for (const [pkg, info] of Object.entries(allPackages)) {
    // workspace-tools typings are not comprehensive about what is possible, so we force cast it
    if (info.inherits) {
      const inheritInfo = (info.inherits as unknown) as InheritsInfo;
      for (const specifier of inheritInfo) {
        const file = resolveInRepo(pkg, specifier, allPackages);

        if (!file) {
          throw new Error(`${file} does not exist`);
        }

        const inheritInfo = JSON.parse(fs.readFileSync(file, "utf-8"));

        const keys = ["devDependencies", "dependencies", "scripts"];

        for (const key of keys) {
          if (shouldUpdate(info[key], inheritInfo[key])) {
            info[key] = { ...(info[key] as any), ...inheritInfo[key] };
            modifiedPackages.push(pkg);
          }
        }
      }
    }
  }

  return { allPackages, modifiedPackages };
}

function resolveInRepo(
  pkg: string,
  specifier: string,
  allPackages: PackageInfos
) {
  const parsedInfo = parsePackageName(specifier);

  if (parsedInfo.name === ".") {
    parsedInfo.name = pkg;
  }

  const info = allPackages[parsedInfo.name];

  if (info) {
    return path.join(path.dirname(info.packageJsonPath), parsedInfo.path);
  }
}

function shouldUpdate(mine: any, theirs: any) {
  if (!mine || !theirs) {
    return false;
  }

  let result = false;

  for (const [key, value] of Object.entries(theirs)) {
    if (mine[key] !== value) {
      result = true;
    }
  }

  return result;
}
