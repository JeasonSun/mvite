const Koa = require('koa')
const { serveStaticPlugin } = require('./plugins/serverPluginServeStatic')
const { moduleReWritePlugin } = require('./plugins/serverPluginModuleRewrite')
const { moduleResolvePlugin } = require('./plugins/serverPluginModuleResolve')

function createServer () {
  const app = new Koa()
  const root = process.cwd()
  // koa是基于中间件来运行的
  const context = {
    app,
    root
  }
  const resolvedPlugins = [
    // 2. 解析import语法，重写路径
    moduleReWritePlugin,
    // 3. 解析 以 /@modules文件开头的内容， 找到对应的结果
    moduleResolvePlugin,
    // 1. 要实现静态服务的功能
    serveStaticPlugin
  ]
  resolvedPlugins.forEach(plugin => plugin(context))
  return app
}

module.exports = createServer
