
import fs from 'fs';
import os from 'os';
import detectNewline from 'detect-newline';
import { generateInheritedPackageJson } from "./generateInheritedPackageJson";

export function updateCommand(cwd: string) {
  const updatedInfo = generateInheritedPackageJson(cwd);
  if (updatedInfo.modifiedPackages.length > 0) {
    for (const pkg of updatedInfo.modifiedPackages) {
      const info = updatedInfo.allPackages[pkg];
      const { packageJsonPath, ...output } = info;

      const newLine = detectNewline(fs.readFileSync(info.packageJsonPath, 'utf-8')) || os.EOL;

      fs.writeFileSync(
        info.packageJsonPath,
        JSON.stringify(output, null, 2).replace(/\n/g, newLine) + newLine
      );
    }
    console.log(
      `Updated these packages: ${updatedInfo.modifiedPackages.join(", ")}`
    );
  } else {
    console.log("Nothing needs to be updated.");
  }
}