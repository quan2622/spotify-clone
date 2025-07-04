import { matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/ui/resizable"
import LeftSideBar from "./components/LeftSideBar";
import RightSide from "./components/RightSide";
import AudioPlayer from "./components/AudioPlayer";
import PlayBackControls from "./components/PlayBackControls";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import Topbar from "../components/Topbar";
import { useSearchStore } from "../stores/useSearchStore";
import { useUIStore } from "../stores/useUIStore";


const MainLayout = () => {
  const [isFisrt, setIsFirst] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapseLeft, setIsCollapseLeft] = useState(false);
  const [isCollapseRight, setIsCollapseRight] = useState(false);
  const [dataSearch, setDataSearch] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const { dataSearch: searchKey } = useSearchStore();
  const [currentBg, setCurrentBg] = useState("");
  const [nextBg, setNextBg] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const rightPanelRef = useRef<any>(null);
  const leftPanelRef = useRef<any>(null);

  const { hanldeChangeMainSize, primColor } = useUIStore();

  // HANDLE CHANGE BACKGROUND COLOR WITH GRADIENT
  useEffect(() => {
    if (primColor === currentBg) return;
    setIsTransitioning(true);
    setNextBg(primColor);

    const timeout = setTimeout(() => {
      setCurrentBg(primColor);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [primColor, currentBg]);


  // RESET KEY-WORD SEARCH
  useEffect(() => {
    if (!searchKey) return;
    setDataSearch(encodeURIComponent(searchKey));
    useSearchStore.setState({ dataSearch: "" });
  }, []);

  useEffect(() => {
    if (isFisrt) {
      return setIsFirst(false);
    }
    if (dataSearch) {
      useSearchStore.setState({ dataSearch: dataSearch });
      navigate(`/search/${dataSearch}`);
    }
  }, [dataSearch]);

  // CHECK IS MOBILE
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // COMPARE SEARCH ROUTE
  useEffect(() => {
    const wasSearchDetail = matchPath("/search/:dataSearch", prevPath.current);
    const isSearchDetail = matchPath("/search/:dataSearch", location.pathname);

    if (wasSearchDetail && !isSearchDetail) {
      setDataSearch("");
      useSearchStore.setState({ dataSearch: "" });
    }

    prevPath.current = location.pathname;
  }, [location]);


  useEffect(() => {
    const isSearchDetail = matchPath("/search/:dataSearch", location.pathname);
    if (!dataSearch && isSearchDetail) {
      navigate("/search");
    }
  }, [dataSearch]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    // const query_sr = event.target.value;
    setDataSearch(event.target.value);
    // if (query_sr.length !== 0) {
    //   navigate(`/search/${query_sr}`)
    // }
  }

  const handleCollpaseRight = () => {
    if (rightPanelRef.current) {
      if (isCollapseRight) {
        rightPanelRef.current.expand();
      } else {
        rightPanelRef.current.collapse();
      }
    }
  }

  const handleCollpaseLeft = () => {
    if (leftPanelRef.current) {
      if (isCollapseLeft) {
        leftPanelRef.current.expand();
      } else {
        leftPanelRef.current.collapse();
      }
    }
  }


  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex flex-1 h-full overflow-hidden p-2">
        <AudioPlayer />
        {/* Left side */}
        <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 20} maxSize={20} collapsedSize={6} collapsible
          onCollapse={() => setIsCollapseLeft(true)}
          onExpand={() => setIsCollapseLeft(false)}
          ref={leftPanelRef}
        >
          <LeftSideBar isCollapseLeft={isCollapseLeft} handleCollapse={handleCollpaseLeft} />
        </ResizablePanel>
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
        {/* Main side */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60} className="flex gap-2 flex-col" onResize={(number: number) => hanldeChangeMainSize(number)}>
          <Topbar query={dataSearch} handleSearch={handleSearch} />
          <ScrollArea className="h-full flex flex-col overflow-auto rounded-md border">
            <div className="relative h-full w-full overflow-hidden">
              <div
                className="absolute inset-0 transition-opacity duration-300 ease-linear z-0"
                style={{ background: currentBg, }}
              />

              <div
                className={`absolute inset-0 transition-opacity duration-300 ease-linear z-0 ${isTransitioning ? "opacity-100" : "opacity-0"}`}
                style={{ background: nextBg }}
              />

              <div className="relative z-10">
                <Outlet />
              </div>
            </div>
          </ScrollArea>

        </ResizablePanel>
        {!isMobile &&
          <>
            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
            {/* Right side */}
            <ResizablePanel defaultSize={20} minSize={20} maxSize={20} collapsedSize={6} collapsible
              onCollapse={() => setIsCollapseRight(true)}
              onExpand={() => setIsCollapseRight(false)}
              ref={rightPanelRef}
            >
              <RightSide isCollapseRight={isCollapseRight} handleCollapse={handleCollpaseRight} />
            </ResizablePanel>
          </>
        }
      </ResizablePanelGroup>
      <PlayBackControls />
    </div>
  )
}

export default MainLayout