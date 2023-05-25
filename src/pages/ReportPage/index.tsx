import React, { useState } from 'react'
import {
  Image,
  Text,
  View,
  Platform,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Pressable,
  Keyboard,
} from 'react-native'
import {
  useFonts,
  Roboto_100Thin_Italic,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto'
import * as FileSystem from 'expo-file-system'
import IconR from '@expo/vector-icons/AntDesign'
import IconF from '@expo/vector-icons/FontAwesome'
import styles from './styles'
import CardLocation from '../../components/CardLocation'
import { ActivityIndicator, RadioButton } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import { gql, useMutation } from '@apollo/client'
import { getSinglePoint } from '../PointAbout/types'
import { getStatusOfOneLocation } from '../../utils/getLocationStatus'
import { LocationStatus } from '../../@types/locationStatus'
import { PropsResponseImage } from './types'
import { useAuth } from '@clerk/clerk-expo'
import { Response } from '../../utils/getDistanceBetweenCoordinatesInKM'

const CREATE_REPORT = gql`
  mutation MyMutation(
    $description: String!
    $locationId: ID
    $userId: String!
    $locationStatusType: StatusType!
    $locationImageUrl: String
  ) {
    createReport(
      data: {
        description: $description
        userId: $userId
        locationStatusType: $locationStatusType
        locationImageUrl: $locationImageUrl
        clh4uk4d25oj801umdsduahee: { connect: { id: $locationId } }
      }
    ) {
      id
    }
  }
`

const PUBLISH_REPORT = gql`
  mutation MyMutation($id: ID) {
    publishReport(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`

export default function ReportPage({ navigation, route }) {
  const data = route.params.data as getSinglePoint
  const distance = route.params.distance as Response
  const [publishReport] = useMutation(PUBLISH_REPORT)

  const [createReport, { data: reportDataResponse }] = useMutation(
    CREATE_REPORT,
    {
      onCompleted: async (data) => {
        await publishReport({
          variables: {
            id: data.createReport.id,
          },
        })
        alert('Reporte criado com sucesso!')

        navigation.goBack()
      },
    },
  )

  const [checked, setChecked] = useState('')
  const [imageCamera, setImageCamera] = useState(null)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const { userId } = useAuth()

  const status: LocationStatus = data
    ? getStatusOfOneLocation(data.collectPoint.reports)
    : 'empty'
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
  })

  if (!fontsLoaded) {
    return
  }

  const postImageImgur = async () => {
    try {
      const response = await FileSystem.uploadAsync(
        'https://api.imgur.com/3/image',
        imageCamera,
        {
          httpMethod: 'POST',
          headers: {
            Authorization: 'Client-ID d7bc3fea8bfe840',
          },
        },
      )
      const data: PropsResponseImage = await JSON.parse(response.body)
      return data
    } catch (err) {
      console.log(err)
    }
  }

  const report = async () => {
    setLoading(true)
    try {
      const imgurImage = await postImageImgur()
      await createReport({
        variables: {
          description,
          locationImageUrl: imgurImage.data.link,
          userId,
          locationStatusType: checked,
          locationId: data.collectPoint.id,
        },
      })

      console.log(JSON.stringify('data:', reportDataResponse))
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImageCamera(result.assets[0].uri)
    }
  }

  if (!data) {
    return <ActivityIndicator size="large" color="#576032" />
  }

  return (
    <Pressable
      className="flex-1 justify-center min-h-[90vh]"
      onPress={Keyboard.dismiss}
    >
      <Image
        className="w-full h-full"
        source={{
          uri: data.collectPoint.placeImages[0].url,
        }}
        blurRadius={2}
        alt="forest wallpaper"
      />
      <View className="w-11/12 h-5/6 bg-White absolute self-center p-6 flex-col rounded-xl">
        <CardLocation
          distance={distance}
          image={{
            uri:
              data.collectPoint.placeImages[0].url ||
              require('../../assets/markerOff.png'),
          }}
          status={status}
          title={data.collectPoint.name}
        />
        <View className="">
          <TextInput
            className="w-full vertical bg-White rounded-xl px-2 py-1 my-6"
            numberOfLines={8}
            placeholder="Escreva uma breve descrição de como está o local"
            multiline
            style={
              Platform.OS === 'android'
                ? styles.AndroidShadow
                : styles.IosShadow
            }
            onChangeText={(text) => setDescription(text)}
          />
        </View>
        <View className="flex-row items-center">
          <RadioButton
            color="#576032"
            uncheckedColor="#576032"
            value="empty"
            status={checked === 'empty' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('empty')}
          />
          <Text>Vazio</Text>
        </View>
        <View className="flex-row items-center">
          <RadioButton
            color="#576032"
            uncheckedColor="#576032"
            value="empty"
            status={checked === 'partially_full' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('partially_full')}
          />
          <Text>Parcialmente cheio</Text>
        </View>
        <View className="flex-row items-center">
          <RadioButton
            color="#576032"
            uncheckedColor="#576032"
            value="empty"
            status={checked === 'full' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('full')}
          />
          <Text>Cheio</Text>
        </View>
        {loading ? (
          <ActivityIndicator size={'large'} color="#576032" />
        ) : (
          <>
            <TouchableOpacity
              className="mt-10 w-60 h-16 bg-White self-center items-center justify-center rounded-lg flex-row"
              style={[
                Platform.OS === 'android'
                  ? styles.AndroidShadow
                  : styles.IosShadow,
              ]}
              onPress={pickImage}
            >
              <IconR name="addfile" size={24} color={'black'} />
              <Text className="text-Black ml-1">Anexar uma foto do local</Text>
            </TouchableOpacity>
            {imageCamera !== null && (
              <Text className="self-center mt-4">Foto anexada com sucesso</Text>
            )}
            <View className="flex-row justify-between mt-auto">
              <TouchableOpacity
                className="w-28 h-12 bg-Green self-center items-center justify-center rounded-lg"
                onPress={() => navigation.goBack()}
              >
                <IconF name="close" size={32} color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity
                className="w-28 h-12 bg-Green self-center items-center justify-center rounded-lg flex-row"
                onPress={() => report()}
              >
                <IconF name="send" size={16} color={'white'} />
                <Text
                  style={{ fontFamily: 'Roboto_700Bold' }}
                  className="text-White ml-2 text-base"
                >
                  Enviar
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Pressable>
  )
}
