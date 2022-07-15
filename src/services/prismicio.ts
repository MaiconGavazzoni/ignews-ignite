import * as prismic from '@prismicio/client'
import { HttpRequestLike } from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
//import sm from '../.././sm.json'

//export const endpoint = sm.apiEndpoint
//export const repositoryName = prismic.getRepositoryName(endpoint)



export interface PrismicConfig {
  req?: HttpRequestLike;
}

// Update the Link Resolver to match your project's route structure
export function linkResolver(doc: any) {
  switch (doc.type) {
    case 'homepage':
      return '/'
    case 'posts':
      return `/${doc.uid}`
    default:
      return null
  }
}

// This factory function allows smooth preview setup
// export function createClient(config = {}) {
//   const client = prismic.createClient(endpoint, {
//     ...config,
//   })
export function getPrismicClient(config: PrismicConfig): prismic.Client {
  const client = prismic.createClient(process.env.PRISMIC_API_ENDPOINT);

  enableAutoPreviews({
    client,
    //previewData: config.previewData,
    req: config.req,
  })

  return client;
}