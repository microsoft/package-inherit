
import fs from 'fs';
import { generateInheritedPackageJson } from "./generateInheritedPackageJson";

export function updateCommand(cwd: string) {
  const updatedInfo = generateInheritedPackageJson(cwd);
  if (updatedInfo.modifiedPackages.length > 0) {
    for (const [pkg, info] of Object.entries(updatedInfo.allPackages)) {
      const { packageJsonPath, ...output } = info;
      fs.writeFileSync(
        info.packageJsonPath,
        JSON.stringify(output, null, 2) + "\n"
      );
    }
    console.log(
      `Updated these packages: ${updatedInfo.modifiedPackages.join(", ")}`
    );
  } else {
    console.log("Nothing needs to be updated.");
  }
}