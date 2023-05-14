import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native'
import { useOAuth, useSession, useSignIn } from '@clerk/clerk-expo'
import BackgroundSvg from '../../assets/background.svg'
import IconE from '@expo/vector-icons/Entypo'
import { maybeCompleteAuthSession } from 'expo-web-browser'
import { useWarmUpBrowser } from '../../hooks/clerk'
import classNames from 'classnames'
import Button from '../../components/Button'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

maybeCompleteAuthSession()

export default function LoginPage({ navigation }) {
  useWarmUpBrowser()

  const { signIn, setSession, isLoaded } = useSignIn()
  const { session } = useSession()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (email.length > 0) {
      setErrorEmail('')
    }
    if (password.length > 0) {
      setErrorPassword('')
    }
  }, [email, password])

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onOAuthButtonPress = React.useCallback(async () => {
    setLoading(true)
    try {
      const { createdSessionId, setActive } = await startOAuthFlow()

      if (createdSessionId) {
        setActive({ session: createdSessionId })
      } else {
        // Use signIn or signUp, from startOAuthFlow, for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', JSON.stringify(err))
    } finally {
      setLoading(false)
    }
  }, [startOAuthFlow])

  const onSignInPress = async () => {
    setLoading(true)
    if (email.match(/^\S+@\S+\.\S+$/) === null) {
      setErrorEmail('Email invalido')
      setLoading(false)
      return
    }
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
      if (err.errors[0].message.match('Enter password.')) {
        setErrorPassword('Digite sua senha')
      }
      if (err.errors[0].message.match('Password is incorrect')) {
        setErrorPassword('Senha incorreta')
      }
      if (err.errors[0].message.match("Couldn't")) {
        setErrorEmail('Email não cadastrado')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) navigation.replace('HomePage')
  }, [navigation, session])

  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
    Roboto_400Regular,
    Roboto_700Bold,
  })

  if (!fontsLoaded) {
    return
  }

  return (
    <ScrollView className="flex-1 bg-Green">
      <View className="items-center">
        <BackgroundSvg width={'100%'} height={380} />
        <Text
          className="text-White text-7xl pt-6"
          style={{ fontFamily: 'Fasthand_400Regular' }}
        >
          EcoWay
        </Text>
        <View className="w-full px-5">
          <Text className="self-start mb-2 text-White">Email</Text>
          <TextInput
            autoCapitalize="none"
            value={email}
            className={classNames(`w-full h-12 rounded-xl bg-Title px-2`, {
              'border-Red border-2': errorEmail !== '',
            })}
            placeholder="Email"
            placeholderTextColor="#ACB195"
            onChangeText={(email) => setEmail(email)}
          />
          {errorEmail && (
            <Text className="self-start ml-10 text-Yellow">{errorEmail}</Text>
          )}
          <Text className="mt-4 self-start mb-2 text-White">Senha</Text>
          <View
            className={classNames(
              `w-full h-12 rounded-xl bg-Title px-2 flex-row justify-between`,
              {
                'border-2 border-Red': errorPassword !== '',
              },
            )}
            style={{ position: 'relative' }}
          >
            <TextInput
              autoCapitalize="none"
              value={password}
              className="w-full"
              secureTextEntry={!showPassword}
              placeholder="Senha"
              placeholderTextColor="#ACB195"
              onChangeText={(password) => setPassword(password)}
            />
            <Pressable
              className="self-center"
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 16 }}
            >
              <IconE name={!showPassword ? 'eye' : 'eye-with-line'} size={24} />
            </Pressable>
          </View>
          {errorPassword && (
            <Text className="self-start ml-10 text-Yellow">
              {errorPassword}
            </Text>
          )}
          <View className="w-full h-px my-6 bg-Title" />
          <Button
            displayName="Entrar com o google"
            greenMode={false}
            onPress={onOAuthButtonPress}
            sizeButton="medium"
            iconNameE="google"
            sizeIcon={20}
            loading={loading}
            fullWidth
          />
          <Pressable>
            <Text
              className="text-White mb-[69] mt-6 self-center"
              style={{ fontFamily: 'Roboto_700Bold' }}
              onPress={() => navigation.navigate('RegisterPage')}
            >
              Não possui cadastro? clique aqui
            </Text>
          </Pressable>
          <Button
            displayName="Login"
            greenMode={false}
            onPress={onSignInPress}
            sizeButton="medium"
            loading={loading}
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  )
}
