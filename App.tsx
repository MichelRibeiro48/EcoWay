import Routes from './src/routes/routes'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './src/lib/apollo'
import { ClerkProvider } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { CLERK_PUBLISHABLE_KEY } from '@env'
import { useFonts, Fasthand_400Regular } from '@expo-google-fonts/fasthand'
import { StatusBar } from 'expo-status-bar'

const tokenCache = {
  getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return null
    }
  },
}
export default function App() {
  const [fontsLoaded] = useFonts({
    Fasthand_400Regular,
  })

  if (!fontsLoaded) {
    return
  }
  return (
    <>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <ApolloProvider client={apolloClient}>
          <Routes />
        </ApolloProvider>
        <StatusBar translucent={true} />
      </ClerkProvider>
    </>
  )
}
