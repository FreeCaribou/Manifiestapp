import axios from 'axios';
import https from 'https';
import FinishPaymentComponent from '../shared/finish-payment-component';

export default async function FinishPayment({
    searchParams,
}: {
    searchParams?: { [key: string]: string };
}) {
    const vivaWalletTransactionId = searchParams?.t;

    const ticketData = axios.get(`${process.env.BASE_URL}tickets/finishOrderPending/${vivaWalletTransactionId}`, {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    }).catch(err => {
        return err?.response?.data;
    });
    const ticket = await Promise.resolve(ticketData);
    const error: boolean = !vivaWalletTransactionId || !ticket.data?.eventsquareReference;

    const messages = {
        en: error ?
            `There is an error - ${ticket?.message ? ticket?.message[0] : 'unkown'} - ERR CODE ${ticket?.code}`
            : !ticket?.data?.transactionInProgress ?
                `Congratulations, the tickets is selling - REF ${ticket?.data?.eventsquareReference} - The ticket is send to ${ticket?.data?.clientEmail}`
                : `${ticket.data.eventsquareReference ? `Order ${ticket.data.eventsquareReference} has been completed` : 'Order in progress, check with the seller'}`,
        fr: error ?
            `Une erreur est survenu - ${ticket?.message ? ticket?.message[0] : 'unkown'} - ERR CODE ${ticket?.code}`
            : !ticket?.data?.transactionInProgress ?
                `Félicitation, la commande est finalisée - REF ${ticket?.data?.eventsquareReference} - Le ticket a été envoyé à ${ticket?.data?.clientEmail}`
                : `${ticket.data.eventsquareReference ? `La commande ${ticket.data.eventsquareReference} est terminée` : 'Commande en cours, voir avec le vendeur'}`,
        nl: error ?
            `Er is een fout opgetreden - ${ticket?.message ? ticket?.message[0] : 'unkown'} - ERR CODE ${ticket?.code}`
            : !ticket?.data?.transactionInProgress ?
                `Gefeliciteerd, uw bestelling is nu voltooid - REF ${ticket?.data?.eventsquareReference} - De ticket is sturen aan ${ticket?.data?.clientEmail}`
                : `${ticket.data.eventsquareReference ? `Bestelling ${ticket.data.eventsquareReference} is voltooid` : 'Bestelling in uitvoering, neem contact op met de verkoper'}`,
    }

    const props = { messages, vivaWalletTransactionId };
    return (
        <div>
            <FinishPaymentComponent props={props} />
        </div>
    )
}
