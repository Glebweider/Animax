import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CrownIcon = ({ Color, Width, Height }) => (
    <Svg
        width={Width}
        height={Height}
        viewBox="-2 -4 24 24"
        preserveAspectRatio="xMinYMin">
        <Path 
            d="M2.049 1.802L5.854 5.15 9.244.976a1 1 0 011.565.017l3.235 4.156 3.928-3.396a1 1 0 011.643.9L18.115 13H1.922L.399 2.7a1 1 0 011.65-.898zM2 14h16v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1z"
            fill={Color} />
    </Svg>
);

export default CrownIcon;