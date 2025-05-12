import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Album, Song } from "../../../types";
import { useMusicStore } from "../../../stores/useMusicStore";

type SuggestionAlbum_User = {
  album: Album
  featuredSongs: Song[],
  formatDuraion: (duration: number) => string,
}

const SuggestionAlbum_User = ({ album, featuredSongs, formatDuraion }: SuggestionAlbum_User) => {
  const { addSongToAlbumUser } = useMusicStore()
  const [songSelected, setSongSelected] = useState<string>('');
  const handleAddNewSong = async (song: Song) => {
    // const song = 
    await addSongToAlbumUser(album._id, song);
  }

  return (
    <div className="bg-zinc-900/80 p-4">
      <h1 className="text-white text-lg font-bold mt-6 mb-4">Suggestion</h1>
      <div className="px-4">
        <div className="space-y-2 py-4">
          {featuredSongs.map((song, index) => {
            let isSelected = songSelected === song._id;
            const isExist = album.songs.some(s => s._id === song._id)
            if (!isExist)
              return (
                <div key={song._id} className={`grid grid-cols-[16px_4fr_2fr_1fr] px-4 py-2 gap-4 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer group ${isSelected ? 'bg-zinc-600 hover:bg-zinc-600' : ''}`}
                  onClick={() => setSongSelected(song._id)}>
                  <div className="flex items-center opacity-0">{index + 1}</div>
                  <div className="flex items-center">
                    <img src={song.imageUrl} alt={song.title} className="size-10" />
                    <div className="ml-5">
                      <div className="text-sm text-white">{song.title}</div>
                      <div className="text-sm mt-1">{song.artist}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1"> {song.createdAt.split('T')[0]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="ml-1">
                      {formatDuraion(song.duration)}
                    </span>
                    <PlusCircle className={`${isSelected ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 ml-4`}
                      onClick={() => handleAddNewSong(song)} />
                  </div>
                </div>
              )
          })}
        </div>
      </div>

    </div>
  )
}
export default SuggestionAlbum_User