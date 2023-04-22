import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { Config } from "./config";

export type ProjectorData = {
  projector: {
    // path
    [key: string]: {
      // key -> value
      [key: string]: string;
    };
  };
};

const defaultData: ProjectorData = {
  projector: {},
};

export default class Projector {
  constructor(private config: Config, private data: ProjectorData) {}

  getValues(): { [key: string]: string } {
    const collectPaths = (
      curr: string,
      prev: string,
      paths: string[]
    ): string[] => {
      if (curr === prev) return paths.reverse();

      paths.push(curr);

      return collectPaths(path.dirname(curr), curr, paths);
    };

    const paths = collectPaths(this.config.pwd, "", []);

    const out = paths.reduce((acc, path) => {
      const value = this.data.projector[path];

      if (value) {
        Object.assign(acc, value);
      }

      return acc;
    }, {});

    return out;
  }

  getValue(key: string): string | undefined {
    const find = (curr: string, prev: string): string | undefined => {
      if (curr === prev) {
        return;
      }

      const value = this.data.projector[curr]?.[key];

      if (value) {
        return value;
      }

      return find(path.dirname(curr), curr);
    };

    return find(this.config.pwd, "");
  }

  setValue(key: string, value: string) {
    let dir = this.data.projector[this.config.pwd];

    if (!dir) {
      dir = this.data.projector[this.config.pwd] = {};
    }

    dir[key] = value;
  }

  removeValue(key: string) {
    const dir = this.data.projector[this.config.pwd];

    if (!dir) {
      return;
    }

    delete dir[key];
  }

  static async fromConfig(config: Config): Promise<Projector> {
    if (existsSync(config.config)) {
      let data: ProjectorData = defaultData;
      try {
        const file = await readFile(config.config, { encoding: "utf8" });

        data = JSON.parse(file);
      } catch (e) {
        data = defaultData;
      }
      return new Projector(config, data);
    }

    return new Projector(config, defaultData);
  }
}
