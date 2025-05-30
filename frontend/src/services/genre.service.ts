/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosIntance } from "../lib/axios";

const GetDetailGenre = (genreId: string) => {
  try {
    return axiosIntance.get(`genre/detail/${genreId}`);
  } catch (error: any) {
    console.log("Had error when get detail genre: ", error);
  }
}

const GetAllGenre = () => {
  try {
    return axiosIntance.get('genre/all');
  } catch (error) {
    console.log("Had error when get detail genre: ", error);
  }
}

const UpdateGenre = (payload: any, genreId: string) => {
  try {
    return axiosIntance.put(`genre/update-genre/${genreId}`, payload);
  } catch (error) {
    console.log("Had error when update data genre: ", error);
  }
}

const DeleteGenre = (genreId: string) => {
  try {
    return axiosIntance.delete(` genre/delete/${genreId}`)
  } catch (error) {
    console.log("Had error when delete genre: ", error);
  }
}

const CreateNew = (payload: any) => {
  try {
    return axiosIntance.post('genre/add-new', payload)
  } catch (error) {
    console.log("Had error when create genre: ", error);
  }
}
export default {
  GetDetailGenre,
  GetAllGenre,
  UpdateGenre,
  DeleteGenre,
  CreateNew,
}
