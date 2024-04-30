import api, { PayloadsURL } from "@/constants";
import Image from "next/image";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/router";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const PayloadCard = ({ id, name, type, orbit, mass, reused, date }) => {
  return (
    <Link href={`/payloads/${id}`}>
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out">
        <div className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-600">Type: {type}</p>
          <p className="text-gray-600">Orbit: {orbit}</p>
          {mass && <p className="text-gray-600">Mass: {mass} lbs</p>}
          <p className="text-gray-600">
            Launched: {new Date(date).toDateString()}
          </p>
          <p className="text-gray-600 flex items-center">
            Reused:{" "}
            {reused ? (
              <CheckCircleIcon className="text-green-500 ml-1" />
            ) : (
              <CancelIcon className="text-red-500 ml-1" />
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default function Payloads({ data }) {
  const router = useRouter();

  const handlePageChange = (event, value) => {
    router.push(`/payloads/page/${value - 1}`);
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
            {data.docs.map((payload) => (
              <PayloadCard
                key={payload.id}
                id={payload.id}
                name={payload.name}
                mass={payload.mass_lbs}
                orbit={payload.orbit}
                reused={payload.reused}
                type={payload.type}
                date={payload.launch.date_utc}
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
  const response = await api.post(PayloadsURL + "/query", {
    options: {
      page: parseInt(page) + 1,
      limit: 10,
    },
  });
  return response.data;
}

async function getPaginationDetails() {
  const response = await api.post(PayloadsURL + "/query", {
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
