#!/usr/local/bin/node
import getConfig from "./config";
import getOpts from "./opts";
import Projector from "./projector";

async function main() {
  const opts = getOpts();
  const config = getConfig(opts);

  const proj = await Projector.fromConfig(config);

  if (config.operation === "Print") {
    if (!config.args.length) {
      console.log(JSON.stringify(proj.getValues()));
    } else {
      const value = proj.getValue(config.args[0]);
      if (value) {
        console.log(value);
      } else {
        console.log(
          `No value found for key ${config.args[0]} at ${config.pwd}`
        );
      }
    }
  }

  if (config.operation === "Add") {
    proj.setValue(config.args[0], config.args[1]);
    await proj.save();
  }

  if (config.operation === "Remove") {
    proj.removeValue(config.args[0]);
    await proj.save();
  }
}

main();
