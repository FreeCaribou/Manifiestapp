import axios from 'axios';
import https from 'https';

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

    if (error) {
        return (
            <div>
                There is an error - {ticket.message[0]} - ERR CODE {ticket.code}
            </div>
        )
    }
    return (
        <div>
            Congratulations, the tickets is selling - REF {ticket?.data?.order?.reference}
        </div>
    )
}
