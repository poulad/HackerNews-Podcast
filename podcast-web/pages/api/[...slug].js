import {Config} from "../../src/config";
import Axios from "axios";

export default async function handler(req, res) {
  const {slug} = req.query

  const remoteApiUrl = new URL(["api", ...slug].join("/"), Config.apiBaseUrl).toString()

  const remoteResponse = await Axios.request({
    method: req.method,
    url: remoteApiUrl,
    data: req.body,
    headers: {
      ...req.headers,
      host: '',
      'X-HNP-Agent': 'nextjs-proxy'
    },
    validateStatus: () => true
  })

  res.status(remoteResponse.status);

  Object.keys(remoteResponse.headers).forEach(headerName => {
    const headerValue = remoteResponse.headers[headerName]
    res.setHeader(headerName, headerValue)
  })

  res.send(remoteResponse.data)
}
