import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

export default [
	{
		input: 'src/ipsme_msgenv.ts',
		output: [
			{ file: 'dist/ipsme_msgenv.cjs.js', format: 'cjs' },
			{ file: 'dist/ipsme_msgenv.es.mjs', format: 'es' },
		],
		plugins: [
			resolve({ preferBuiltins: true }),
			commonjs(),
			json(),
			typescript({ tsconfig: './tsconfig.json' })
		],
		onwarn(warning, warn) {
			if (warning.code === 'THIS_IS_UNDEFINED') return;
			if (warning.code === 'CIRCULAR_DEPENDENCY') return;
			warn(warning);
		}
	}
];
