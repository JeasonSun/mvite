const koaStatic = require('koa-static')
const path = require('path')
function serveStaticPlugin ({ app, root }) {
  app.use(koaStatic(root))
  app.use(koaStatic(path.join(root, 'public')))
}

exports.serveStaticPlugin = serveStaticPlugin
