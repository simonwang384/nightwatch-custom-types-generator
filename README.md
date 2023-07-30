# Nightwatch Custom Types Generator

> :warning: This tool currently only generates custom types for page objects. For custom commands you will need to implement the type yourself.

Types in Nightwatch can become very difficult and confusing if you're not used to TypeScript with Nightwatch. The main reasoning behind this is the need to override some of the types declared by the Nightwatch types [package](https://www.npmjs.com/package/@types/nightwatch) in order to get custom page objects to show up correctly in our types (autocomplete, IntelliSense, etc...). The process for doing this isn't very well documented besides some users writing up guides themselves.

The process is usually like this for page objects:

1. Create typed page objects
2. Create a `types/nightwatch.d.ts` file and override the `nightwatch` module
3. Declare the module for `nightwatch` and override the type `NightwatchCustomPageObjects`
4. Pray it works
    - Usually if it doesn't work something might be misconfigured in your `tsconfig.json` file.

On paper that doesn't sound too bad but it can get bad. Custom page objects are basically mapped to the directory tree of where you state your page objects are located. What does this mean? If you have a ton of nested page objects creating the custom type can become very complicated and confusing and updating it can will become increasingly more complicated as your page objects grow.

This is where Nightwatch Custom Types Generator comes in! Nightwatch Custom Types Generator will help with the generation of these custom page objects and their related types. 

This tool has been tested with version `3.1.1` and `2.6.21` of Nightwatch. The tool will most likely continue to work with future versions as well. If you notice it not working please open a issue.

## Demo

![Demo](https://github.com/simonwang384/nightwatch-custom-types-generator/blob/main/demo/demo.gif?raw=true)

## Installation

```sh
npm install --save-dev nightwatch-custom-types-generator
```

## Running the Tool

| Flags | Description |
| - | - |
| `-o, --override` | Override the current `nightwatch.d.ts` file with the custom types generated |
| `-p, --path` | Relative path to your Nightwatch project |

Run this command in the root of your Nightwatch project

```sh
npx nightwatch-custom-types-generator
```

## How does it work?

It is highly recommended to run the tool at the root of your Nightwatch project.

The tool works by locating the root of your Nightwatch project and then locating `nightwatch.conf.js` (usually at the root of your Nightwatch project). From there the tool will parse the config file and get the values set for `plugins` and `page_objects_path`. 

If nothing is set for either/or then it will just log out that there are no page objects or plugins to create or import types for. If something is set for either of those fields than the tool will being to do its magic. 

Something to note. The types are created in the `types/nightwatch.d.ts` file located in the `nightwatch` directory of your Nightwatch project. This tool is assuming you're following the recommended way of structuring your Nightwatch project. If there is no `types/nightwatch.d.ts` file the tool will create one for you. If there is one that already exists the tool will create a `types/nightwatch-test.d.ts`. This is so the tool doesn't override any of your types and will allow you to specifically pick out any custom types you want to import.

### tsconfig.json

It is recommended to format both your `tsconfig.json` files in a specific way. In Nightwatch TypeScript projects there are two `tsconfig.json` files that are needed. The first is in the root of the project and the second is usually located in the `nightwatch` folder. Unless you are using a different directory to replace `nightwatch`

Format of the root `tsconfig.json`

```json
{
  "compilerOptions": {
    ...
  },
  "files": ["./nightwatch/types/nightwatch.d.ts"],
  "include": ["./nightwatch"],
}
```

Format of the `nightwatch/tsconfig.json`

```json
{
    "extends": "../tsconfig.json",
    "compilerOptions": {
        ...
    },
}
```

The root `tsconfig.json` file should include the `files` field which will include a reference to the types file that will be created. It should also include the `include` field which contain the path to directory where your tests are present (where these tsconfigs should be applied).

The inner `nightwatch/tsconfig.json` file should just extend the root `tsconfig.json`. If there are any other `compilerOptions` needed you can add them there. If not you can just remove that field.

If you need a reference to build off of you can take a look at this repos test Nightwatch project `tsconfig.json` files. 

- Root Nightwatch project [tsconfig.json](https://github.com/simonwang384/nightwatch-custom-types-generator/blob/main/tests/tsconfig.json)
- Inner Nightwatch project [tsconfig.json](https://github.com/simonwang384/nightwatch-custom-types-generator/blob/main/tests/nightwatch/tsconfig.json)

### Page Objects

For `page_objects_path` it will locate each directory and then get the tree of that directory. After getting the tree it will start creating the type for the page objects. Directories will be treated as paths and the page object files will be treated as the actual page object to get initialized. Files will get parsed for the interface name of the page object and this will be used in the final custom page object type. 

Example page object directory tree:

```sh
└───google
    │   landingPage.ts
    │
    └───image
            imageLandingPage.ts
```

Example custom type that's generated:

```ts
{
  google: {
    landingPage: () => LandingPage,
    image: {
      imageLandingPage: () => ImageLandingPage
    }
  }
}
```

`ImageLandingPage` and `LandingPage` are interfaces declared in their respective page object files. You can use the page objects as you usually do but now the autocomplete should let you know what page objects are there!

This guide won't go into detail on how to create page objects. If you want to learn how this is a good [guide](https://www.davidmello.com/using-nightwatch-with-typescript). Also feel free to view this repos [test Nightwatch project page objects](https://github.com/simonwang384/nightwatch-custom-types-generator/tree/main/tests/nightwatch/page-objects).

### Plugins

The logic for plugins is a lot simplier. Since plugins are 3rd party packages all the tool does is grab the plugins and import them in the types file.

Example plugins:

```js
plugins: ['@nightwatch/apitesting', 'nightwatch-saucelabs-endsauce'],
```

Example imports generated:

```ts
import '@nightwatch/apitesting'
import 'nightwatch-saucelabs-endsauce'
```

## Contributing

You can open a PR against this repository to contribute! :smile:

When making a PR please follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). This allows us to keep commits nice and organized

### Running Tests

You can run tests by using the `test` script like so

```sh
npm run test
```

This script does a couple of things

1. It will first generate the types based on the Nightwatch project located in the `tests` directory
2. After generating the types it will `cd` into `tests` and run `npm ci` to download dependencies for running the Nightwatch tests.
3. It will run `nightwatch` and check to see if the tests pass using the types generated by the script.

This isn't the best test but it will suffice for covering most of what the script tries to accomplish.

## Future Improvements

- Automate the creation of custom command types
- Create more robust tests

## FAQ

> Types aren't working

- Please make sure your `tsconfig.json` files are formatted correctly

> It's not importing the interfaces correctly

- If it's not importing the interfaces correctly it most likely means you're not exporting the interfaces in a centralized located. It's recommended to create a `index.ts` file at the root of your page object directory that helps export all your relevant interfaces, functions, etc... You can see an example [here](https://github.com/simonwang384/nightwatch-custom-types-generator/blob/main/tests/nightwatch/page-objects/index.ts)

> What is the right project structure?

- The recommended Nightwatch project structure is all relevant `Nightwatch` files and folders under the `nightwatch` directory like so:

```sh
/nightwatch
└───tsconfig.json
│
└───/page-objects
│   │
│   └───testPage1.ts
│   └───testPage2.ts
│
└───/tests
│   │
│   └───test1.ts
│   └───test2.ts
│
└───/commands
│   │
│   └───customWait.ts
│
└───/types
    │
    nightwatch.d.ts
```

The above directory tree was grabbed from [here](https://www.davidmello.com/nightwatch-typescript-custom-command-extensibility/). Definitely a good read on creating custom TypeScript commands!

## Helpful Links

- [Nightwatch](https://nightwatchjs.org/)
- [Nightwatch TypeScript Page Object Guide](https://www.davidmello.com/using-nightwatch-with-typescript/)
- [Nightwatch TypeScript Custom Comamnds Guide](https://www.davidmello.com/nightwatch-typescript-custom-command-extensibility/)