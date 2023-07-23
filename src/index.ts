#! /usr/bin/env node

import readlineSync from 'readline-sync'
import fs from 'fs'
import path from 'path'
import { GeneratedPageObject, GeneratedPluginImports, generateCustomPageObjectTypes, generatePluginImports } from './generate'
import { templateFile } from './template/template'
import { program } from 'commander'
import chalk from 'chalk';


const options = program
  .option('-o,  --override', 'override nightwatch.d.ts file')
  .option('-p, --path <path>', 'relative path to Nightwatch project')
  .parse()
  .opts()

let absoluteNightwatchProjectPath: string = ''
const override = options.override

if (override) {
  console.warn(chalk.yellow('Override flag is set. This will override the current nightwatch.d.ts file. \n'))
}

function getNightwatchConf(): any {
  if (options.path) {
    absoluteNightwatchProjectPath = path.join(process.cwd(), options.path)
    return require(path.join(absoluteNightwatchProjectPath, 'nightwatch.conf.js'))
  }

  if (fs.existsSync('nightwatch.conf.js')) {
    absoluteNightwatchProjectPath = process.cwd()
    return require(path.join(absoluteNightwatchProjectPath, 'nightwatch.conf.js'))
  } else {
    console.warn(chalk.yellow('Unable to find nightwatch.conf.js file at root of project'))

    const relativeNightwatchProjectPath = readlineSync.question('Realive path to Nightwatch Project: ')
    absoluteNightwatchProjectPath = path.join(process.cwd(), relativeNightwatchProjectPath)
    if (!absoluteNightwatchProjectPath) {
      throw Error('Path to Nightwatch project must be provided')
    }
    return require(path.join(absoluteNightwatchProjectPath, 'nightwatch.conf.js'))
  }
}

const nightwatchConf = getNightwatchConf()
const page_objects_path: string[] | undefined = typeof nightwatchConf.page_objects_path === 'string' ? 
  [nightwatchConf.page_objects_path] :
  nightwatchConf.page_objects_path
const plugins: string[] | undefined = nightwatchConf.plugins

let generatedPageObject: GeneratedPageObject = { interfaceImports: [], pageObjects: {} }
let generatedPluginImports: GeneratedPluginImports = { imports: [] }

if (!page_objects_path || page_objects_path.length === 0) {
  console.log(chalk.blue('No page objects to generate types for.'))
} else {
  generatedPageObject = generateCustomPageObjectTypes(
    absoluteNightwatchProjectPath,
    page_objects_path.map(page_object_path => `${absoluteNightwatchProjectPath}/${page_object_path}`)
  )
}

if (!plugins || plugins.length === 0) {
  console.log(chalk.blue('No plugins to create import types for.'))
} else {
  generatedPluginImports = generatePluginImports(plugins)
}

const nightwatchTypesDirectory = path.join(`${absoluteNightwatchProjectPath}/nightwatch/types`)
const templateOutput = templateFile(generatedPageObject, generatedPluginImports)
if (!fs.existsSync(`${nightwatchTypesDirectory}/nightwatch.d.ts`) || override) {
  if (!fs.existsSync(nightwatchTypesDirectory)) {
    fs.mkdirSync(nightwatchTypesDirectory)
  }
  fs.writeFileSync(`${nightwatchTypesDirectory}/nightwatch.d.ts`, templateOutput)
} else {
  fs.writeFileSync(`${nightwatchTypesDirectory}/nightwatch-test.d.ts`, templateOutput)
}
