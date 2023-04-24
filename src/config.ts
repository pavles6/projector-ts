import path from "path";
import { Opts } from "./opts";

export type Operation = "Print" | "Add" | "Remove";

export type Config = {
  args: string[];
  operation: Operation;
  config: string;
  pwd: string;
};

function getPwd(opts: Opts): string {
  if (opts.pwd) {
    return opts.pwd;
  }

  return process.cwd();
}

function getConfigPath(opts: Opts): string {
  if (opts.config) {
    return opts.config;
  }

  const home = process.env["HOME"];
  const location = process.env["XDG_CONFIG_HOME"] || home;

  if (!location) {
    throw new Error("Unable to find config location");
  }

  if (location === home) {
    return path.join(location, ".projector.json");
  }

  return path.join(location, "projector", "projector.json");
}

function getOperation(opts: Opts): Operation {
  if (!opts.args || !opts.args.length) {
    return "Print";
  }

  if (opts.args[0] === "add") {
    return "Add";
  }

  if (opts.args[0] === "rm") {
    return "Remove";
  }

  return "Print";
}

function getArgs(opts: Opts): string[] {
  if (!opts.args || !opts.args.length) {
    return [];
  }

  const operation = getOperation(opts);

  if (operation === "Print") {
    if (opts.args.length > 1) {
      throw new Error(`Expected 0 or 1 arguments, but got ${opts.args.length}`);
    }

    return opts.args;
  }

  if (operation === "Add") {
    if (opts.args.length !== 3) {
      throw new Error(`Expected 2 arguments, but got ${opts.args.length}`);
    }

    return opts.args.slice(1);
  }

  if (opts.args.length !== 2) {
    throw new Error(`Expected 1 argument, but got ${opts.args.length}`);
  }

  return opts.args.slice(1);
}

export default function getConfig(opts: Opts): Config {
  return {
    args: getArgs(opts),
    operation: getOperation(opts),
    config: getConfigPath(opts),
    pwd: getPwd(opts),
  };
}
