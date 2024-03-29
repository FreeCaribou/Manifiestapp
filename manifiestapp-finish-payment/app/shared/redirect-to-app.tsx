'use client'

import { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';

type osType = 'ios' | 'android' | 'windows' | 'mac' | 'unknown';

function Redirection({ os, language }) {
    const [text, setText] = useState<string>('Continue to sell ticket');
    const [url, setUrl] = useState<string>(process.env.NEXT_PUBLIC_MANIFIESTAPP_URL);

    useEffect(() => {
        if (os === 'ios') {
            setUrl(process.env.NEXT_PUBLIC_IOS_REDIRECT);
        } else if (os === 'android') {
            setUrl(process.env.NEXT_PUBLIC_ANDROID_REDIRECT);
        }
    }, [os]);

    useEffect(() => {
        if (language.slice(0, 2) === 'fr') {
            setText('Continuer à vendre des tickets');
        } else if (language.slice(0, 2) === 'nl') {
            setText('Tickets blijven verkopen');
        }
    }, [language]);

    return (
        <a href={url}>
            <h2>{text}</h2>
        </a>
    )
}

export default function RedirectToApp() {
    const [os, setOs] = useState<osType>('unknown');
    const [languageCode, setLanguageCode] = useState<string>('en');

    useEffect(() => {
        Device.getInfo().then(info => {
            setOs(info.operatingSystem);
        });
        Device.getLanguageCode().then(languageCode => {
            setLanguageCode(languageCode.value);
        })
    }, []);

    return (
        <div>
            <Redirection os={os} language={languageCode} />
        </div>
    )
}