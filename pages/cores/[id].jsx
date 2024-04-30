import api, { CoresURL } from "@/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import YouTube from "react-youtube";
import ClockIcon from "@/components/ClockIcon";

export default function CoreDetails({ core }) {
  const getVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match && match[1];
  };

  const getStatusTextColor = (status) => {
    const lowercaseStatus = status.toLowerCase();

    switch (lowercaseStatus) {
      case "active":
        return "text-green-600";
      case "lost":
        return "text-red-600";
      case "inactive":
        return "text-gray-600";
      case "expended":
        return "text-yellow-600";
      default:
        return "text-black";
    }
  };

  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        {core.serial || "N/A"}
      </h1>
      <div className="grid gap-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold ">Details</h2>
          <p className="mt-4">
            Status:{" "}
            <span className={getStatusTextColor(core.status)}>
              {core.status}
            </span>
          </p>
          <p>Last Update: {core.last_update || ""}</p>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 relative p-6">
          {core.launches.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Launches</h2>
              <div className="grid grid-cols-2">
                {core.launches.map((launch) => (
                  <div
                    key={launch.id}
                    className="bg-gray-100 rounded-lg shadow-lg p-4 grid gap-4"
                  >
                    <Link
                      href={`/launches/${launch.id}`}
                      className="flex items-center hover:text-sk-7 w-fit"
                    >
                      {launch.links.patch.large ? (
                        <Image
                          src={launch.links.patch.large}
                          alt={launch.name}
                          className="w-20 h-20 object-cover"
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
                      <h3 className="text-lg font-semibold  mb-2  hover:underline w-fit">
                        {launch.name || "N/A"}
                      </h3>
                      {launch.date_utc && (
                        <ClockIcon
                          textSize="text-black text-lg"
                          time={launch.date_utc}
                        />
                      )}
                    </Link>

                    <YouTube
                      videoId={getVideoId(launch.links.webcast)}
                      opts={{ width: "100%" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
      props: { core: data.docs[0] },
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
  const response = await api.post(CoresURL + "/query", {
    query: {
      _id: id,
    },
    options: {
      populate: ["launches"],
    },
  });
  return response.data;
}

async function getAllDetails() {
  const { data } = await api.get(CoresURL);

  return data;
}
