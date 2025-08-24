import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { Text, View } from 'react-native';

const KodikPlayer = ({ shikimoriId }: any) => {
    const [animeLink, setAnimeLink] = useState<string>('');
    const webViewRef = useRef(null);

    const loadVideo = async () => {
        if (!shikimoriId) return;

        try {
            const response = await fetch(
                `https://kodikapi.com/search?shikimori_id=${shikimoriId}&limit=1&token=${process.env.EXPO_PUBLIC_KODIK_API_KEY}`
            );
            const data = await response.json();

            if (data.results[0]?.link) {
                setAnimeLink(`https:${data.results[0].link}`);
            }
        } catch (err) {
            console.log('Error loading Kodik video:', err);
        }
    };

    useEffect(() => {
        loadVideo();
    }, [shikimoriId]);

    if (!animeLink) return <Text>Not Found</Text>;

    return (
        <WebView
            style={{ backgroundColor: '#181A20', flex: 1, marginTop: 20 }}
            containerStyle={{ width: '94%', height: 280 }}
            ref={webViewRef}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={false}
            source={{
                html: `
            <iframe src=${animeLink} 
                id="kodik-player"
                frameborder="0" 
                allowfullscreen 
                allow="autoplay *; fullscreen *" 
                style="border: 0; 
                width: 100%; 
                height: 250;
                border-radius: 20px;">
            </iframe>` }}
        />
    );
};

export default KodikPlayer;
