'use client'

import { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import Link from 'next/link';


export default function RedirectToRealFinish({ props }) {
    const [languageCode, setLanguageCode] = useState<string>('en');

    useEffect(() => {
        Device.getLanguageCode().then(languageCode => {
            setLanguageCode(languageCode.value);
        })
    }, []);

    function getNotForClientText() {
        const currentLang = languageCode.slice(0, 2);
        let text = `This message is only for the seller, if you are the client, you don't need to pay attention.`;
        switch (currentLang) {
            case 'fr':
                text = `Ce message s'adresse uniquement au vendeur, si vous êtes le client, vous n'avez pas besoin d'y prêter attention.`;
                break;
            case 'nl':
                text = `Dit bericht is alleen voor de verkoper, als je de klant bent, hoef je niet op te letten.`;
                break;
        }
        return text;
    }

    function getContinueText() {
        const currentLang = languageCode.slice(0, 2);
        let text = `You are the seller ? Click here to finish the selling please!`;
        switch (currentLang) {
            case 'fr':
                text = `Vous êtes le vendeur ? Cliquez ici pour finir la vente svp !`;
                break;
            case 'nl':
                text = `Bent u de verkoper? Klik hier om de verkoop af te ronden a.u.b.!`;
                break;
        }
        return text;
    }

    return (
        <div>
            <h3>{getNotForClientText()}</h3>
            <Link href={{
                pathname: '/next-payment',
                query: { t: props.vivaWalletTransactionId },
            }}>
                <button type='button'>
                    <h1>{getContinueText()}</h1>
                </button>
            </Link>
        </div>
    )
}
