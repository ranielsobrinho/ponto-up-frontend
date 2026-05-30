import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

function fixRechartsEsmCompat(): Plugin {
	return {
		name: "fix-recharts-esm-compat",
		transform(code, id) {
			if (
				id.includes("node_modules/recharts") ||
				id.includes("node_modules/es-toolkit")
			) {
				return code.replace(
					/import\s+(\w+)\s+from\s+['"]es-toolkit\/compat\/(\w+)['"]/g,
					"import { $1 } from 'es-toolkit/compat'",
				);
			}
		},
		enforce: "pre",
	};
}

export default defineConfig({
	server: {
		port: 3001,
	},
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		tailwindcss(),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
		fixRechartsEsmCompat(),
	],
});
