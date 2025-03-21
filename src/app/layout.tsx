import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "@/config/firebase";

import { Roboto } from "next/font/google";
import { ToastContainer } from "react-toastify";

import AuthProvider from "@providers/Auth";
import QueryClientProviderApp from "@providers/QueryClientApp";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "My Roofs",
  description: "Sua plataforma de gerenciamento de condomínios"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no">
      <QueryClientProviderApp>
        <AuthProvider>
          <body className={roboto.className}>
            <ToastContainer />
            {children}
          </body>
        </AuthProvider>
      </QueryClientProviderApp>
    </html>
  );
}
