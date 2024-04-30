import api, { LaunchesURL } from "@/constants";
import Image from "next/image";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/router";
import Link from "next/link";

const LaunchCard = ({ id, name, flightNumber, image, date, success }) => {
  const isSuccess = success ? "text-green-600" : "text-red-600";
  return (
    <Link href={`/launches/${id}`}>
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
          <p className="text-gray-600">Flight Number: {flightNumber}</p>
          <p className="text-gray-600">Date: {new Date(date).toDateString()}</p>
          <p className={`${isSuccess} font-semibold`}>
            Status: {success ? "Success" : "Failure"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default function Launches({ data }) {
  const router = useRouter();

  const handlePageChange = (event, value) => {
    router.push(`/launches/page/${value - 1}`);
  };
  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      {!data || !data.docs || !Array.isArray(data.docs) ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4 mt-4">
            {data.docs.map((launch, index) => {
              return (
                <LaunchCard
                  key={index}
                  id={launch.id}
                  name={launch.name}
                  flightNumber={launch.flight_number}
                  image={launch.links.patch.small}
                  date={launch.date_utc}
                  success={launch.success}
                />
              );
            })}
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
  const response = await api.post(LaunchesURL + "/query", {
    options: {
      page: parseInt(page) + 1,
      limit: 10,
    },
  });
  return response.data;
}

async function getPaginationDetails() {
  const response = await api.post(LaunchesURL + "/query", {
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
