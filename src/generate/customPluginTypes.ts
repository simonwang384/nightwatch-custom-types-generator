import { GeneratedPluginImports } from './models';

export function generatePluginImports(plugins: string[]): GeneratedPluginImports {
  const imports = []
  for (const plugin of plugins) {
    const pluginImport = `import '${plugin}'`
    imports.push(pluginImport)
  }
  return {
    imports
  }
}
