import React, { useState } from 'react'
import {
  Image,
  Text,
  View,
  Platform,
  TouchableOpacity,
  TextInput,
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
import { gql, useMutation, useQuery } from '@apollo/client'
import { getSinglePoint } from '../PointAbout/types'
import { getStatusOfOneLocation } from '../../utils/getLocationStatus'
import { LocationStatus } from '../../@types/locationStatus'
import { PropsResponseImage } from './types'
import { useAuth } from '@clerk/clerk-expo'

const getCollectPoint = gql`
  query MyQuery($id: ID) {
    collectPoint(where: { id: $id }) {
      id
      street
      placeCollectTypes
      collectDays {
        day
        initialCollectTimeInMinutes
        finalCollectTimeInMinutes
      }
      name
      placeImages {
        url
      }
      reports {
        locationStatusType
      }
    }
  }
`

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
  const { id, distance } = route.params
  const { data } = useQuery<getSinglePoint>(getCollectPoint, { variables: id })
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
      },
    },
  )

  const [checked, setChecked] = useState('')
  const [imageCamera, setImageCamera] = useState(null)
  const [description, setDescription] = useState('')
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
    const data = await postImageImgur()

    console.log({
      variables: {
        description,
        locationImageUrl: data.data.link,
        locationStatusType: checked,
        userId,
        locationId: id.id,
      },
    })

    await createReport({
      variables: {
        description,
        locationImageUrl: data.data.link,
        userId,
        locationStatusType: checked,
        locationId: id.id,
      },
    })

    console.log(JSON.stringify('data:', reportDataResponse))
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
    <View className="flex-1 justify-center min-h-[90vh]">
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
          image={data.collectPoint.placeImages[0].url}
          status={status}
          title={data.collectPoint.name}
        />
        <View
          className="w-full h-28 bg-White rounded-xl flex-row px-2 py-1 my-6"
          style={[
            Platform.OS === 'android' ? styles.AndroidShadow : styles.IosShadow,
          ]}
        >
          <TextInput
            className="w-full h-10"
            placeholder="Escreva uma breve descrição de como está o local"
            multiline
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
        <TouchableOpacity
          className="mt-10 w-60 h-16 bg-White self-center items-center justify-center rounded-lg flex-row"
          style={[
            Platform.OS === 'android' ? styles.AndroidShadow : styles.IosShadow,
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
      </View>
    </View>
  )
}
