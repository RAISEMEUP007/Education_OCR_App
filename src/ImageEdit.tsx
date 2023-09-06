import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Button,
  Text,
  Image,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';
import OpenCV from './NativeModules/OpenCV';
var RNFS = require('react-native-fs');

const ImageEdit = ({ navigation, route }: { navigation: any, route: any }) => {
  const [path, setPath] = useState<string>(route.params.path);
  const [textractRes, setTextract] = useState<string | number>(3);
  const [ocr, setOcr] = useState(null);

  useEffect(() => {
      const editImage = async (src: string) => {
          const pictureDirectory = RNFS.PicturesDirectoryPath;
          await RNFS.mkdir(pictureDirectory);
          
          const filenames = src.split('/');

          await RNFS.moveFile(
          src,
          `${pictureDirectory}/${filenames[filenames.length - 1]}`,
          );

          const imageURI = `${pictureDirectory}/${filenames[filenames.length - 1]}`;

          console.log(imageURI);    
          setPath(imageURI);
          
      };

      editImage(route.params.path);
  }, [route.params]);

  // const proceedWithCheckingBlurryImage() {
  //   const { content, photoPath } = this.state.photoAsBase64;

  //   this.checkForBlurryImage(content).then(blurryPhoto => {
  //     if (blurryPhoto) {
  //       this.refs.toast.show('Photo is blurred!',DURATION.FOREVER);
  //       return this.repeatPhoto();
  //     }
  //     this.refs.toast.show('Photo is clear!', DURATION.FOREVER);
  //     this.setState({ photoAsBase64: { ...this.state.photoAsBase64, isPhotoPreview: true, photoPath } });
  //   }).catch(err => {
  //     console.log('err', err)
  //   });
  // }


  // const checkForBlurryImage(imageAsBase64) {
  //   return new Promise((resolve, reject) => {
  //     if (Platform.OS === 'android') {
  //       OpenCV.checkForBlurryImage(imageAsBase64, error => {
  //         // error handling
  //       }, msg => {
  //         resolve(msg);
  //       });
  //     } else {
  //       OpenCV.checkForBlurryImage(imageAsBase64, (error, dataArray) => {
  //         resolve(dataArray[0]);
  //       });
  //     }
  //   });
  // }
  return (
    <View style={{ display: 'flex', flex: 1, padding: 5 }}>
      <View style={{ flex: 5, paddingVertical: 10 }}>
        <Image
          style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          source={{ uri: 'file://' + path }}
        />
      </View>
      <View>
        <Button
          title="Submit"
          onPress={() => {
            navigation.push('OCR', { path: path });
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      marginTop: 50,
  },
  text: {
      fontSize: 10,
  },
  red: {
      color: '#0000aa',
      fontSize: 12,
  },
});

export default ImageEdit;