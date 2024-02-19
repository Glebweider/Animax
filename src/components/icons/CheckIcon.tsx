import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CheckIcon = ({ Color, Style, Width, Height }) => (
    <Svg
        width={Width}
        height={Height}
        viewBox="0 0 512 512"
        style={Style}>
        <Path
            d="M4025 3854c-93-21-65 7-1016-1035-502-550-916-998-921-997-4 2-207 217-451 478-310 334-454 481-482 495-158 77-340-78-291-248 15-50 50-90 566-638 368-391 563-591 591-606 87-47 171-21 257 78 27 32 476 526 998 1099s957 1058 966 1078c42 90 3 225-77 268-42 23-106 35-140 28z"
            transform="matrix(.1 0 0 -.1 0 512)"
            fill={Color}/>
    </Svg>
);

export default CheckIcon;