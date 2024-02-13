import React from 'react';
import Svg, { Path } from 'react-native-svg';

const EyeOnIcon = ({ Color, Style }) => (
    <Svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={Style}>
        <Path
            fill={Color}
            d="M12.0002 5C9.89024 5 7.99432 5.92747 6.49128 7.00884C4.98034 8.0959 3.78013 9.40024 3.04026 10.2985C2.21965 11.2948 2.21965 12.7052 3.04026 13.7015C3.78013 14.5998 4.98034 15.9041 6.49128 16.9912C7.99432 18.0725 9.89024 19 12.0002 19C14.1101 19 16.006 18.0725 17.5091 16.9912C19.02 15.9041 20.2202 14.5998 20.9601 13.7015C21.7807 12.7052 21.7807 11.2948 20.9601 10.2985C20.2202 9.40025 19.02 8.0959 17.5091 7.00885C16.006 5.92747 14.1101 5 12.0002 5ZM12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10ZM8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z"/>
    </Svg>
);

export default EyeOnIcon;