import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SortIcon = ({ Color, Style }) => (
    <Svg
        width="24"
        height="24"
        viewBox="0 0 512 512"
        style={Style}
        >
        <Path
            d="M4035 4601c-237-40-465-170-606-349-67-85-151-247-172-332l-13-55-1555-5-1554-5-38-24c-21-13-50-42-65-64-23-34-27-52-27-107s4-73 27-107c15-22 44-51 65-64l38-24 1554-5 1555-5 13-55c21-85 105-247 172-332 119-150 319-279 511-329 123-32 329-33 455-1 270 68 502 256 625 507 71 144 94 247 94 415s-23 271-94 415c-122 249-357 440-620 505-94 24-283 34-365 21zm309-420c165-58 291-185 348-349 32-95 32-249 0-344-56-164-180-288-348-350-85-31-263-31-348 0-168 62-292 186-348 350-18 53-23 89-23 172s5 119 23 172c65 188 219 324 417 368 64 14 212 4 279-19zM761 2389c-294-63-531-247-661-514-71-144-94-247-94-415s23-271 94-415c122-250 356-439 625-507 126-32 332-31 455 1 192 50 392 179 511 329 67 85 151 247 172 332l13 55 1555 5 1554 5 38 24c21 13 50 42 65 64 23 34 27 52 27 107s-4 73-27 107c-15 22-44 51-65 64l-38 24-1554 5-1555 5-13 55c-21 85-105 247-172 332-119 150-321 280-511 329-125 31-297 35-419 8zm363-408c165-58 291-185 348-349 32-95 32-249 0-344-56-164-180-288-348-350-85-31-263-31-348 0-168 62-292 186-348 350-32 95-32 249 0 344 65 188 219 324 417 368 64 14 212 4 279-19z"
            transform="matrix(.1 0 0 -.1 0 512)"
            fill={Color}/>
    </Svg>
);

export default SortIcon;