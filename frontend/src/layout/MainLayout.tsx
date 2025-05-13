import { Outlet } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/ui/resizable"
import LeftSideBar from "./components/LeftSideBar";
import RightSide from "./components/RightSide";
import AudioPlayer from "./components/AudioPlayer";
import PlayBackControls from "./components/PlayBackControls";
import { useEffect, useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";


const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex flex-1 h-full overflow-hidden p-2">
        <AudioPlayer />
        {/* Left side */}
        <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
          <LeftSideBar />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
        {/* Main side */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          {/* <Outlet />
          <footer>đây la footer</footer> */}
          <ScrollArea className="h-full flex flex-col overflow-auto rounded-md border">
            <Outlet />
          </ScrollArea>
        </ResizablePanel>
        {!isMobile &&
          <>
            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
            {/* Right side */}
            <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
              <RightSide />
            </ResizablePanel>
          </>
        }
      </ResizablePanelGroup>
      <PlayBackControls />
    </div>
  )
}

export default MainLayout