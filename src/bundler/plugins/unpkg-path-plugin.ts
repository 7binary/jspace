import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => ({
  name: 'unpkg-path-plugin',
  setup(build: esbuild.PluginBuild) {
    // резолвит путь входного файла модуля
    build.onResolve({ filter: /^index\.js$/ }, () => ({
      path: 'index.js',
      namespace: 'a',
    }));

    // резолвит пути относительные в модуле
    build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => ({
      path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
      namespace: 'a',
    }));

    // срабатывает когда надо отрезолвить другие пути импорта файла (import/require)
    build.onResolve({ filter: /.*/ }, (args: esbuild.OnResolveArgs) => ({
      path: `https://unpkg.com/${args.path}`,
      namespace: 'a',
    }));
  },
});
