const { useExpressDevPack } = require('@midwayjs/faas-dev-pack');
const { resolve } = require('path');
const URL = require('url');

module.exports = {
  outputDir: 'build',
  chainWebpack: (config) => {
    const MidwayHooksLoader = require.resolve('@midwayjs/hooks-loader');
    ['js', 'ts'].forEach((type) => {
      config.module
        .rule(type)
        .use('midway-hooks')
        .loader(MidwayHooksLoader);
    });
  },
  devServer: {
    before(app) {
      app.use(
        useExpressDevPack({
          functionDir: resolve(__dirname),
          sourceDir: resolve(__dirname, 'src/apis'),
          // 忽略渲染函数
          ignoreWildcardFunctions: ['render'],
          // 忽略静态文件地址
          ignorePattern: (req) => {
            const { pathname } = URL.parse(req.url);
            return /\.(js|css|map|json|png|jpg|jpeg|gif|svg|eot|woff2|ttf)$/.test(
              pathname
            );
          },
        })
      );
    },
  },
};