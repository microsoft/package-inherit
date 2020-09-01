import yargsParser from "yargs-parser";
import { updateCommand } from './updateCommand';
import { checkCommand } from "./checkCommand";

const args = yargsParser(process.argv.slice(2));

const command = args._[0];

switch (command) {
  case "update":
    updateCommand(process.cwd())
    break;

  case "check":
    checkCommand(process.cwd(), args);
    break;

  default:
    console.log(`
Usage: package-inherit [command] [--recovery]

This utility will update package.json in a monorepo to inherit from another package.json template.
Currently, only "scripts", "devDependencies", and "dependencies" are merged into the package.json

Commands:

  update      updates the package.json for all packages in a monorepo to match inheritance
  check       checks all the package.json inheritance are consistent

Options:

  --recovery  custom recovery command to show developers when the check has failed
`);
    break;
}
