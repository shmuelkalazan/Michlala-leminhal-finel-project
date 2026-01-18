// TypeScript representation of the JSON structure

interface PollingConfiguration {
  jobRequest: string;
  pollingRequest: string;
  setInterval: number;
}

interface Routs {
  login: PollingConfiguration;
  data: PollingConfiguration;
}

const routs: Routs = {
  login: {
    jobRequest: "login",
    pollingRequest: "loginStatus",
    setInterval: 5000,
  },
  data: {
    jobRequest: "fetchData",
    pollingRequest: "dataStatus",
    setInterval: 3000,
  },
};

export default routs;