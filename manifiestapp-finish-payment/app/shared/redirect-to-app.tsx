'use client'

import { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';

type osType = 'ios' | 'android' | 'windows' | 'mac' | 'unknown';

function Redirection({ os, language }) {
    if (os === 'ios') {
        return <p>TODO return to iOS app if present</p>
    } else if (os === 'android') {
        return <a href={process.env.NEXT_PUBLIC_ANDROID_REDIRECT}>Open the app</a>
    }
    return <a href={process.env.NEXT_PUBLIC_MANIFIESTAPP_URL}>Continue to sell ticket</a>
}

export default function RedirectToApp() {
    const [os, setOs] = useState<osType>('unknown');
    const [languageCode, setLanguageCode] = useState<string>('en');

    useEffect(() => {
        Device.getInfo().then(info => {
            console.log('info device', info);
            setOs(info.operatingSystem);
        });
        Device.getLanguageCode().then(languageCode => {
            console.log('language code', languageCode);
            setLanguageCode(languageCode.value);
        })
    }, []);

    return (
        <div>
            <Redirection os={os} language={languageCode} />
        </div>
    )
}