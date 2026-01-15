import "./globals.css";
import { Inter } from "next/font/google";
import { AnimeProvider } from "@/app/utils/AnimeContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Icon } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Watch Anime",
  description: "Your place to watch the latest and greatest anime!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <AnimeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4">{children}</main>
            <Footer />
          </div>
        </AnimeProvider>
      </body>
    </html>
  );
}
