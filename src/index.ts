import readlineSync from 'readline-sync'
import fs from 'fs'
import path from 'path'
import { GeneratedPageObject, GeneratedPluginImports, generateCustomPageObjectTypes, generatePluginImports } from './generate'
import { templateFile } from './template/template'
import { program } from 'commander'
import chalk from 'chalk';


const options = program
  .option('-o,  --override', 'override nightwatch.d.ts file')
  .parse()
  .opts()

let nightwatchProjectPath: string = ''
const override = options.override

if (override) {
  console.warn(chalk.yellow('Override flag is set. This will override the current nightwatch.d.ts file. \n'))
}

function getNightwatchConf(): any {
  if (fs.existsSync('nightwatch.conf.js')) {
    nightwatchProjectPath = process.cwd()
    return require(path.join(process.cwd(), 'nightwatch.conf.js'))
  } else {
    console.warn(chalk.yellow('Unable to find nightwatch.conf.js file at root of project'))

    const relativeNightwatchProjectPath = readlineSync.question('Path to Nightwatch Project: ')
    nightwatchProjectPath = path.join(process.cwd(), relativeNightwatchProjectPath)
    if (!nightwatchProjectPath) {
      throw Error('Path to Nightwatch project must be provided')
    }
    return require(path.join(nightwatchProjectPath, 'nightwatch.conf.js'))
  }
}

const nightwatchConf = getNightwatchConf()
const page_objects_path: string[] | undefined = nightwatchConf.page_objects_path
const plugins: string[] | undefined = nightwatchConf.plugins

let generatedPageObject: GeneratedPageObject = { interfaceImports: [], pageObject: {} }
let generatedPluginImports: GeneratedPluginImports = { imports: [] }

if (!page_objects_path || page_objects_path.length === 0) {
  console.log(chalk.blue('No page objects to generate types for.'))
} else {
  generatedPageObject = generateCustomPageObjectTypes(
    nightwatchProjectPath,
    page_objects_path.map(page_object_path => `${nightwatchProjectPath}/${page_object_path}`)
  )
}

if (!plugins || plugins.length === 0) {
  console.log(chalk.blue('No plugins to create import types for.'))
} else {
  generatedPluginImports = generatePluginImports(plugins)
}

const nightwatchTypesDirectory = path.join(`${nightwatchProjectPath}/nightwatch/types`)
const templateOutput = templateFile(generatedPageObject, generatedPluginImports)
if (!fs.existsSync(`${nightwatchTypesDirectory}/nightwatch.d.ts`) || override) {
  if (!fs.existsSync(nightwatchTypesDirectory)) {
    fs.mkdirSync(nightwatchTypesDirectory)
  }
  fs.writeFileSync(`${nightwatchTypesDirectory}/nightwatch.d.ts`, templateOutput)
} else {
  fs.writeFileSync(`${nightwatchTypesDirectory}/nightwatch-test.d.ts`, templateOutput)
}
