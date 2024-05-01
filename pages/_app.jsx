import Head from "next/head";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <div className={oswald.className}>
      <Head>
        <title>SpaceXplorer</title>
        <link rel="icon" href="/spacex.png" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}
