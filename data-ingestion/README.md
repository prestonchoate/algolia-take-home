# Data Ingestion Project

## Setup
Ensure that `node` and `npm` are available on your system. This project uses Node 18, however there is nothing in this project that would prevent utilizing Node 20 instead. Run `npm install` to install all dependencies.

Create a `.env` file in the root of this project locally in order to store the API credentials. You can do this by running `cp ./.env.sample ./.env` from the project root and filling in the credentials.

## Project Dependencies
This project relies on the following NPM packages:

* [Algoliasearch](https://www.npmjs.com/package/algoliasearch)
* [Dotenv](https://www.npmjs.com/package/dotenv)

Dev Dependencies
* [Typescript](https://www.npmjs.com/package/typescript)
* [@types/node](https://www.npmjs.com/package/@types/node)

## Running the project
Simply execute `npm run dev` from the terminal to run this project. It should connect to Algolia and upload the data in `./input_data.json` to the specified index in the `.env` file. The terminal will return either the errors when trying to upload the data, or a list of object IDs that were created/updated.

## CodeSandbox
A CodeSandbox environment has been created for this project and can be accessed [here](https://codesandbox.io/p/github/prestonchoate/algolia-take-home/main?file=%1Fsrc%2Findex.ts).
