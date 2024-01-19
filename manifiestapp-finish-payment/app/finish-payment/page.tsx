import axios from 'axios';
import https from 'https';
import FinishPaymentComponent from '../shared/finish-payment-component';

// TODO better ui
// TODO link to mail if problem
async function askTicket(vivaWalletTransactionId: string) {
    const res = await axios.get(`${process.env.BASE_URL}tickets/finishOrderPending/${vivaWalletTransactionId}`, {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    }).catch(err => {
        return err?.response?.data;
    });
    return res;
}

export default async function FinishPayment({
    searchParams,
}: {
    searchParams?: { [key: string]: string };
}) {
    const vivaWalletTransactionId = searchParams?.t;
    const ticketData = vivaWalletTransactionId ? askTicket(vivaWalletTransactionId as string) : { data: {} };
    const ticket = await Promise.resolve(ticketData);
    const error: boolean = !vivaWalletTransactionId || !ticket?.data;

    console.log('error and ticket', ticket?.data, !ticket?.data, error)

    const messages = {
        en: error ?
            `There is an error - ${ticket?.message ? ticket?.message[0] : 'unkown'} - ERR CODE ${ticket?.code}`
            : `Congratulations, the tickets is selling - REF ${ticket?.data?.order?.reference} - You have sold ${ticket?.data?.totalTicketsForThisEditionForThisSeller} tickets`,
        fr: error ?
            `Une erreur est survenu - ${ticket?.message ? ticket?.message[0] : 'unkown'} - ERR CODE ${ticket?.code}`
            : `Félicitation, la commande est finalisée - REF ${ticket?.data?.order?.reference} - Tu as vendu ${ticket?.data?.totalTicketsForThisEditionForThisSeller} tickets`,
        nl: error ?
            `Er is een fout opgetreden - ${ticket?.message ? ticket?.message[0] : 'unkown'} - ERR CODE ${ticket?.code}`
            : `Gefeliciteerd, uw bestelling is nu voltooid - REF ${ticket?.data?.order?.reference} - Je hebt verkocht ${ticket?.data?.totalTicketsForThisEditionForThisSeller} tickets`,
    }

    const props = { error, messages };
    return (
        <div>
            <FinishPaymentComponent props={props} />
        </div>
    )
}
