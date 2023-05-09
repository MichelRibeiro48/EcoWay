import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import BackgroundSvg from '../../assets/background.svg'
import styles from '../PointAbout/styles'
import classNames from 'classnames'

export default function RegisterPage({ navigation }) {
  const { signUp, isLoaded } = useSignUp()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [psword, setPsword] = useState('')
  const [ConfirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [errorName, setErrorName] = useState('')
  const [errorEmail, setErrorEmail] = useState('')

  useEffect(() => {
    if (name !== '') {
      setErrorName('')
    }
  }, [name])

  useEffect(() => {
    if (email.length > 0) {
      setErrorEmail('')
    }
  }, [email])
  useEffect(() => {
    if (psword === ConfirmPassword) {
      setError('')
    }
  }, [ConfirmPassword, psword])
  if (!isLoaded) {
    return null
  }
  const OnSubmit = async () => {
    if (name === '') {
      setErrorName('nome precisa ser preenchido')
    }
    if (psword !== ConfirmPassword) {
      setError('Senha precisa ser iguais')
    }
    if (psword.length === 0) {
      setError('Digite uma senha')
    }
    if (email.length <= 0) {
      setErrorEmail('Digite seu email')
      return
    }
    if (email.match(/^\S+@\S+\.\S+$/) === null) {
      setErrorEmail('Email invalido')
    }
    if (!isLoaded) {
      return
    }

    try {
      if (error || errorEmail || errorName) {
        return
      }
      const response = await signUp.create({
        emailAddress: email,
        password: psword,
      })
      const responseParams = response.createdSessionId
      await signUp.prepareEmailAddressVerification()
      navigation.navigate('AuthenticationPage', { email, responseParams })
    } catch (err) {
      console.log('Error:> ' + (err.errors ? err.errors[0].message : err))
      if (err.errors[0].message.match('Enter email')) {
        setErrorEmail('Digite seu email')
      }
    }
  }
  return (
    <ScrollView className="flex-1 bg-Green">
      <View className="items-center">
        <BackgroundSvg width={'100%'} height={380} />
        <Text className="self-start ml-10 mb-2 text-White">Nome</Text>
        <TextInput
          autoCapitalize="none"
          value={name}
          className={classNames(`w-10/12 h-12 rounded-xl bg-Title px-2`, {
            'border-2 border-Red': errorName !== '',
          })}
          placeholder="Nome"
          placeholderTextColor="#ACB195"
          onChangeText={(name) => setName(name)}
        />
        {errorName !== '' && (
          <Text className="self-start ml-10 text-Yellow">
            Nome deve ser preenchido
          </Text>
        )}
        <Text className="self-start ml-10 mt-4 mb-2 text-White">Email</Text>
        <TextInput
          autoCapitalize="none"
          value={email}
          className={classNames(`w-10/12 h-12 rounded-xl bg-Title px-2`, {
            'border-2 border-Red': errorEmail !== '',
          })}
          placeholder="Email"
          placeholderTextColor="#ACB195"
          onChangeText={(email) => setEmail(email)}
        />
        {errorEmail && (
          <Text className="self-start ml-10 text-Yellow">{errorEmail}</Text>
        )}
        <Text className="mt-4 self-start ml-10 mb-2 text-White">Senha</Text>
        <TextInput
          autoCapitalize="none"
          value={psword}
          className={classNames(`w-10/12 h-12 rounded-xl bg-Title px-2`, {
            'border-2 border-Red': error !== '',
          })}
          placeholder="Senha"
          secureTextEntry={true}
          placeholderTextColor="#ACB195"
          onChangeText={(psword) => setPsword(psword)}
        />
        {error && <Text className="self-start ml-10 text-Yellow">{error}</Text>}
        <Text className="mt-4 self-start ml-10 mb-2 text-White">
          Confirmar senha
        </Text>
        <TextInput
          autoCapitalize="none"
          value={ConfirmPassword}
          className="w-10/12 h-12 rounded-xl bg-Title px-2"
          placeholder="Senha"
          secureTextEntry={true}
          placeholderTextColor="#ACB195"
          onChangeText={(ConfirmPassword) =>
            setConfirmPassword(ConfirmPassword)
          }
        />
        <Pressable className="mt-6">
          <Text
            className=" text-White"
            onPress={() => navigation.navigate('LoginPage')}
          >
            Já possui conta? faça login
          </Text>
        </Pressable>
        <TouchableOpacity
          className="my-8 bg-Title w-10/12 h-12 px-6 items-center justify-center rounded-xl"
          style={[
            Platform.OS === 'android' ? styles.AndroidShadow : styles.IosShadow,
          ]}
          onPress={OnSubmit}
        >
          <Text>Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
