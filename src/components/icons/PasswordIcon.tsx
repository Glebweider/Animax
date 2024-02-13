import * as React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const PaswordIcon = ({ Color, Style }) => (
    <Svg
        width="25"
        height="25"
        viewBox="0 0 1309.443 1658.036"
        style={Style}>
        <Path
            fill={Color}
            d="M1124.664,644.322H184.779c-80.353,0-145.493,65.139-145.493,145.493v693.711c0,80.354,65.139,145.493,145.493,145.493
            h939.885c80.353,0,145.493-65.139,145.493-145.493V789.814C1270.157,709.461,1205.017,644.322,1124.664,644.322z M717.651,1149.325
            c1.166,4.857,1.801,9.915,1.801,15.117v124.451c0,35.832-29.317,65.148-65.148,65.148c-35.832,0-65.149-29.317-65.149-65.148
            v-124.451c0-5.356,0.668-10.562,1.902-15.551c-35.921-21.626-59.951-60.993-59.951-105.976
            c0-68.271,55.345-123.615,123.615-123.615c68.271,0,123.615,55.344,123.615,123.615
            C778.337,1088.203,753.978,1127.795,717.651,1149.325z"/>
        <Path
            fill={Color}
            d="M800.192,53.478c-46.481-16.909-94.021-24.534-142.199-24.459c-48.178-0.075-102.262,7.55-148.743,24.459
            c-216.571,78.787-295.237,273.21-284.399,530.585h179.785c-10.095-177.358,35.728-296.867,147.728-347.915
            c64.887-29.574,139.826-29.574,204.713,0c112,51.047,157.823,170.556,147.728,347.915h179.785
            C1095.429,326.688,1016.764,132.265,800.192,53.478z"/>
    </Svg>
);

export default PaswordIcon;