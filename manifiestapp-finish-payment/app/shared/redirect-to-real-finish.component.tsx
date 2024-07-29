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
        let text = `This message is only for the seller, if you are the client, you don't need to pay attention and you can close this page`;
        switch (currentLang) {
            case 'fr':
                text = `Ce message s'adresse uniquement au vendeur, si vous êtes le client, vous n'avez pas besoin d'y prêter attention. Vous pouvez fermer la page.`;
                break;
            case 'nl':
                text = `Dit bericht is alleen voor de verkoper, als je de klant bent, hoef je niet op te letten. U kunt de pagina sluiten`;
                break;
        }
        return text;
    }

    function getContinueText() {
        const currentLang = languageCode.slice(0, 2);
        let text = `You are the seller ? Continue here to finish the selling please!`;
        switch (currentLang) {
            case 'fr':
                text = `Vous êtes le vendeur ? Continuez ici pour finir la vente svp !`;
                break;
            case 'nl':
                text = `Ga hier verder om de verkoop af te ronden a.u.b!`;
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