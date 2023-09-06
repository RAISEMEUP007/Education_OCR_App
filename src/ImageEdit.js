import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Button,
  Text,
  Image,
  View,
  ActivityIndicator,
} from 'react-native';
import { Storage } from 'aws-amplify';
import { RNS3 } from 'react-native-aws3';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import { S3, Textract } from 'aws-sdk';
import { TextractClient, GetDocumentAnalysisCommand } from '@aws-sdk/client-textract';
import { BlockStruct,Document } from '@scribelabsai/amazon-trp';
var RNFS = require('react-native-fs');
const photoName = 'pasta-1.jpg'; 

const uploadPicture = async (tmpURI) => {

  const NEILaccessKeyId = "AKIAYOAL4GG6VS3UEXUT";
  const NEILsecretAccessKey = "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";
  const NEILregion = "eu-central-1";

  const options = {
    /* keyPrefix: 'uploads/', */
    bucket: "friend-mine",
    region: NEILregion,
    accessKey: NEILaccessKeyId,
    secretKey: NEILsecretAccessKey,
    successActionStatus: 201,
  };
  const file = {
    uri: tmpURI,
    name: photoName,
    type: 'image/jpeg',
  };
  const response = await RNS3.put(file, options).then(response => {
    if (response.status !== 201) {
      throw new Error("FAILURE: Failed to upload image to S3!");
    }
    else {
      console.log(
        "SUCCESS: Successfully uploaded image to S3! \n\tS3 Bucket URL: ",
        response.body.postResponse.location
      );
    }
  })
  .catch(error => { console.log(error) })
  .progress((e) => console.log(e.loaded / e.total));
  return photoName;
}

const getTextractAnalysis = async () => {
  const NEILaccessKeyId = "AKIAYOAL4GG6VS3UEXUT";
  const NEILsecretAccessKey = "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";
  const NEILregion = 'eu-central-1';

  //hard code AWS credentials
  AWS.config.update({
    accessKeyId: NEILaccessKeyId,
    secretAccessKey: NEILsecretAccessKey,
    region: NEILregion
  });

  // const params = {
  //   Document: {
  //     S3Object: {
  //       Bucket: 'friend-mine',
  //       Name: photoName
  //     },
  //   },
  // };
  const params = {
    Document: {
      S3Object: {
        Bucket: 'friend-mine',
        Name: 'image.png'
      },

    },     
     FeatureTypes:["FORMS"]
  };
  var lowercaseArray = [];
  var textract = new AWS.Textract({ region: 'eu-central-1' });
  const response = await textract.analyzeDocument(params, (err, data) => {
    if (err) {
      console.log('FAILURE: Error analyzing photo:', err);
    } else {
      // // detectDocumentText() --> detects text in a document
      console.log("Got response from Textract! Now parsing...");    
      const blocks = data.Blocks;
      const doc = new Document(blocks as BlockStruct[]);

      doc.pages.forEach((p) => {
        p.tables.forEach((t) => {
          console.log(t);
        });
      });

      //  lowercaseArray = blocks.map(item => item.Text)
      // var textArray = []
      // for (let i = 0; i < blocks.length; i++) {
      //   if(blocks[i].BlockType === 'LINE') {
      //     textArray.push(blocks[i].Text);
      //   }
      // }
      // lowercaseArray = textArray.map(function(item){
      //   return item.toLowerCase();
      // })
       console.log(lowercaseArray);
      
    }
  });
  return lowercaseArray;
}

const ImageEdit = ({navigation, route}) => {  
  const [path, setPath] = useState(route.params.path);
  const [textract_res, setTextract] = useState(3);
  const editImage = async (src ) => {
    console.log(src);    
    const pictureDirectory = RNFS.PicturesDirectoryPath;
    await RNFS.mkdir(pictureDirectory);
    // // Move picture to pictureDirectory
    const filenames = src.split('/');

    await RNFS.moveFile(
      src,
      `${pictureDirectory}/${filenames[filenames.length - 1]}`,
    );

   let imageURI = `${pictureDirectory}/${filenames[filenames.length - 1]}`;  
      
  
   console.log(imageURI);    
   setPath(imageURI);
   const uploadedPictureKey = await uploadPicture("file://"+imageURI);
   console.log(`The picture was uploaded with the key: ${uploadedPictureKey}`);
   const lowercaseArray = await getTextractAnalysis();

   setTextract(lowercaseArray);


  };
  useEffect(() => {
    editImage(route.params.path, route.params.cropData);
  }, [route.params]);
  return (
    <>
      <View
        style={{
          display: 'flex',
          flex: 1,
          padding: 5,
        }}>
        <View style={{flex: 5, paddingVertical: 5}}>
          
          <Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
            source={{uri: 'file://' + path}}>              
           </Image>
        </View>
        <View style={{flex: 5, paddingVertical: 5}}>  
            <Text title2>{textract_res}</Text>
        </View>

        <View>
          <Button
            title="Submit"
            onPress={() => {
              navigation.push('OCR', {path: path});
            }}></Button>
            
            
        </View>
      </View>
   

     
    </>
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
