import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const AddIcon = ({ Color, Style }) => (
    <Svg
        width="14"
        height="14"
        viewBox="0 0 512 512"
        style={Style}>
        <Path
            d="M2429 5107c-56-16-130-69-163-116-58-84-56-35-56-1122v-999h-948c-634 0-968-4-1008-11-152-27-249-143-249-299s97-272 249-299c40-7 374-11 1008-11h948l2-1007 3-1008 23-50C2291 71 2392 6 2520 5c129 0 221 61 279 185l26 55 3 1003 3 1002h988c662 0 1007 4 1047 11 273 49 344 399 112 555-31 21-69 36-111 43-47 8-341 9-1056 4l-991-6v1006c0 985 0 1007-20 1060-24 64-87 132-153 165-56 28-155 37-218 19z"
            transform="matrix(.1 0 0 -.1 0 512)"
            fill={Color}/>
    </Svg>
);

export default AddIcon;