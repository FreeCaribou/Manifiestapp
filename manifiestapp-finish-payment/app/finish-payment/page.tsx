import axios from "axios";
import https from 'https';

// TODO with real data for the ticketing finish order
async function askTicket(vivaWalletTransactionId: string) {
    const res = await axios.get(`${process.env.BASE_URL}api/v2/pages?format=json&type=event.EventPage`,     {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
    return res;
}

export default async function FinishPayment({
    searchParams,
}: {
    searchParams?: { [key: string]: string };
}) {
    const vivaWalletTransactionId = searchParams?.t;
    const ticketData = askTicket(vivaWalletTransactionId as string);
    const ticket = await Promise.resolve(ticketData);

    return (
        <main>
            Finish Payment {vivaWalletTransactionId} {ticket.data.meta.total_count}
        </main>
    )
}
