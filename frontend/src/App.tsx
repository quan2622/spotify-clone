import { Route, Routes } from "react-router-dom";

import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import HomePage from "./pages/home/HomePage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import { Toaster } from "react-hot-toast"
import NotFoundPage from "./pages/404/NotFoundPage";
import ShowAll from "./pages/home/components/ShowAll";
import SearchPage from "./pages/search/SearchPage";
import BrownseAll from "./pages/search/BrownseAll";
import DetailArtist from "./pages/home/components/DetailArtist";
import ShowAllAlbum from "./pages/album/ShowAllAlbum";
import AlbumSystemPage from "./pages/album/AlbumSystemPage";

function App() {
  return (
    <>
      <Routes>
        {/* SSO Connection  */}
        <Route path="/sso-callback"
          element={<AuthenticateWithRedirectCallback
            signUpForceRedirectUrl={"/auth-callback"}
          />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/artist/:artistId" element={<DetailArtist />} />
          <Route path="/:page" element={<ShowAll />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/show-all-albums/:type" element={<ShowAllAlbum />} />
          <Route path="/show-all-albums/detail/:albumId" element={<AlbumSystemPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/search" element={<BrownseAll />} />
          <Route path="/search/:dataSearch" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  )
}

export default App
