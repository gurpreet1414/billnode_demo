


import { Space_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: {
    default: "BillNode — Track the metrics that matter",
    template: "%s | BillNode",
  },
  description: "A modern time-entry tool that turns scattered timesheets into clarity — so you bill more, chase less, and always know where the work went.",
  keywords: ["time tracking", "billing tool", "agency invoicing", "timesheets", "billable hours", "workspace control"],
  authors: [{ name: "BillNode Team" }],
  creator: "BillNode",
  publisher: "BillNode",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://billnode.com",
    title: "BillNode — Track the metrics that matter",
    description: "A modern time-entry tool that turns scattered timesheets into clarity — so you bill more, chase less, and always know where the work went.",
    siteName: "BillNode",
  },
  twitter: {
    card: "summary_large_image",
    title: "BillNode — Track the metrics that matter",
    description: "A modern time-entry tool that turns scattered timesheets into clarity.",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23ff5a1f'/%3E%3Ctext x='16' y='23' font-family='Arial' font-weight='bold' font-size='18' fill='white' text-anchor='middle'%3EB%3C/text%3E%3C/svg%3E",
  },
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${instrumentSerif.variable} js`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
