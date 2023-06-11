import { ReactNode } from "react";
import { AuthProvider } from "../lib/providers/auth";
import { ReactQueryProvider } from "../lib/providers/react-query";
import "../styles/globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
