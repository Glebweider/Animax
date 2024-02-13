import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const DownloadIcon = ({ Color, Style, Width, Height }) => (
    <Svg
        width={Width}
        height={Height}
        viewBox="0 0 24 24"
        style={Style}>
        <Path
            fillRule="evenodd"
            fill={Color}
            d="M17 9V7h1a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3v-8a3 3 0 013-3h1v2H6a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1v-8a1 1 0 00-1-1h-1zm-3.955 2.047l1.171-1.157a1.054 1.054 0 011.478 0 1.024 1.024 0 010 1.46L12 15l-3.694-3.65a1.024 1.024 0 010-1.46 1.054 1.054 0 011.478 0l1.171 1.157V3.032C10.955 2.462 11.423 2 12 2s1.045.462 1.045 1.032v8.015z"
        />
    </Svg>
);

export default DownloadIcon;