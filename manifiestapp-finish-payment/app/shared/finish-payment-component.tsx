'use client'

import { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import RedirectToApp from './redirect-to-app';

export default function FinishPaymentComponent({props}) {
    const [languageCode, setLanguageCode] = useState<string>('en');

    useEffect(() => {
        Device.getLanguageCode().then(languageCode => {
            setLanguageCode(languageCode.value);
        })
    }, []);

    function getFinishText() {
        const currentLang = languageCode.slice(0, 2);
        let text = props.messages?.en;
        switch (currentLang) {
            case 'fr':
                text = props.messages?.fr;
                break;
            case 'nl':
                text = props.messages?.nl;
                break;
        }
        return text;
    }

    function getNotForClientText() {
        const currentLang = languageCode.slice(0, 2);
        let text = `This message is only for the seller, if you are the client, you don't need to pay attention`;
        switch (currentLang) {
            case 'fr':
                text = `Ce message s'adresse uniquement au vendeur, si vous êtes le client, vous n'avez pas besoin d'y prêter attention.`;
                break;
            case 'nl':
                text = `Dit bericht is alleen voor de verkoper, als je de klant bent, hoef je niet op te letten`;
                break;
        }
        return text;
    }

    return (
        <div>
            <h1 className={props.error ? 'text-error' : ''}>{getFinishText()}</h1>
            <h4>{getNotForClientText()}</h4>
            <RedirectToApp />
        </div>
    )
}