import  "bootstrap/dist/css/bootstrap.min.css";
import './globals.css';
import './custom.scss';
import AddBootstrap from "./AddBootstrap";

export const metadata = {
  title: 'Manifiesta Tickets',
  description: 'Managing Tickets for event',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <AddBootstrap />
      </body>
    </html>
  );
}