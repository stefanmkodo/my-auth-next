import getParam from "./queryString.js";

const server = typeof window !== "undefined" && getParam('apiUrl') ? getParam('apiIp') : "http://192.168.1.216:3000";

const fetcher = (url) => fetch(`${server}/api${url}`).then((res) => res.json());

export default fetcher;
