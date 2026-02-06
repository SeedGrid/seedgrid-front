#!/usr/bin/env node
import { Command } from "commander";
import { cmdInit } from "./commands/init.js";
import { cmdAdd } from "./commands/add.js";
import { cmdUpgrade } from "./commands/upgrade.js";

const program = new Command();

program
  .name("seedgrid")
  .description("SeedGrid FE CLI")
  .version("0.2.0");

program
  .command("init")
  .argument("[appName]", "App folder name")
  .description("Create a SeedGrid FE app")
  .action(async (appName) => cmdInit({ appName }));

program
  .command("add")
  .argument("<moduleName>", "Module package name, e.g. @seedgrid/fe-security")
  .description("Add a SeedGrid FE module into the current app")
  .action(async (moduleName) => cmdAdd({ moduleName }));

program
  .command("upgrade")
  .description("Upgrade SeedGrid packages inside the app")
  .option("--source <path>", "SeedGrid source path (monorepo root or packages dir)")
  .action(async (opts) => cmdUpgrade({ source: opts?.source }));

program.parseAsync(process.argv);
