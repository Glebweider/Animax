import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlayIcon = ({ Color, Style }) => (
    <Svg
        width="16"
        height="16"
        viewBox="0 0 512 512"
        style={Style}>
        <Path
            d="M2321 5110c-497-48-990-251-1376-565-114-92-294-274-384-387-229-287-417-675-495-1023-49-218-60-325-60-575s11-357 60-575c79-355 272-749 509-1040 92-114 274-294 387-384 287-229 675-417 1023-495 218-49 325-60 575-60s357 11 575 60c261 58 603 204 828 353 389 259 688 599 893 1016 125 255 196 484 241 775 24 161 24 539 0 700-45 291-116 520-241 775-134 272-283 480-498 692-211 209-404 346-673 478-252 124-486 197-765 240-126 19-468 27-599 15zm-173-1608c45-22 1290-799 1316-821 27-24 56-86 56-121s-29-97-56-121c-26-22-1271-799-1316-821-20-10-52-18-70-18-48 0-109 39-135 85l-23 40v1670l23 40c26 46 87 85 135 85 18 0 50-8 70-18z"
            transform="matrix(.1 0 0 -.1 0 512)"
            fill={Color}/>
    </Svg>
);

export default PlayIcon;