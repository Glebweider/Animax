import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ArrowLeftIcon = ({ Color, Style }) => (
    <Svg
        width="20"
        height="20"
        viewBox="0 0 512 512"
        style={Style}>
        <Path
            d="M2477 5102C2429 5080 34 2689 14 2643c-18-42-18-125 0-166C34 2431 2429 40 2477 18c98-45 222 1 274 103 23 46 25 125 4 177-11 26-312 334-1023 1045L725 2350h2115c2037 0 2116 1 2155 19 164 76 166 298 3 382-36 19-91 19-2155 19H725l1007 1008c711 710 1012 1018 1023 1044 8 21 15 60 15 88 0 149-159 253-293 192z"
            transform="matrix(.1 0 0 -.1 0 512)"
            fill={Color}/>
    </Svg>
);

export default ArrowLeftIcon;