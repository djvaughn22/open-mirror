// Validates the PRIVATE catalog (git-ignored). Usage: npm run catalog:check
import { readFileSync, existsSync } from "node:fs";
import { validateCatalog } from "../src/lib/commerce/catalog.ts";

const file = process.argv[2] ?? "private/commerce/catalog.json";
if (!existsSync(file)) { console.error(`No catalog at ${file}`); process.exit(2); }
const errs = validateCatalog(JSON.parse(readFileSync(file, "utf8")));
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
console.log(`${file}: OK`);
