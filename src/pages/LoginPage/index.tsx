import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
} from 'react-native'
import { useOAuth, useSession, useSignIn } from '@clerk/clerk-expo'
import BackgroundSvg from '../../assets/background.svg'
import styles from '../PointAbout/styles'
import Icon from '@expo/vector-icons/AntDesign'
import { maybeCompleteAuthSession } from 'expo-web-browser'
import { useWarmUpBrowser } from '../../hooks/clerk'

maybeCompleteAuthSession()

export default function LoginPage({ navigation }) {
  useWarmUpBrowser()

  const { signIn, setSession, isLoaded } = useSignIn()
  const { session } = useSession()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onOAuthButtonPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow()

      if (createdSessionId) {
        setActive({ session: createdSessionId })
      } else {
        // Use signIn or signUp, from startOAuthFlow, for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', JSON.stringify(err))
    }
  }, [])

  const onSignInPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      })
      await setSession(completeSignIn.createdSessionId)
      navigation.replace('HomePage')
    } catch (err) {
      console.log('Error:> ' + (err.errors ? err.errors[0].message : err))
    }
  }

  useEffect(() => {
    if (session) navigation.replace('HomePage')
  }, [navigation, session])

  return (
    <View className="flex-1 items-center bg-Green">
      <BackgroundSvg width={'100%'} height={380} />
      <Text
        className="text-White text-7xl pt-6"
        style={{ fontFamily: 'Fasthand_400Regular' }}
      >
        EcoWay
      </Text>
      <Text className="self-start ml-10 mb-2 text-White">Email</Text>
      <TextInput
        autoCapitalize="none"
        value={email}
        className="w-10/12 h-12 rounded-xl bg-Title px-2"
        placeholder="Email"
        placeholderTextColor="#ACB195"
        onChangeText={(email) => setEmail(email)}
      />
      <Text className="mt-4 self-start ml-10 mb-2 text-White">Senha</Text>
      <TextInput
        autoCapitalize="none"
        value={password}
        className="w-10/12 h-12 rounded-xl bg-Title px-2"
        placeholder="Senha"
        placeholderTextColor="#ACB195"
        onChangeText={(password) => setPassword(password)}
      />
      <View className="w-10/12 h-px mt-4 bg-Title" />
      <TouchableOpacity
        className="mt-4 bg-Title w-10/12 h-12 px-6 items-center justify-center rounded-xl flex-row"
        style={[
          Platform.OS === 'android' ? styles.AndroidShadow : styles.IosShadow,
        ]}
        onPress={() => onOAuthButtonPress()}
      >
        <Icon name="google" size={20} />
        <Text className="ml-2">Entrar com o google</Text>
      </TouchableOpacity>
      <Pressable className="mt-6">
        <Text
          className=" text-White"
          onPress={() => navigation.navigate('RegisterPage')}
        >
          Não possui cadastro? clique aqui
        </Text>
      </Pressable>
      <TouchableOpacity
        className="mt-8 bg-Title w-10/12 h-12 px-6 items-center justify-center rounded-xl"
        style={[
          Platform.OS === 'android' ? styles.AndroidShadow : styles.IosShadow,
        ]}
        onPress={onSignInPress}
      >
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  )
}
