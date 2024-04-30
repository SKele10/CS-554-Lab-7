import axios from "axios";

export const navigation = [
  {
    id: 0,
    title: "Launches",
    url: "/launches/page/0",
    name: "launches",
  },
  {
    id: 1,
    title: "Payloads",
    url: "/payloads/page/0",
    name: "payloads",
  },
  {
    id: 2,
    title: "Cores",
    url: "/cores/page/0",
    name: "cores",
  },
  {
    id: 3,
    title: "Rockets",
    url: "/rockets/page/0",
    name: "rockets",
  },
  {
    id: 4,
    title: "Ships",
    url: "/ships/page/0",
    name: "ships",
  },
  {
    id: 5,
    title: "Launch Pads",
    url: "/launchpads/page/0",
    name: "launchpads",
  },
];



export const HistoryURL = "https://api.spacexdata.com/v4/history";
export const CompanyURL = "https://api.spacexdata.com/v4/company";
export const LaunchesURL = "https://api.spacexdata.com/v4/launches";
export const PayloadsURL = "https://api.spacexdata.com/v4/payloads";
export const CoresURL = "https://api.spacexdata.com/v4/cores";
export const RocketsURL = "https://api.spacexdata.com/v4/rockets";
export const ShipsURL = "https://api.spacexdata.com/v4/ships";
export const LaunchPadsURL = "https://api.spacexdata.com/v4/launchpads";

export default axios.create({
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});