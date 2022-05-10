import Axios from "axios";
import { FILE_CHUNK_SIZE } from "./constants";

export async function uploadParts(file: Buffer, urls: Record<number, string>) {
  const axios = Axios.create();
  delete axios.defaults.headers.put["Content-Type"];

  const keys = Object.keys(urls);
  const promises = [];

  for (const indexStr of keys) {
    const index = parseInt(indexStr);
    const start = index * FILE_CHUNK_SIZE;
    const end = (index + 1) * FILE_CHUNK_SIZE;
    const blob =
      index < keys.length ? file.slice(start, end) : file.slice(start);

    promises.push(axios.put(urls[index], blob));
  }

  const resParts = await Promise.all(promises);

  return resParts.map((part, index) => ({
    ETag: (part as any).headers.etag,
    PartNumber: index + 1,
  }));
}
