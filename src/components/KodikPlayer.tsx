import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { View } from 'react-native';

const KodikPlayer = ({ shikimoriInfo }) => {
    const [animeLink, setAnimeLink] = useState('');
    const webViewRef = useRef(null);

    const loadVideo = async () => {
        const token = '224223daa9903d240841e034e2be69e8';
        if (shikimoriInfo.id == 0) {
            return;
        }

        const response = await axios.get(`https://kodikapi.com/search?shikimori_id=${shikimoriInfo.id}&limit=1&token=${token}`);
        setAnimeLink(`https:${response.data.results[0]?.link}`) 
    };

    useEffect(() => {
        loadVideo()
    }, [shikimoriInfo])
  
    return (
        <View style={{width: 400, height: 300}}>
            <WebView
                style={{backgroundColor: '#181A20'}}
                ref={webViewRef}
                javaScriptEnabled
                source={{ html: `<iframe src=${animeLink} frameborder="0" style="border: 0; width: 100%; height: 100%;"></iframe>` }}
            />            
        </View>
    );
};
  
export default KodikPlayer;