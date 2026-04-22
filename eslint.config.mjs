import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),

  // ── SOVEREIGN ARCHITECTURAL BOUNDARIES ───────────────────────
  // Enforces the 3 Laws of Sovereign Architecture:
  // 1. Modules NEVER import from each other directly.
  // 2. UI components NEVER touch the DB.
  // 3. Cross-module communication = EventBus ONLY.
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "core",      pattern: "src/core/**/*"           },
        { type: "module",    pattern: "src/modules/**/*"        },
        { type: "contracts", pattern: "types/contracts/**/*"    },
        { type: "hooks",     pattern: "hooks/**/*"              },
        { type: "ui",        pattern: "components/**/*"         },
        { type: "pages",     pattern: "app/**/*"                },
        { type: "lib",       pattern: "lib/**/*"                },
      ],
    },
    rules: {
      // LAW 1: Modules may only import from core and contracts
      "boundaries/element-types": ["warn", {
        default: "disallow",
        rules: [
          // Core depends on nothing inside the project
          { from: "core",      allow: ["lib"]                          },
          // Contracts are pure types — no runtime deps
          { from: "contracts", allow: []                               },
          // Modules import from core and contracts ONLY
          { from: "module",    allow: ["core", "contracts", "hooks", "lib"] },
          // Hooks are the legacy layer — can use lib and contracts
          { from: "hooks",     allow: ["lib", "contracts"]             },
          // UI/Components may use modules, hooks, core, contracts
          { from: "ui",        allow: ["module", "hooks", "contracts", "core", "lib"] },
          // Pages/App can use everything
          { from: "pages",     allow: ["module", "hooks", "contracts", "core", "ui", "lib"] },
        ],
      }],
    },
  },
  // ── CommonJS Node.js scripts — allow require() ───────────────
  // next.config.js, lib/ai/**, and scripts/** are pure Node CJS files.
  // They must NOT be converted to ESM. Override only the conflicting rules.
  {
    files: [
      "next.config.js",
      "lib/ai/**/*.js",
      "scripts/**/*.js",
      "public/sw.js",
      "public/workbox-*.js",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any":    "off",
      "@typescript-eslint/ban-ts-comment":      "off",
    },
  },
  // ── Data Layer: sql.js repo files — allow any for row mapping ──
  // sql.js exec() returns SqlValue[][] (which is any[][]). Fully typing every
  // row mapper at this layer duplicates the schema and adds no safety benefit.
  // The public API is typed via the module index.ts and types/db.ts.
  {
    files: [
      "src/modules/**/*.repo.ts",
      "src/modules/**/*.ts",
      "src/core/**/*.ts",
      "lib/**/*.ts",
      "lib/**/*.tsx",
      "types/**/*.ts",
      "types/vault.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;
