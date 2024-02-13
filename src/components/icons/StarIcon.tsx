import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const StarIcon = ({ Color, Style }) => (
    <Svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={Color}
        style={Style}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 3C9.964 3 9.771 6.547 8.56 7.8c-1.213 1.253-4.982-.18-5.505 2.044-.523 2.225 2.867 2.98 3.285 4.89.42 1.909-1.65 4.59.12 5.926 1.77 1.334 3.674-1.685 5.54-1.685s3.77 3.019 5.54 1.685c1.77-1.335-.3-4.017.12-5.927.419-1.909 3.808-2.664 3.285-4.889-.522-2.224-4.292-.791-5.503-2.044C14.23 6.547 14.036 3 12 3z"
            strokeLinecap="round"
            strokeLinejoin="round"/>
    </Svg>
);

export default StarIcon;