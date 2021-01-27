import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

let service: esbuild.Service;

export interface BundledResut {
  transformed: string;
  builded: string;
}

const bundle = async (rawCode: string): Promise<BundledResut> => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.34/esbuild.wasm',
    });
  }

  const transpiled = await service.transform(rawCode, {
    loader: 'jsx',
    target: 'es2015',
  });
  const builded = await service.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode, true)],
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
  });

  return {
    transformed: transpiled.code,
    builded: builded.outputFiles[0].text,
  };
};

export default bundle;
