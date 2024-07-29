import axios from 'axios';
import https from 'https';
import FinishPaymentComponent from '../shared/finish-payment-component';
import RedirectToRealFinish from '../shared/redirect-to-real-finish.component';

export default async function FinishPayment({
    searchParams,
}: {
    searchParams?: { [key: string]: string };
}) {
    const vivaWalletTransactionId = searchParams?.t;

    const messages = {
        en: '',
        fr: '',
        nl: ''
    }

    const props = { messages, vivaWalletTransactionId };
    return (
        <div>
            <RedirectToRealFinish props={props} />
        </div>
    )
}
