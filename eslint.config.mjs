import { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import baseConfig from "../../eslint.config.mjs";

const config: FlatConfig.ConfigArray = [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforcedBoundaries: [
            {
              sourceTag: "scope:api",
              onlyDependOnLibsWithTags: ["scope:api", "scope:shared"],
            },
            {
              sourceTag: "scope:web",
              onlyDependOnLibsWithTags: ["scope:web", "scope:shared"],
            },
            {
              sourceTag: "scope:shared",
              onlyDependOnLibsWithTags: ["scope:shared"],
            },
          ],
        },
      ],
    },
  },
];

export default config;
