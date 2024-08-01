import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ArrowRightIcon = ({ Color, Width, Height, }) => (
    <Svg
        width={Width}
        height={Height}
        viewBox="0 0 24 24"
        fill="none">
        <Path
            d="M9.71 18.293a1 1 0 001.415 0l4.887-4.892a2 2 0 000-2.828l-4.89-4.89a1 1 0 00-1.415 1.414l4.186 4.185a1 1 0 010 1.415L9.71 16.879a1 1 0 000 1.414z"
            fill={Color}/>
    </Svg>
);

export default ArrowRightIcon;