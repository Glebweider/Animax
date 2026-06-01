// Data
import { ICON_APPLE, ICON_FACEBOOK, ICON_GOOGLE } from '@Data/constants';

// Utils
import { facebookAuth, googleAuth, appleAuth } from '@Utils/functions';


export const authMethods = [
    {
        "id": "FACEBOOK",
        "text": "Continue with Facebook",
        "icon": {
            "image": ICON_FACEBOOK,
            "width": 30,
            "height": 30
        },
        "onPress": facebookAuth,
    },
    {
        "id": "GOOGLE",
        "text": "Continue with Google",
        "icon": {
            "image": ICON_GOOGLE,
            "width": 25,
            "height": 25
        },
        "onPress": googleAuth,
    },
    {
        "id": "APPLE",
        "text": "Continue with Apple",
        "icon": {
            "image": ICON_APPLE,
            "width": 25,
            "height": 31
        },
        "onPress": appleAuth,
    }
];
