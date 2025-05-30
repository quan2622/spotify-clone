import { axiosIntance } from "../lib/axios";

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

const getArtistSong = (artistId: string) => {
  try {
    return axiosIntance.get(`artist/songs/${artistId}`)
  } catch (error) {
    console.log("Had error when get songs artist: ", error)
  }
}
const CreateNewArtist = (payload: any) => {
  try {
    return axiosIntance.post('artist/create', payload)
  } catch (error) {
    console.log("Had error when create artist: ", error)
  }
}

const updateDataArtist = (artistId: string, data: any) => {
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