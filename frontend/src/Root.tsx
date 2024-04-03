import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { EdgeStoreProvider } from "./lib/edgestore";

export default  function Root() {

  return (
    <EdgeStoreProvider basePath="http://localhost:3000/edgestore">
      <div className="min-w-full min-h-full">
        {/**create a sidebar and navbar here */}
        <Navbar />

        <div className="flex">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </EdgeStoreProvider>
  );
}

