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
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import IconR from '@expo/vector-icons/AntDesign'
import IconF from '@expo/vector-icons/FontAwesome'
import styles from './styles'
import CardLocation from '../../components/CardLocation'
import { RadioButton } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'

export default function ReportPage({ navigation, route }) {
  const [checked, setChecked] = useState('')
  const [imageCamera, setImageCamera] = useState(null)
  const [fontsLoaded] = useFonts({
    Roboto_100Thin_Italic,
    Roboto_500Medium,
    Roboto_700Bold,
  })

  if (!fontsLoaded) {
    return
  }
  const { title, image, numberReported } = route.params

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
  return (
    <View className="flex-1 justify-center">
      <Image
        className="w-full h-full"
        source={{
          uri: 'https://w0.peakpx.com/wallpaper/759/715/HD-wallpaper-park-trees-grass-green-nature.jpg',
        }}
      />
      <View className="w-11/12 h-5/6 bg-White absolute self-center p-6 flex-col rounded-xl">
        <CardLocation
          image={image}
          numberReported={numberReported}
          title={title}
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
            status={checked === 'parcial' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('parcial')}
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
            onPress={() => console.log('Foto enviada com sucesso!')}
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
