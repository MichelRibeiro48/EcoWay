import { ApolloClient, InMemoryCache } from '@apollo/client'
import { API_URL } from '@env'

if (API_URL.length > 0) {
  console.log('teste')
}
export const apolloClient = new ApolloClient({
  uri: API_URL || '',
  cache: new InMemoryCache(),
})
