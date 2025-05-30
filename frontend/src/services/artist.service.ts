import { axiosIntance } from "../lib/axios";
import { Artist } from "../types";

const getAllArtist = () => {
  try {
    return axiosIntance.get('artist');
  } catch (error) {
    console.log("Had error when get all artist: ", error);
  }
}

const getArtistAlbum = (artistId: string) => {
  try {
    return axiosIntance.get(`artist/albums/${artistId}`)
  } catch (error) {
    console.log("Had error when get albums artist: ", error)
  }
}

const getArtistSong = (artistId: string, page: number, hasPageInfo: boolean) => {
  try {
    return axiosIntance.get(`artist/songs/${artistId}?page=${page}&hasPageInfo${hasPageInfo}`)
  } catch (error) {
    console.log("Had error when get songs artist: ", error)
  }
}
const CreateNewArtist = (payload: Artist) => {
  try {
    return axiosIntance.post('artist/create', payload)
  } catch (error) {
    console.log("Had error when create artist: ", error)
  }
}

const updateDataArtist = (artistId: string, data: Artist) => {
  try {
    return axiosIntance.put(`api/artist/${artistId}`, data);
  } catch (error) {
    console.log("Had error when update data artist: ", error)
  }
}

const deleteArtist = (artistId: string) => {
  try {
    return axiosIntance.delete(`api/artist/delete/${artistId}`);
  } catch (error) {
    console.log("Had error when update data artist: ", error)
  }
}

export default {
  getAllArtist,
  getArtistAlbum,
  getArtistSong,
  CreateNewArtist,
  updateDataArtist,
  deleteArtist,
}