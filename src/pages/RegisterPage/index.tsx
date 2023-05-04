import React, { useState } from 'react'
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

export default function RegisterPage({ navigation }) {
  const { signUp, setActive, isLoaded } = useSignUp()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [psword, setPsword] = useState('')
  const [ConfirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(false)

  if (!isLoaded) {
    return null
  }
  const OnSubmit = async () => {
    if (psword !== ConfirmPassword) {
      setError(true)
      return
    }
    if (!isLoaded) {
      return
    }
    try {
      const response = await signUp.create({
        emailAddress: email,
        password: psword,
      })
      const teste = await signUp.prepareEmailAddressVerification()
      const teste2 = await signUp.attemptEmailAddressVerification({
        code: '432522',
      })
      console.log(response.status)
    } catch (err) {
      console.log('Error:> ' + (err.errors ? err.errors[0].message : err))
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
          className="w-10/12 h-12 rounded-xl bg-Title px-2"
          placeholder="Nome"
          placeholderTextColor="#ACB195"
          onChangeText={(name) => setName(name)}
        />
        <Text className="self-start ml-10 mt-4 mb-2 text-White">Email</Text>
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
          value={psword}
          className="w-10/12 h-12 rounded-xl bg-Title px-2"
          placeholder="Senha"
          secureTextEntry={true}
          placeholderTextColor="#ACB195"
          onChangeText={(psword) => setPsword(psword)}
        />
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
