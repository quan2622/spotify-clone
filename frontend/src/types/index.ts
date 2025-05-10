export interface Song {
  _id: string,
  title: string,
  artist: string,
  albumId: string | null,
  imageUrl: string,
  audioUrl: string,
  duration: number,
  totalListens: number,
  createdAt: string,
  udpatedAt: string,
}

export interface Album {
  _id: string,
  title: string,
  artist: string,
  imageUrl: string,
  releaseYear: number,
  songs: Song[],
  createdAt: string,
  udpatedAt: string,
}
export interface AlbumAdmin {
  _id: string,
  title: string,
  artist: string,
  imageUrl: string,
  releaseYear: number,
  songs: string[],
  createdAt: string,
  udpatedAt: string,
}

export interface User {
  _id: string,
  fullName: string,
  imageUrl: string,
  clerkId: string,
  createdAt: string,
  udpatedAt: string,
}

export interface Stat {
  totalAlbum: number,
  totalSong: number,
  totalUser: number,
  uniqueArtists: number,
}

export interface Message {
  _id: string,
  senderId: string,
  receiverId: string,
  content: string,
  createdAt: string,
  udpatedAt: string,
}

export interface dataAnalystType {
  _id: string,
  totalLogin: number,
  totalListen: number
}