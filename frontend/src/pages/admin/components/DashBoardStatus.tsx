import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";
import { useMusicStore } from "../../../stores/useMusicStore";
import StatCad from "./StatCad"

const DashBoardStatus = () => {
  const { stat } = useMusicStore();
  const statsData = [
    {
      icon: ListMusic,
      label: "Total Songs",
      value: stat.totalSong.toString(),
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      icon: Library,
      label: "Total Albums",
      value: stat.totalAlbum.toString(),
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },
    {
      icon: Users2,
      label: "Total Artists",
      value: stat.uniqueArtists.toString(),
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      icon: PlayCircle,
      label: "Total Users",
      value: stat.totalUser.toLocaleString(),
      bgColor: "bg-sky-500/10",
      iconColor: "text-sky-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map(stat => (
        <StatCad
          key={stat.label}
          label={stat.label}
          icon={stat.icon}
          value={stat.value}
          bgColor={stat.bgColor}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  )
}
export default DashBoardStatus