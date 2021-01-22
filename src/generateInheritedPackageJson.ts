import fs from "fs";
import path from "path";
import { getPackageInfos } from "workspace-tools/lib/getPackageInfos";
import { PackageInfos } from "workspace-tools/lib/types/PackageInfo";
import { InheritsInfo } from "./InheritsInfo";
import parsePackageName from "parse-package-name";

export function generateInheritedPackageJson(cwd: string) {
  const allPackages = getPackageInfos(cwd);
  const modifiedPackages: string[] = [];
  const keys = ["devDependencies", "dependencies", "scripts"];

  for (const [pkg, info] of Object.entries(allPackages)) {
    // workspace-tools typings are not comprehensive about what is possible, so we force cast it
    if (info.inherits) {
      const inheritSpecifiers = (info.inherits as unknown) as InheritsInfo;
      let mergedInheritInfo = {};
      for (const specifier of inheritSpecifiers) {
        const file = resolveInRepo(pkg, specifier, allPackages);

        if (!file) {
          throw new Error(`${file} does not exist`);
        }

        const inheritInfo = JSON.parse(fs.readFileSync(file, "utf-8"));

        // Merge inherit infos for given package together before checking shouldUpdate. This will
        // allows inherit check behavior to be symmetric with update behavior, which updates packages
        // defined in multiple inherit files to their last occurrence.
        for (const key of keys) {
          mergedInheritInfo[key] = { ...mergedInheritInfo[key], ...inheritInfo[key] };
        }
      }

      for (const key of keys) {
        if (shouldUpdate(info[key], mergedInheritInfo[key])) {
          info[key] = { ...(info[key] as any), ...mergedInheritInfo[key] };
          modifiedPackages.push(pkg);
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
  if (!theirs) {
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
