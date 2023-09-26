import axios from 'axios';
import https from 'https';
import RedirectToApp from '../shared/redirect-to-app';

// TODO better ui
// TODO link to mail if problem
// TODO link to the app or website
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
    const error: boolean = !ticket?.data;

    const text = error ?
        `There is an error - ${ticket?.message ? ticket?.message[0] : 'unkown'} - ERR CODE ${ticket?.code}`
        : `Congratulations, the tickets is selling - REF ${ticket?.data?.order?.reference}`;
    return (
        <div>
            <h1 className={error ? 'text-error' : ''}>{text}</h1>
            <RedirectToApp />
        </div>
    )
}
