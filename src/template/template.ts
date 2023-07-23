import Handlebars from 'handlebars'
import fs from 'fs'
import { GeneratedPageObject, GeneratedPluginImports } from '../generate'

export function templateFile(generatedPageObject: GeneratedPageObject, generatedPluginImports: GeneratedPluginImports): string {
  const templateFile = fs.readFileSync(`${__dirname}/nightwatch.d.ts.hbs`, 'utf-8')
  const template = Handlebars.compile(templateFile)

  const templateObject = {
    interfaceImports: generatedPageObject.interfaceImports.join('\n').replaceAll('\\', '/'),
    pageObject: JSON.stringify(generatedPageObject.pageObjects, null, 2).replaceAll(/"/g, ''),
    pluginImports: generatedPluginImports.imports.join('\n').replaceAll('\\', '/'),
  }

  const output = template(templateObject)
  return output
}