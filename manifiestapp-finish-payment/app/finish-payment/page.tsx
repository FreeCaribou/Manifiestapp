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

    const props = {error, ticket};
    return (
        <div>
            <FinishPaymentComponent {...props}/>
        </div>
    )
}
