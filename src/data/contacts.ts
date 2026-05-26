// Icons
import DiscordIcon from '@Icons/DiscordIcon';
import WebSiteIcon from '@Icons/WebSiteIcon';
import XIcon from '@Icons/XIcon';
import WhatsAppIcon from '@Icons/WhatsAppIcon';

export const CONTACT_ITEMS = [
    {
        name: 'Discord',
        url: process.env.EXPO_PUBLIC_CONTACTS_DISCORD,
        Icon: DiscordIcon,
        size: 25,
        marginRight: 18,
    },
    {
        name: 'Website',
        url: process.env.EXPO_PUBLIC_CONTACTS_WEBSITE,
        Icon: WebSiteIcon,
        size: 25,
        marginRight: 18,
    },
    {
        name: 'X',
        url: process.env.EXPO_PUBLIC_CONTACTS_X,
        Icon: XIcon,
        size: 25,
        marginRight: 18,
    },
    {
        name: 'WhatsApp',
        url: process.env.EXPO_PUBLIC_CONTACTS_WHATSAPP,
        Icon: WhatsAppIcon,
        size: 27,
        marginRight: 16,
    },
];