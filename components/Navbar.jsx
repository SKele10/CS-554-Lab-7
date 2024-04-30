import Link from "next/link";
import { useRouter } from "next/router";
import InfoIcon from "@mui/icons-material/Info";
import HistoryIcon from "@mui/icons-material/History";
import Image from "next/image";
import { navigation } from "@/constants";

const Navbar = () => {
  const { pathname } = useRouter();
  return (
    <div className="static w-full top-0 bg-sk-5 z-50">
      <div className="flex items-center px-5 py-5">
        <Link
          className="flex justify-center items-center font-oswald w-[12rem] text-white font-medium text-2xl hover:text-sk-22"
          href="/"
        >
          <Image src="/spacex.png" width={48} height={40} alt="SpaceX" />
          SpaceXplorer
        </Link>
        <nav
          className={`flex top-[5rem] left-0 right-0 bottom-0 static mx-auto`}
        >
          <div className="relative z-2 flex items-center justify-center m-auto flex-row">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className={`block relative font-oswald uppercase text-sk-1 transition-colors hover:text-sk-22 px-6 ${
                  pathname?.includes(item.name)
                    ? "z-10 text-sk-22"
                    : "text-sk-1"
                } hover:text-sk-1`}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
        <div className="flex gap-2">
          <Link
            className={`flex justify-center items-center font-oswald uppercase text-sk-1 transition-colors hover:text-sk-22 ${
              pathname?.includes("history") ? "z-10 text-sk-22" : "text-sk-1"
            } hover:text-sk-1`}
            href="/history"
          >
            <HistoryIcon />
            History
          </Link>
          <Link
            className={`flex justify-center items-center font-oswald uppercase text-sk-1 transition-colors hover:text-sk-22 ${
              pathname?.includes("company") ? "z-10 text-sk-22" : "text-sk-1"
            } hover:text-sk-1`}
            href="/company"
          >
            <InfoIcon />
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
