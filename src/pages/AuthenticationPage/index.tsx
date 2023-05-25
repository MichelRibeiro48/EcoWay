import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Pressable,
} from 'react-native'
import { useEffect, useState } from 'react'
import styles from '../PointAbout/styles'

import { useFonts, Fasthand_400Regular } from '@expo-google-fonts/fasthand'
import BackgroundSvg from '../../assets/background.svg'
import classNames from 'classnames'
import { useSignUp } from '@clerk/clerk-expo'

export default function AuthenticationPage({ navigation, route }) {
  const { signUp, setSession } = useSignUp()

  const { email, responseParams } = route.params
  const [code, setCode] = useState('')
  const [errorCode, setErrorCode] = useState('')
  const [reattemptCode, setReattemptCode] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [awaitRequest, setAwaitRequest] = useState('')

  useEffect(() => {
    if (code.length > 0) {
      setErrorCode('')
      setResendMessage('')
      setAwaitRequest('')
    }
  }, [code])

  const [fontsLoaded] = useFonts({
    Fasthand_400Regular,
  })

  if (!fontsLoaded) {
    return
  }
  const resendCode = async () => {
    try {
      await signUp.prepareEmailAddressVerification()
      setReattemptCode(false)
      setResendMessage('Código enviado com sucesso!')
    } catch (err) {
      console.log(err)
    }
  }
  const onSubmitCode = async () => {
    try {
      await signUp.attemptEmailAddressVerification({
        code,
      })
      await setSession(responseParams)
      navigation.navigate('HomePage')
    } catch (err) {
      console.log(err.errors[0])
      if (err.errors[0].message.match('Too many requests.')) {
        setAwaitRequest(
          'Houve muitas tentativas de login, espere um tempo para tentar novamente',
        )
      }
      if (err.errors[0].message.match('is incorrect')) {
        setErrorCode('Código invalido. Verifique se o código está certo')
      }
      if (err.errors[0].message.match('Enter code.')) {
        setErrorCode('Digite o Código')
      }
      if (err.errors[0].message.match('failed')) {
        setReattemptCode(true)
        setErrorCode('')
      }
    }
  }

  return (
    <View className="flex-1 items-center bg-Green">
      <BackgroundSvg width={'100%'} height={380} />
      <Text className="text-White">Voce esta quase la!</Text>
      <Text className="text-White">
        Digite o codigo que enviamos para o email {email}
      </Text>
      <Text className="self-start ml-10 mt-10 text-White">Código</Text>
      <TextInput
        autoCapitalize="none"
        value={code}
        className={classNames(`w-10/12 h-12 rounded-xl bg-Title px-2`, {
          'border-2 border-Red': errorCode !== '',
        })}
        placeholder="Código"
        placeholderTextColor="#ACB195"
        onChangeText={(code) => setCode(code)}
      />
      {resendMessage && (
        <Text>Código enviado com sucesso para o seu email!</Text>
      )}
      {awaitRequest && <Text>{awaitRequest}</Text>}
      {errorCode && <Text className="self-start ml-10 mt-2">{errorCode}</Text>}
      {reattemptCode && (
        <View className="self-start ml-10 mt-2">
          <Text>Código expirou</Text>
          <Pressable onPress={resendCode}>
            <Text className="text-White">
              Clique aqui para reenviar o código para o seu email
            </Text>
          </Pressable>
        </View>
      )}
      <TouchableOpacity
        className="mt-12 bg-Title w-10/12 h-12 px-6 items-center justify-center rounded-xl"
        style={[
          Platform.OS === 'android' ? styles.AndroidShadow : styles.IosShadow,
        ]}
        onPress={onSubmitCode}
      >
        <Text>Enviar</Text>
      </TouchableOpacity>
    </View>
  )
}
