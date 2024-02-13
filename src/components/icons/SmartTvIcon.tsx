import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SmartTvIcon = ({ Color, Style }) => (
    <Svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        style={Style}>
        <Path
            d="M23 7a3 3 0 00-3-3H4a3 3 0 00-3 3h2a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1h-5a1 1 0 100 2h5a3 3 0 003-3V7z"
            fill={Color}/>
        <Path
            d="M10.763 19.98c.529.136 1.073-.184 1.149-.724A9.001 9.001 0 001.782 9.083c-.54.073-.862.616-.729 1.146.133.529.67.843 1.213.786a7.025 7.025 0 017.716 7.75c-.06.542.252 1.08.781 1.216z"
            fill={Color}/>
        <Path
            d="M6.551 19.873c.482.253 1.088.07 1.243-.452a5 5 0 00-6.218-6.214c-.522.155-.705.762-.451 1.243.254.481.853.647 1.39.56a3.03 3.03 0 013.476 3.473c-.087.537.079 1.136.56 1.39zM4 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
            fill={Color}/>
    </Svg>
);

export default SmartTvIcon;