import { Space_Mono, JetBrains_Mono, Courier_Prime } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier-prime",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${spaceMono.variable} ${jetbrainsMono.variable} ${courierPrime.variable}`}
      lang="en"
    >
      <body className="bg-background text-on-surface h-screen w-full flex flex-col pixel-dither-bg overflow-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}