import { axiosIntance } from "../lib/axios";


const getCachingAlbum = (categoryKey: string, page = 1, pageSize = 10) => {
  // recent_listening, popular_albums, recommended, new_releases
  try {
    return axiosIntance.get(`albums/get/caches?categoryKey=${categoryKey}&page=${page}&pageSize=${pageSize}`);
  } catch (error) {
    console.log("Had error when get caching album: ", error);
  }
}

const recordListeningAlbum = (albumId: string) => {
  try {
    return axiosIntance.post(`albums/record-album/${albumId}`);
  } catch (error) {
    console.log("Had error when record listening album: ", error);
  }
}

const getDataAlbumSystem = (albumId: string) => {
  try {
    return axiosIntance.get(`albums/${albumId}`);
  } catch (error) {
    console.log("Had error when fetching data album: ", error);
  }
}

export default {
  getCachingAlbum,
  recordListeningAlbum,
  getDataAlbumSystem
}