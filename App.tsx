import Routes from './src/routes/routes'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './src/lib/apollo'

export default function App() {
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <Routes />
      </ApolloProvider>
    </>
  )
}
