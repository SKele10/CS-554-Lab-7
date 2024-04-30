import Image from "next/image";

export default function Home() {
  return (
    <div className="grid min-h-full place-items-center bg-white py-24 px-8 grid-cols-2 gap-10">
      <div className="text-2xl flex flex-col gap-10 ml-4">
        <p>
          Welcome to SpaceXplorer, your one-stop shop for all things SpaceX
          missions and exploration. Utilizing the strength of{" "}
          <a
            href="https://github.com/r-spacex/SpaceX-API/blob/master/docs/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Official SpaceX API
          </a>
          , we at SpaceXplorer give you access to the most recent and thorough
          data on launches, payloads, cores, rockets, ships, and launchpads.
        </p>
        <p>
          Explore the amazing world of rocket technology, discover the
          cutting-edge cores that propel these amazing vehicles, and track the
          travels of SpaceX's fleet of ships as they assist missions all across
          the world. Track payloads, learn about the most recent launches, and
          delve into the minute details of SpaceX's groundbreaking missions.
        </p>
        <p>
          You can fully immerse yourself in SpaceX's remarkable achievements
          with SpaceXplorer, from historic firsts to state-of-the-art
          developments in space exploration. SpaceXplorer is your go-to resource
          for everything SpaceX, whether you're a researcher, space enthusiast,
          or just interested in the prospects for space flight. Join us as we
          bravely venture where no one has gone before on an exciting cosmic
          adventure.
        </p>
      </div>
      <div className="bg-sk-22">
        <Image
          src="/spacex.png"
          alt="SpaceXplorer"
          className="max-w-full h-auto"
          width={600}
          height={600}
        />
      </div>
    </div>
  );
}
