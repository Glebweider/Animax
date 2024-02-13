import React from 'react';
import Svg, { Path } from 'react-native-svg';

const EyeOffIcon = ({ Color, Style }) => (
    <Svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={Style}>
        <Path
            fill={Color}
            d="M2.29289 2.29289C2.68342 1.90237 3.31658 1.90237 3.70711 2.29289L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L2.29289 3.70711C1.90237 3.31658 1.90237 2.68342 2.29289 2.29289Z"/>
        <Path
            fill={Color}
            d="M7.14912 6.56333C6.92238 6.70734 6.70294 6.85657 6.49128 7.00884C4.98034 8.0959 3.78013 9.40024 3.04026 10.2985C2.21965 11.2948 2.21965 12.7052 3.04026 13.7015C3.78013 14.5998 4.98034 15.9041 6.49128 16.9912C7.99432 18.0725 9.89024 19 12.0002 19C14.1101 19 16.006 18.0725 17.5091 16.9912C17.5222 16.9817 17.5354 16.9722 17.5485 16.9627L15.1062 14.5204C14.3728 15.4232 13.2538 16 12 16C9.79086 16 8 14.2091 8 12C8 10.7462 8.57683 9.6272 9.47958 8.89379L7.14912 6.56333ZM15.9627 12.5485C15.9873 12.3692 16 12.1861 16 12C16 9.79086 14.2091 8 12 8C11.8139 8 11.6308 8.01271 11.4515 8.03729L9.55224 6.13802C9.29802 5.88381 9.38795 5.45339 9.7319 5.34875C10.4518 5.12974 11.211 5 12.0002 5C14.1101 5 16.006 5.92747 17.5091 7.00885C19.02 8.0959 20.2202 9.40025 20.9601 10.2985C21.7807 11.2948 21.7807 12.7052 20.9601 13.7015C20.5739 14.1703 20.0624 14.7498 19.4467 15.3512C19.2543 15.5392 18.9473 15.533 18.7571 15.3429L15.9627 12.5485ZM10.9092 10.3234C10.3618 10.6802 10 11.2979 10 12C10 13.1046 10.8954 14 12 14C12.7021 14 13.3198 13.6382 13.6766 13.0908L10.9092 10.3234Z"/>
   </Svg>
);

export default EyeOffIcon;