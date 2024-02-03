import input from './input_data.json';
import { CatalogData } from './types';
import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';

dotenv.config();
const inData: CatalogData[] = input as CatalogData[]
const appId = process.env.ALGOLIA_APP_ID ?? "";
const apiKey = process.env.ALGOILA_API_KEY ?? "";
const indexName = process.env.ALGOLIA_INDEX_NAME ?? "";
const client = algoliasearch(appId, apiKey);
const index = client.initIndex(indexName);

if (!appId || !apiKey || !indexName) {
  console.log({ appId, apiKey, indexName })
  throw new Error('Missing Algolia credentials');
}

index.saveObjects(inData, { autoGenerateObjectIDIfNotExist: true }).then(({ objectIDs }) => {
  console.log(`Data saved: ${objectIDs}`);
}).catch((err) => {
  console.log({ err });
});
