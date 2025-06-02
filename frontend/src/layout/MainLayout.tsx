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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          <ScrollArea className="h-full flex flex-col overflow-auto rounded-md border bg-gradient-to-b from-zinc-800 to-zinc-900/40">
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