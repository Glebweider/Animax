import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';

//Icons
import DiscordIcon from '@Icons/DiscordIcon';
import WebSiteIcon from '@Icons/WebSiteIcon';
import TwitterIcon from '@Icons/TwitterIcon';
import WhatsAppIcon from '@Icons/WhatsAppIcon';

const ContactUs = () => {
  
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={() => Linking.openURL('https://discord.gg/animelandia-926550837172514876')}
                style={styles.contactContainer}>
                    <DiscordIcon 
                        Color='#06C149'
                        Style={{
                            marginLeft: 26, 
                            marginRight: 18,
                        }}
                        Width={25} 
                        Height={25} />
                    <Text style={styles.contactText}>Discord</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => Linking.openURL('https://google.com')}
                style={styles.contactContainer}>
                    <WebSiteIcon 
                        Color='#06C149'
                        Style={{
                            marginLeft: 26, 
                            marginRight: 18,
                        }}
                        Width={25} 
                        Height={25} />
                    <Text style={styles.contactText}>Website</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => Linking.openURL('https://x.com')}
                style={styles.contactContainer}>
                    <TwitterIcon
                        Color='#06C149'
                        Style={{
                            marginLeft: 26, 
                            marginRight: 18,
                        }}
                        Width={25} 
                        Height={25} />
                    <Text style={styles.contactText}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => Linking.openURL('https://www.whatsapp.com/')}
                style={styles.contactContainer}>
                    <WhatsAppIcon
                        Color='#06C149'
                        Style={{
                            marginLeft: 26, 
                            marginRight: 16,
                        }}
                        Width={27} 
                        Height={27} />
                    <Text style={styles.contactText}>WhatsApp</Text>
            </TouchableOpacity>
        </View>           
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        marginTop: 24,
        gap: 14
    },
    contactContainer: {
        width: '92%',
        height: 72,
        backgroundColor: '#1F222A',
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
    },
    contactText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Outfit',
    }
});
  
export default ContactUs;