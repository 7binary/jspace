import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

let service: esbuild.Service;

export interface BundledResut {
  transpiled: string;
  code: string;
  error: string | null;
}

const bundle = async (rawCode: string): Promise<BundledResut> => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.34/esbuild.wasm',
    });
  }

  const result: BundledResut = { transpiled: '', code: '', error: null };

  try {
    const transformed = await service.transform(rawCode, {
      loader: 'jsx',
      target: 'es2015',
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment',
    });
    const builded = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment',
    });
    result.transpiled = transformed.code;
    result.code = builded.outputFiles[0].text;
  } catch (err) {
    result.error = err.toString();
  }

  return result;
};

export default bundle;
