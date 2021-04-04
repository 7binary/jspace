import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import * as localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (input: string, debug = false) => ({
  name: 'fetch-plugin',
  setup: (build: esbuild.PluginBuild) => {
    // срабатывает сразу после резолва пути импорта,
    // тут мы загружаем файлы (пакетов npm) по пути/кэшу и указываем загрузчик содержимого файла

    build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
      debug && console.log(args);
      // проверка кэша, если кэш найден загрузчик останавливается, иначе идет ниже искать по фильтру
      return await fileCache.getItem<esbuild.OnLoadResult>(args.path);
    });

    build.onLoad({ filter: /^index\.js$/ }, () => {
      return { loader: 'jsx', contents: input };
    });

    build.onLoad({ filter: /\.css$/ }, async (args: esbuild.OnLoadArgs) => {
      // запрос содержимого файла и установка загрузчика для esbuild
      const { data, request } = await axios.get<string>(args.path);
      const escapedCss = data
        .replace(/\n/g, '')
        .replace(/"/g, '\\"')
        .replace(/'/g, '\\\'');
      const contents = `
        const style = document.createElement('style');
        style.innerText = '${escapedCss}';
        document.head.appendChild(style)
        `;
      const result: esbuild.OnLoadResult = {
        loader: 'jsx',
        contents,
        resolveDir: new URL('.', request.responseURL).pathname,
      };
      await fileCache.setItem(args.path, result);

      return result;
    });

    build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
      // запрос содержимого файла и установка загрузчика для esbuild
      const { data, request } = await axios.get<string>(args.path);
      const result: esbuild.OnLoadResult = {
        loader: 'jsx',
        contents: data,
        resolveDir: new URL('.', request.responseURL).pathname,
      };
      await fileCache.setItem(args.path, result);

      return result;
    });
  },
});
