import api, { LaunchPadsURL } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function LaunchPadDetails({ launchpad }) {
  const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
  </svg>`;

  const getColorClass = (status) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "inactive":
        return "text-gray-300";
      case "unknown":
        return "text-yellow-500";
      case "retired":
        return "text-blue-500";
      case "lost":
        return "text-red-500";
      case "under construction":
        return "text-orange-500";
      default:
        return "text-gray-400";
    }
  };
  const getColorHexCode = (status) => {
    switch (status) {
      case "active":
        return "#10B981";
      case "inactive":
        return "#D1D5DB";
      case "unknown":
        return "#F59E0B";
      case "retired":
        return "#3B82F6";
      case "lost":
        return "#EF4444";
      case "under construction":
        return "#F97316";
      default:
        return "#9CA3AF";
    }
  };

  const globeEl = useRef(null);
  useEffect(() => {
    if (globeEl.current && globeEl.current.pointOfView) {
      globeEl.current.pointOfView({
        lat: launchpad.latitude,
        lng: launchpad.longitude,
        altitude: 1.5,
      });
    }
  }, [globeEl]);

  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        {launchpad.name || "N/A"}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <div className="flex items-center mt-4">
            {launchpad.images?.large?.length > 0 ? (
              <Image
                src={launchpad.images.large[0]}
                alt={launchpad.name}
                className="w-52 h-full object-cover mr-4"
                width={500}
                height={500}
              />
            ) : (
              <Image
                src="/noimage.png"
                alt="No Image"
                className="w-full h-40 object-cover"
                width={500}
                height={500}
              />
            )}
            <div>
              <p className="text-gray-600">Full Name: {launchpad.full_name}</p>
              <p className="text-gray-600">Locality: {launchpad.locality}</p>
              <p className="text-gray-600">Region: {launchpad.region}</p>
              <p className="text-gray-600">Timezone: {launchpad.timezone}</p>
              <p className="text-gray-600">
                Status:{" "}
                <span className={getColorClass(launchpad.status)}>
                  {launchpad.status}
                </span>
              </p>
            </div>
          </div>
          <p className="mt-4">{launchpad.details || ""}</p>
        </div>
        <div className="bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-lg border border-gray-200">
          <Globe
            ref={globeEl}
            backgroundColor="#00000000"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            width={300}
            height={300}
            focus={[launchpad.latitude, launchpad.longitude, 1.5]}
            htmlElementsData={[
              {
                lat: launchpad.latitude,
                lng: launchpad.longitude,
                size: 30,
                color: getColorHexCode(launchpad.status),
              },
            ]}
            htmlElement={(d) => {
              const el = document.createElement("div");
              el.innerHTML = markerSvg;
              el.style.color = d.color;
              el.style.width = `${d.size}px`;

              return el;
            }}
          />
        </div>
        <div className="bg-white col-span-2 rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Rockets</h2>
          <ul className="grid grid-cols-2 gap-4">
            {launchpad.rockets.length > 0 &&
              launchpad.rockets.map((rocket, index) => (
                <li
                  key={rocket.id}
                  className="bg-gray-100 rounded-lg shadow-lg p-4 grid grid-cols-2 gap-4"
                >
                  <div>
                    <Link
                      href={`/rockets/${rocket.id}`}
                      className="flex items-center hover:text-sk-7 w-fit"
                    >
                      <h3 className="text-lg font-semibold  mb-2  hover:underline w-fit">
                        {rocket.name || "N/A"}
                      </h3>
                    </Link>
                    <p className="text-gray-600 flex items-center">
                      Active:{" "}
                      {rocket.active ? (
                        <CheckCircleIcon className="text-green-500 ml-1" />
                      ) : (
                        <CancelIcon className="text-red-500 ml-1" />
                      )}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      Cost per Launch: {rocket.cost_per_launch} USD
                    </p>
                    <p className="text-gray-600 flex items-center">
                      Success Rate: {rocket.success_rate_pct}%
                    </p>
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-2 w-fit">
                      <a
                        href={rocket.wikipedia || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Wikipedia
                      </a>
                    </div>
                  </div>

                  {rocket.flickr_images.length > 0 ? (
                    <Image
                      src={rocket.flickr_images[0]}
                      alt={rocket.name}
                      className="w-40 h-full object-cover"
                      width={500}
                      height={500}
                    />
                  ) : (
                    <Image
                      src="/noimage.png"
                      alt="No Image"
                      className="w-full h-40 object-cover"
                      width={500}
                      height={500}
                    />
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const indId = params.id;

  const data = await getIndData(indId);

  if (!data || data.length === 0) {
    return {
      notFound: true,
    };
  }

  if (data.docs.length > 0) {
    return {
      props: { launchpad: data.docs[0] },
      revalidate: 86400,
    };
  } else
    return {
      notFound: true,
    };
}

export async function getStaticPaths() {
  const alldetails = await getAllDetails();
  const paths = alldetails.map((detail) => {
    return {
      params: { id: detail.id },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
}

async function getIndData(id) {
  const response = await api.post(LaunchPadsURL + "/query", {
    query: {
      _id: id,
    },
    options: {
      populate: ["rockets"],
    },
  });
  return response.data;
}

async function getAllDetails() {
  const { data } = await api.get(LaunchPadsURL);

  return data;
}
