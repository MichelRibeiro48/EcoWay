import { ApolloClient, InMemoryCache } from '@apollo/client'
import { API_URL, API_SECRET } from '@env'

if (API_URL.length <= 0) {
  console.log('teste')
}
export const apolloClient = new ApolloClient({
  uri: API_URL || '',
  cache: new InMemoryCache(),
  headers: {
    authorization: API_SECRET,
  },
})
