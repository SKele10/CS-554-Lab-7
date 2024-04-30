import api, { LaunchesURL } from "@/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment";
import YouTube from "react-youtube";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function LaunchDetails({ launch }) {
  const getVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match && match[1];
  };

  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      <h1 className="text-3xl font-bold mb-4">{launch.name || "N/A"}</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid col-span-3 grid-cols-4 gap-4">
          <div
            className={`bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6 ${
              !launch.success || "col-span-2"
            }`}
          >
            <h2 className="text-xl font-semibold ">Details</h2>
            <div className="flex items-center mt-4">
              {launch.links.patch.large ? (
                <Image
                  src={launch.links.patch.large}
                  alt={launch.name}
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
              <div>
                <p className="text-gray-600">
                  Launch Date:{" "}
                  {launch.date_utc
                    ? moment(launch.date_utc).format("MMMM Do YYYY, h:mm:ss a")
                    : "N/A"}
                </p>
                <p className="text-gray-600">
                  Success:{" "}
                  {launch.success ? (
                    <CheckCircleIcon style={{ color: "green" }} />
                  ) : (
                    <CancelIcon style={{ color: "red" }} />
                  )}
                </p>
              </div>
            </div>
            <p className="mt-4">{launch.details || ""}</p>
            <div className="flex space-x-4">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4">
                <a
                  href={launch.links.article || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Article
                </a>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4">
                <a
                  href={launch.links.wikipedia || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Wikipedia
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white col-span-2 rounded-lg overflow-hidden shadow-lg border border-gray-200 relative p-6">
            {launch.links.webcast && (
              <YouTube
                videoId={getVideoId(launch.links.webcast)}
                opts={{ width: "100%" }}
              />
            )}
          </div>

          {launch.success || (
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold ">Failures</h2>
              <div className="overflow-y-scroll h-full">
                {launch.failures.map((failure, index) => (
                  <div key={index} className="mr-4">
                    <div className="bg-gray-100 rounded-lg shadow-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-gray-600">
                          <p>Time:</p>
                          <p>Reason:</p>
                        </div>
                        <div className="text-gray-800">
                          <p>{failure.time || "N/A"} seconds</p>
                          <p>{failure.reason || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
          <div className="p-6">
            <Link
              href={`/rockets/${launch.rocket.id}`}
              className="flex items-center hover:text-sk-7 w-fit"
            >
              <h2 className="text-xl font-semibold">
                Rocket: {launch.rocket.name || "N/A"}
              </h2>
            </Link>

            <div className="p-6 flex items-center">
              <Image
                src={launch.rocket.flickr_images[0] || ""}
                alt={launch.rocket.name || ""}
                className="h-32 w-auto mr-4"
                width={500}
                height={500}
              />
              <div>
                <p className="text-gray-600">
                  Cost per launch: {launch.rocket.cost_per_launch || "N/A"} USD
                </p>
                <p className="text-gray-600">
                  Success Rate: {launch.rocket.success_rate_pct || "N/A"}%
                </p>
                <p className="text-gray-600">
                  First Flight: {launch.rocket.first_flight || "N/A"}
                </p>
                <p className="text-gray-600">
                  Active:
                  {launch.rocket.active ? (
                    <CheckCircleIcon style={{ color: "green" }} />
                  ) : (
                    <CancelIcon style={{ color: "red" }} />
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
          <div className="p-6">
            <Link
              href={`/launchpads/${launch.launchpad.id}`}
              className="flex items-center hover:text-sk-7 w-fit"
            >
              <h2 className="text-xl font-semibold">
                Launch Pad: {launch.launchpad.full_name || "N/A"}
              </h2>
            </Link>

            <div className="p-6 flex items-center">
              <Image
                src={launch.launchpad.images.large[0] || ""}
                alt={launch.launchpad.full_name || ""}
                className="h-32 w-auto mr-4"
                width={500}
                height={500}
              />
              <div>
                <p className="text-gray-600">
                  Region: {launch.launchpad.region || "N/A"}
                </p>
                <p className="text-gray-600">
                  Locality: {launch.launchpad.locality || "N/A"}
                </p>
                <p className="text-gray-600">
                  Timezone: {launch.launchpad.timezone || "N/A"}
                </p>
                <p className="text-gray-600">
                  Number of Launches:{" "}
                  {launch.launchpad.launches.length || "N/A"}
                </p>
                <p className="text-gray-600">
                  Active:{" "}
                  {launch.launchpad.active ? (
                    <CheckCircleIcon style={{ color: "green" }} />
                  ) : (
                    <CancelIcon style={{ color: "red" }} />
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {launch.payloads.length > 0 && (
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payloads</h2>
              <div className="flex overflow-x-scroll">
                {launch.payloads.map((payload) => (
                  <div key={payload.id} className="mr-4">
                    <div className="bg-gray-100 rounded-lg shadow-lg p-4">
                      <Link
                        href={`/payloads/${payload.id}`}
                        className="flex items-center hover:text-sk-7 w-fit"
                      >
                        <h3 className="text-lg font-semibold hover:underline">
                          {payload.name || "N/A"}
                        </h3>
                      </Link>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-gray-600">
                          <p>Type:</p>
                          <p>Mass:</p>
                          <p>Orbit:</p>
                          <p>Inclination:</p>
                        </div>
                        <div className="text-gray-800">
                          <p>{payload.type || "N/A"}</p>
                          <p>
                            {payload.mass_lbs
                              ? `${payload.mass_lbs} lbs`
                              : "N/A"}
                          </p>
                          <p>{payload.orbit || "N/A"}</p>
                          <p>{payload.inclination_deg || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {launch.ships.length > 0 && (
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Ships</h2>
              <div className="flex overflow-x-scroll">
                {launch.ships.map((ship) => (
                  <div
                    key={ship.id}
                    className="mr-4 whitespace-nowrap flex-shrink-0"
                  >
                    <div className="bg-gray-100 rounded-lg shadow-lg p-4">
                      <Link
                        href={`/ships/${ship.id}`}
                        className="flex items-center hover:text-sk-7 w-fit"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {ship.name || "N/A"}
                        </h3>
                      </Link>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-gray-600">
                          <p>Type:</p>
                          <p>Home Port:</p>
                          <p>Number of Launches:</p>
                          <p>Active:</p>
                        </div>
                        <div className="text-gray-800">
                          <p>{ship.type || "N/A"}</p>
                          <p>{ship.home_port || "N/A"}</p>
                          <p>{ship.launches.length || "N/A"}</p>
                          <p>
                            {ship.active ? (
                              <CheckCircleIcon style={{ color: "green" }} />
                            ) : (
                              <CancelIcon style={{ color: "red" }} />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {launch.capsules.length > 0 && (
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Capsules</h2>
              <div className="flex overflow-x-scroll">
                {launch.capsules.map((capsule) => (
                  <div key={capsule.id} className="mr-4">
                    <div className="bg-gray-100 rounded-lg shadow-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {capsule.serial || "N/A"}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-gray-600">
                          <p>Type:</p>
                          <p>Status:</p>
                          <p>Land Landings:</p>
                          <p>Water Landings:</p>
                          <p>Last Update:</p>
                        </div>
                        <div className="text-gray-800">
                          <p>{capsule.type || "N/A"}</p>
                          <p>{capsule.status || "N/A"}</p>
                          <p>{capsule.land_landings || "N/A"}</p>
                          <p>{capsule.water_landings || "N/A"}</p>
                          <p>{capsule.last_update || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
      props: { launch: data.docs[0] },
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
  const response = await api.post(LaunchesURL + "/query", {
    query: {
      _id: id,
    },
    options: {
      populate: ["payloads", "launchpad", "rocket", "capsules", "ships"],
    },
  });
  return response.data;
}

async function getAllDetails() {
  const { data } = await api.get(LaunchesURL);

  return data;
}
