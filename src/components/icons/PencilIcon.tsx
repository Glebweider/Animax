import * as React from 'react';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

const PencilIcon = ({ Color, Width, Height }) => (
    <Svg
        width={Width}
        height={Height}
        viewBox="0 0 512 512">
        <Path
            fill={Color}
            d="M494.56,55.774l-38.344-38.328c-23.253-23.262-60.965-23.253-84.226,0l-35.878,35.878l122.563,122.563
            l35.886-35.878C517.814,116.747,517.814,79.044,494.56,55.774z"/>
        <Polygon
            fill={Color}
            points="0,389.435 0,511.998 122.571,511.998 425.246,209.314 302.691,86.751"/>
    </Svg>
);

export default PencilIcon;