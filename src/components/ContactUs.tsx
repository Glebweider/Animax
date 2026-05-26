import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';

// Data
import { COLOR_BACKGROUND_SECONDARY, COLOR_PRIMARY, COLOR_TEXT_PRIMARY } from '@Data/constants';
import { CONTACT_ITEMS } from '@Data/contacts';


const ContactUs = () => {
    const handlePress = async (url?: string) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error(`Не удалось открыть ссылку: ${url}`, error);
        }
    };

    return (
        <View style={styles.container}>
            {CONTACT_ITEMS.map(({ name, url, Icon, size, marginRight }) => {
                return (
                    <TouchableOpacity
                        key={name}
                        onPress={() => handlePress(url)}
                        style={styles.contactContainer}
                        activeOpacity={0.7}>
                        <Icon
                            Color={COLOR_PRIMARY}
                            Width={size}
                            Height={size}
                            Style={{
                                marginLeft: 26,
                                marginRight: marginRight,
                            }} />
                        <Text style={styles.contactText}>{name}</Text>
                    </TouchableOpacity>
                );
            })}
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
        backgroundColor: COLOR_BACKGROUND_SECONDARY,
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
    },
    contactText: {
        color: COLOR_TEXT_PRIMARY,
        fontSize: 15,
        fontFamily: 'Outfit',
    }
});

export default ContactUs;