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
        let text = props.error ?
            `There is an error - ${props.ticket?.message ? props.ticket?.message[0] : 'unkown'} - ERR CODE ${props.ticket?.code}`
            : `Congratulations, the tickets is selling - REF ${props.ticket?.data?.order?.reference} - You have sold ${props.ticket?.data?.totalTicketsForThisEditionForThisSeller} tickets`;
        switch (currentLang) {
            case 'fr':
                text = props.error ?
                `Une erreur est survenu - ${props.ticket?.message ? props.ticket?.message[0] : 'unkown'} - ERR CODE ${props.ticket?.code}`
                : `Félicitation, la commande est finalisée - REF ${props.ticket?.data?.order?.reference} - Tu as vendu ${props.ticket?.data?.totalTicketsForThisEditionForThisSeller} tickets`;
                break;
            case 'nl':
                text = props.error ?
                `Er is een fout opgetreden - ${props.ticket?.message ? props.ticket?.message[0] : 'unkown'} - ERR CODE ${props.ticket?.code}`
                : `Gefeliciteerd, uw bestelling is nu voltooid - REF ${props.ticket?.data?.order?.reference} - Je hebt verkocht ${props.ticket?.data?.totalTicketsForThisEditionForThisSeller} tickets`;
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