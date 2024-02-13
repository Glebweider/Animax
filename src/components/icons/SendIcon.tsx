import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

const SendIcon = ({ Color, Style }) => (
    <Svg
        width="25"
        height="25"
        viewBox="0 0 24 24"
        style={Style}
        fill='none'>
        <G
            stroke={Color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round">
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.493 12.438S-.483 9.961 3.68 7.558C7.19 5.531 19.295 2.045 20.986 2.946c.9 1.69-2.585 13.795-4.613 17.307-2.402 4.162-4.88-7.815-4.88-7.815z"/>
            <Path d="M11.493 12.438l9.493-9.492" />
        </G>
    </Svg>
);

export default SendIcon;