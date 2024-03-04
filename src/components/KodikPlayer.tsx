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
        <WebView
            style={{backgroundColor: '#181A20', flex: 1, marginTop: 25}}
            containerStyle={{ width: '92%', height: 300, borderRadius: 10 }}
            ref={webViewRef}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={false}
            source={{ html: `
            <iframe src=${animeLink} 
                id="kodik-player"
                frameborder="0" 
                allowfullscreen 
                allow="autoplay *; fullscreen *" 
                style="border: 0; 
                width: 100%; 
                height: 300;">
            </iframe>` }}
        />            
    );
};
  
export default KodikPlayer;