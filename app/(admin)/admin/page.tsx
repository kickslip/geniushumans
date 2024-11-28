import React from "react";
import AdminPanel from "./AdminPanel";
import Sidebar from "../_components/Sidebar";


const Page = () => {
  return(
    <div className="flex">
    {/* Sidebar */}
    <div >
      <Sidebar session={undefined} />
    </div>
  
    {/* Main content */}
    <div className="flex-1">
      <AdminPanel />
    </div>
  </div>
  )
};

export default Page;
