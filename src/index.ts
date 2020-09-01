import yargsParser from "yargs-parser";
import { generateInheritedPackageJson } from "./generateInheritedPackageJson";
import fs from "fs";

const args = yargsParser(process.argv.slice(2));

const command = args._[0];

const updatedInfo = generateInheritedPackageJson(process.cwd());

switch (command) {
  case "update":
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
    break;

  case "check":
    if (updatedInfo.modifiedPackages.length > 0) {
      const recoveryCommand = args.recovery || "package-inherit update";
      console.error(
        `
The inheritance of package.json is in an inconsistent state. These packages
are inconsistent:

${updatedInfo.modifiedPackages.join(", ")}

Please run the following command:
> ${recoveryCommand}
`
      );

      process.exit(1);
    }
    break;

  default:
    console.log(`
Usage: package-inherit [command] [--recovery]

Commands:

  update      updates the package.json for all packages in a monorepo to match inheritance
  check       checks all the package.json inheritance are consistent

Options:

  --recovery  custom recovery command to show developers when the check has failed
`);
    break;
}
