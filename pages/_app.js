import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <div className={oswald.className}>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}
