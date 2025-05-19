import { Outlet, useNavigate } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/ui/resizable"
import LeftSideBar from "./components/LeftSideBar";
import RightSide from "./components/RightSide";
import AudioPlayer from "./components/AudioPlayer";
import PlayBackControls from "./components/PlayBackControls";
import { ChangeEvent, useEffect, useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import Topbar from "../components/Topbar";
import { useMusicStore } from "../stores/useMusicStore";
import Fuse from "fuse.js";


const MainLayout = () => {
  const { songsSearch } = useMusicStore()

  const [isMobile, setIsMobile] = useState(false);
  const [isCollapseLeft, setIsCollapseLeft] = useState(false);
  const [isCollapseRight, setIsCollapseRight] = useState(false);
  const [dataSearch, setDataSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // const fuse = new Fuse(songsSearch, {
  //   keys: ['title', 'artist'],
  //   threshold: 0.4,
  //   ignoreLocation: true,
  //   includeScore: true,
  // });


  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query_sr = event.target.value;
    setDataSearch(event.target.value);
    if (query_sr.length !== 0) {
      navigate(`/search/${query_sr}`)
    }
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex flex-1 h-full overflow-hidden p-2">
        <AudioPlayer />
        {/* Left side */}
        <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={20} collapsedSize={6} collapsible
          onCollapse={() => { setIsCollapseLeft(true); }} onExpand={() => setIsCollapseLeft(false)}>
          <LeftSideBar isCollapseLeft={isCollapseLeft} />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
        {/* Main side */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60} className="flex gap-2 flex-col">
          <Topbar query={dataSearch} handleSearch={handleSearch} />
          <ScrollArea className="h-full flex flex-col overflow-auto rounded-md border py-3 bg-gradient-to-b from-zinc-800 to-zinc-900/40">
            <Outlet />
          </ScrollArea>
        </ResizablePanel>
        {!isMobile &&
          <>
            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
            {/* Right side */}
            <ResizablePanel defaultSize={20} minSize={14} maxSize={25} collapsedSize={6} collapsible
              onCollapse={() => { setIsCollapseRight(true); }} onExpand={() => setIsCollapseRight(false)}>
              <RightSide isCollapseRight={isCollapseRight} />
            </ResizablePanel>
          </>
        }
      </ResizablePanelGroup>
      <PlayBackControls />
    </div>
  )
}

export default MainLayout