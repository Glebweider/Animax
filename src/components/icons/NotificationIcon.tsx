import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const NotificationIcon = ({ Color, Style, Width, Height }) => (
    <Svg
        viewBox="0 0 24 24"
        width={Width}
        height={Height}
        fillRule="evenodd"
        clipRule="evenodd"
        fill={Color}
        style={Style}>
        <Path 
            strokeWidth="1.5" 
            strokeLinecap="round"
            strokeLinejoin="round" 
            d="M5.25 9.5v2.798a1.75 1.75 0 01-.657 1.367l-.914.731a2.477 2.477 0 00-.929 1.934c0 .774.308 1.517.855 2.065a2.924 2.924 0 002.065.855h12.66c.774 0 1.517-.308 2.065-.855a2.924 2.924 0 00.855-2.065c0-.753-.342-1.464-.929-1.934l-.914-.731a1.75 1.75 0 01-.657-1.367V9.5a6.75 6.75 0 10-13.5 0zm1.5 0a5.25 5.25 0 0110.5 0v2.798c0 .988.449 1.922 1.22 2.538l.914.731a.98.98 0 01.366.763 1.42 1.42 0 01-1.42 1.42H5.67a1.42 1.42 0 01-1.42-1.42.98.98 0 01.366-.763l.914-.731a3.248 3.248 0 001.22-2.538V9.5zM13.124 19.949A2.233 2.233 0 0112 20.25c-.409 0-.793-.109-1.124-.301a.751.751 0 00-.752 1.298A3.73 3.73 0 0012 21.75a3.73 3.73 0 001.876-.503.75.75 0 00-.752-1.298z" />
    </Svg>
);

export default NotificationIcon;