import path from 'path'
import dirTree, { DirectoryTree } from 'directory-tree'
import fs from 'fs'
// @ts-ignore
import relative from 'relative';
import {GeneratedPageObject} from './models'

const pageObject: Record<string, any> = {}
const interfaceImports: string [] = []
let interfaces: string[] = []

function interpolateInterfaceImports(nightwatchProjectPath: string, page_objects_path: string) {
  const relativeTypesPath = relative(path.join(nightwatchProjectPath, 'types/nightwatch.d.ts'), page_objects_path)
  interfaceImports.push(`import { ${interfaces.join(', ')} } from '${relativeTypesPath}'`)
}

function excludeFile(fileName: string) {
  return fileName === 'index.ts';
}

function getFileNameWithoutExtensions(fileName: string) {
  return path.parse(fileName).name;
}

function getTreeChildrenObjects(pageObject: Record<string, any>, parentName: string, treeChildren: DirectoryTree[]) {
  for (const children of treeChildren) {
    if (excludeFile(children.name)) {
      continue
    }

    if (Array.isArray(children.children)) {
      pageObject[parentName][children.name] = {};
      getTreeChildrenObjects(
        pageObject[parentName],
        children.name,
        children.children
      );
    } else {
      const fileName = getFileNameWithoutExtensions(children.name);
      pageObject[parentName][fileName] = createArrowFunctionString(
        children
      );
    }
  }
}

function createArrowFunctionString(file: DirectoryTree) {
  const fileString = fs.readFileSync(file.path).toString();
  if (!fileString.includes('export interface') || file.name.includes('.js')) {
    return '() => NightwatchPage'
  }
  const test = fileString.substring(fileString.indexOf('export interface'));
  const interfaceName = test.split(' ')[2].trim();
  interfaces.push(interfaceName);
  return `() => ${interfaceName}`;
}

export function generateCustomPageObjectTypes(nightwatchProjectPath: string, page_objects_paths: string[]): GeneratedPageObject {
  for (const page_objects_path of page_objects_paths) {
    const tree = dirTree(page_objects_path)
    
    if (!tree.children) {
      continue
    }

    for (const treeChildren of tree.children) {
      if (excludeFile(treeChildren.name)) {
        continue;
      }
  
      if (treeChildren.children) {
        pageObject[treeChildren.name] = {};
        getTreeChildrenObjects(
          pageObject,
          treeChildren.name,
          treeChildren.children
        );
      } else {
        const fileName = getFileNameWithoutExtensions(treeChildren.name);
        pageObject[fileName] = createArrowFunctionString(treeChildren);
      }
    }
    interpolateInterfaceImports(nightwatchProjectPath, page_objects_path)
    interfaces = []
  }
  return {
    interfaceImports,
    pageObject
  }
}