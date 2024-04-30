import api, { LaunchPadsURL } from "@/constants";
import Image from "next/image";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/router";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const LaunchPadCard = ({
  id,
  name,
  image,
  region,
  locality,
  status,
  timezone,
}) => {
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
  return (
    <Link href={`/launchpads/${id}`}>
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200">
        {image ? (
          <Image
            src={image}
            alt={name}
            className="w-full h-40 object-cover"
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

        <div className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-600">Region: {region}</p>
          <p className="text-gray-600">Locality: {locality}</p>
          <p className="text-gray-600">TimeZone: {timezone}</p>
          <p className="text-gray-600">
            Status: <span className={getColorClass(status)}>{status}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default function Payloads({ data }) {
  const router = useRouter();

  const handlePageChange = (event, value) => {
    router.push(`/launchpads/page/${value - 1}`);
  };
  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      {!data || !data.docs || !Array.isArray(data.docs) ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4">
            {data.docs.map((launchpad) => (
              <LaunchPadCard
                key={launchpad.id}
                id={launchpad.id}
                name={launchpad.name}
                locality={launchpad.locality}
                timezone={launchpad.timezone}
                region={launchpad.region}
                status={launchpad.status}
                image={launchpad.images?.large[0]}
              />
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                count={data.totalPages}
                variant="outlined"
                shape="rounded"
                hideNextButton={!data.hasNextPage}
                hidePrevButton={!data.hasPrevPage}
                page={data.page}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export async function getStaticProps({ params }) {
  const pageNumber = parseInt(params.page, 10);

  if (isNaN(pageNumber) || pageNumber < 0) {
    return {
      notFound: true,
    };
  }

  const data = await getIndData(pageNumber);

  if (!data || data.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data },
    revalidate: 86400,
  };
}

export async function getStaticPaths() {
  const pagination = await getPaginationDetails();
  const paths = Array.from({ length: pagination.totalPages }, (_, index) => {
    return {
      params: { page: index.toString() },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
}

async function getIndData(page) {
  const response = await api.post(LaunchPadsURL + "/query", {
    options: {
      page: parseInt(page) + 1,
      limit: 10,
    },
  });
  return response.data;
}

async function getPaginationDetails() {
  const response = await api.post(LaunchPadsURL + "/query", {
    options: {
      limit: 10,
    },
  });

  return {
    totalDocs: response.data.totalDocs,
    totalPages: response.data.totalPages,
    hasNextPage: response.data.hasNextPage,
    hasPrevPage: response.data.hasPrevPage,
    page: response.data.page,
  };
}
