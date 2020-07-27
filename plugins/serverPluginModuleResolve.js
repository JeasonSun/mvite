const moduleREG = /^\/@modules\//
const fs = require('fs').promises
const path = require('path')

function moduleResolvePlugin ({ app, root }) {
  const vueResolved = resolveVue(root)
  app.use(async (ctx, next) => {
    if (!moduleREG.test(ctx.path)) {
      return next()
    }
    // 将/@modules/ 替换掉  vue
    const id = ctx.path.replace(moduleREG, '')
    ctx.type = 'js'
    const content = await fs.readFile(vueResolved[id], 'utf8')
    ctx.body = content
  })
}

function resolveVue (root) {
  // vue3由几部分组成 runtime-dom runtime-core compiler reactivity shared, 在后端中解析.vue文件 compiler-sfc
  // 编译时在后盾实现的， 所以我需要拿到的文件是commonjs规范的
  const compilerPkgPath = path.join(
    root,
    'node_modules',
    '@vue/compiler-sfc/package.json'
  )
  const compilerPkg = require(compilerPkgPath)
  const compilerPath = path.join(
    path.dirname(compilerPkgPath),
    compilerPkg.main
  )
  // esmModule
  const resolvePath = name =>
    path.resolve(
      root,
      'node_modules',
      `@vue/${name}/dist/${name}.esm-bundler.js`
    )

  const runtimeDomPath = resolvePath('runtime-dom')
  const runtimeCorePath = resolvePath('runtime-core')
  const reactivityPath = resolvePath('reactivity')
  const sharedPath = resolvePath('shared')

  return {
    compiler: compilerPath,
    '@vue/runtime-dom': runtimeDomPath,
    '@vue/runtime-core': runtimeCorePath,
    '@vue/reactivity': reactivityPath,
    '@vue/shared': sharedPath,
    vue: runtimeDomPath
  }
}
exports.moduleResolvePlugin = moduleResolvePlugin
