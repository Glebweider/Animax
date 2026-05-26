import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// Data
import { COLOR_PRIMARY, COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY } from '@Data/constants';

// Utils
import { i18n } from '@Utils/localization';


export const ReleaseAnimeCard = React.memo(
    ({ isSelected, onPress, item }: any) => {
        return (
            <TouchableOpacity
                style={isSelected ? styles.containerEnabled : styles.containerDisabled}
                onPress={() => onPress(item)}>
                <Text style={isSelected ? styles.textWeekEnabled : styles.textWeekDisabled}>
                    {item.dayOfWeek && i18n.t(`release.${item.dayOfWeek}`)}
                </Text>
                <Text style={isSelected ? styles.textMonthEnabled : styles.textMonthDisabled}>
                    {item.dayOfMonth}
                </Text>
            </TouchableOpacity>
        );
    },
    (prevProps, nextProps) => prevProps.isSelected === nextProps.isSelected
);

const styles = StyleSheet.create({
    containerEnabled: {
        margin: 7.5,
        width: 50,
        height: 78,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLOR_PRIMARY,
        backgroundColor: COLOR_PRIMARY,
        borderRadius: 50,
    },
    containerDisabled: {
        margin: 7.5,
        width: 50,
        height: 78,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLOR_TEXT_SECONDARY,
        borderRadius: 50,
    },
    textWeekEnabled: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 12,
    },
    textMonthEnabled: {
        color: COLOR_TEXT_PRIMARY,
        fontFamily: 'Outfit',
        fontSize: 15,
    },
    textWeekDisabled: {
        color: COLOR_TEXT_SECONDARY,
        fontFamily: 'Outfit',
        fontSize: 12,
    },
    textMonthDisabled: {
        color: COLOR_TEXT_SECONDARY,
        fontFamily: 'Outfit',
        fontSize: 15,
    },
});