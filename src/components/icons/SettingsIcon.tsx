import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

const SettingsIcon = ({ Color, Style }) => (
    <Svg
        width="40" 
        height="40" 
        viewBox="0 0 512.000000 512.000000"
        preserveAspectRatio="xMidYMid meet"
        style={Style}>
        <G 
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill={Color}>
            <Path d="M2328 4465 c-421 -51 -819 -246 -1124 -549 -576 -575 -727 -1453 -374 -2184 388 -804 1252 -1231 2130 -1052 415 85 816 331 1093 672 608 749 563 1827 -104 2532 -412 436 -1021 654 -1621 581z m577 -245 c503 -108 928 -431 1159 -880 286 -554 250 -1212 -93 -1722 -390 -579 -1078 -860 -1759 -718 -330 69 -627 234 -868 481 -228 235 -373 509 -446 842 -20 89 -22 131 -22 337 0 205 2 248 22 336 94 433 331 795 687 1049 107 77 314 181 441 223 79 27 236 62 329 76 17 2 125 3 240 1 169 -3 230 -7 310 -25z"/>
            <Path d="M1757 2736 c-50 -18 -85 -51 -108 -101 -48 -103 11 -225 123 -255 117 -32 231 58 232 181 0 126 -131 218 -247 175z"/>
            <Path d="M2517 2736 c-50 -18 -85 -51 -108 -101 -48 -103 11 -225 123 -255 117 -32 231 58 232 181 0 126 -131 218 -247 175z"/>
            <Path d="M3277 2736 c-50 -18 -85 -51 -108 -101 -48 -103 11 -225 123 -255 117 -32 231 58 232 181 0 126 -131 218 -247 175z"/>
        </G>
    </Svg>
);

export default SettingsIcon;