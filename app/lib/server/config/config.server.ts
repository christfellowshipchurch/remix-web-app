/**
 * @file src/config.ts
 *
 * This file is responsible for reading the configuration file and parsing it into a usable object.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "url";
import path from "path";
import YAML from "yaml";

// Get the current file path and directory (equivalent to __filename and __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the config.yml file
const configPath = path.resolve(__dirname, "../config/config.yml");

// Read and parse the YAML config file
const Config = YAML.parse(readFileSync(configPath, "utf8"));

export default Config;
