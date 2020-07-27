const { readBody } = require('./utils')
const { parse } = require('es-module-lexer')
const MagicString = require('magic-string') // 因为字符串具有不变性

function rewriteImports (source) {
  const imports = parse(source)[0]
  const magicString = new MagicString(source)
  if (imports.length) {
    for (let i = 0; i < imports.length; i++) {
      const { s, e } = imports[i]
      let id = source.substring(s, e)
      if (/^[^/.]/.test(id)) {
        id = `/@modules/${id}`
        magicString.overwrite(s, e, id)
      }
    }
  }
  return magicString.toString()
}

function moduleReWritePlugin ({ app, root }) {
  app.use(async (ctx, next) => {
    await next()
    // console.log(ctx.body)
    // 获取流中的方法
    if (ctx.body && ctx.response.is('js')) {
      const content = await readBody(ctx.body)
      // console.log(content)
      const result = rewriteImports(content)
      ctx.body = result
    }
  })
}
exports.moduleReWritePlugin = moduleReWritePlugin
