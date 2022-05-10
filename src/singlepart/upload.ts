import Axios from "axios";

export async function uploadFile(file: Buffer, url: string) {
  const axios = Axios.create();
  delete axios.defaults.headers.put["Content-Type"];

  return axios.put(url, file);
}
