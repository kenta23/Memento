import { Plus, ScrollText, ArchiveRestore, Heart, Tags, Folders, Menu } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

const noteOptions = [
     {
        id: 1,
        icon: <ScrollText size={24}/>,
        desc: 'All notes',
        path: '/all-notes'
     }, 
     {
        id: 2,
        icon: <ArchiveRestore size={24}/>,
        desc: 'Archives',
        path: '/archives'
     },
     {
        id: 3,
        icon: <Heart size={24}/>,
        desc: 'Favorites',
        path: '/favorites'
     }
]
const tagsOptions = [
     {
        id: 1,
        name: 'School'
     },
     {
        id: 2,
        name: 'Grocery'
     },
     {
        id: 3,
        name: 'Work'
     }, 
     {
        id: 4,
        name: 'Technology'  
     }
 ]

 const folderOptions = [
     {
        id: 1,
        name: 'Folder 1'
     },
     {
        id: 2,
        name: 'Folder 2'
     }
 ]

export default function Sidebar() {
   const location = useLocation();
   const [clicked, setClicked] = useState<boolean>(false);
  
return (
  <>
    <div
      className={`min-w-[170px]  w-[270px] lg:w-[290px] border border-[#3DA6E1] h-auto min-h-screen`}
    >
      <div className="w-full">
        <div className="mx-auto mt-4 flex items-center w-full justify-center">
          <Link
            to={"/create-new"}
            className={`${
              location.pathname === "/create-new"
                ? "bg-[#79878f]"
                : "bg-[#1698E1]"
            } px-4 flex items-center gap-2  py-2 text-white `}
          >
            <Plus size={20} color="#ffff" />
            <span className="font-medium">Add new note</span>
          </Link>
        </div>

        <div className="mt-[40px] px-3 py-2 w-full border-b border-b-[#3DA6E1] flex flex-col gap-2 items-start">
          <h2 className="text-[20px] font-medium text-[#1698E1]">Notes</h2>

          <div className="flex mt-2 px-3 rounded-xl flex-col gap-3 h-auto w-auto">
            {noteOptions.map((item) => (
              <div
                key={item.id}
                className={`${
                  location.pathname === item.path ? "bg-[#3B95C8]" : ""
                } w-[140px] md:w-[160px] lg:min-w-[200px] hover:bg-[#3B95C8]  duration-150 ease-out group  p-2 rounded-xl min-h-[40px]`}
              >
                <NavLink
                  to={item.path}
                  className={`flex group-hover:text-white ${
                    location.pathname === item.path
                      ? "text-white"
                      : "text-[#3B95C8]"
                  } items-center w-full h-full  gap-2 flex-row`}
                >
                  {item.icon}
                  <p className="text-[18px] font-medium">{item.desc}</p>
                </NavLink>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[20px] px-3 py-2 w-full border-b border-b-[#3DA6E1] flex flex-col gap-2 items-start">
          <h2 className="text-[20px] font-medium text-[#1698E1]">Tags</h2>

          <div className="flex mt-2 px-3 rounded-xl flex-col gap-3 h-auto w-auto">
            {tagsOptions.map((item) => (
              <div
                key={item.id}
                className="w-[140px] md:w-[160px] lg:min-w-[200px] hover:bg-[#3B95C8] duration-150 ease-out group p-2 rounded-xl min-h-[40px] "
              >
                <NavLink
                  to="/all-notes"
                  className={`flex group-hover:text-white  items-center w-full h-full text-[#3B95C8] gap-2 flex-row`}
                >
                  <Tags size={24} />
                  <p className="text-[18px] font-medium">{item.name}</p>
                </NavLink>
              </div>
            ))}
            <div className="flex items-center gap-1 text-[#3B95C8]">
              <Plus size={18} />
              <span>Add</span>
            </div>
          </div>
        </div>

        <div className="mt-[20px] px-3 py-2 w-full border-b border-b-[#3DA6E1] flex flex-col gap-2 items-start">
          <h2 className="text-[20px] font-medium text-[#1698E1]">Folders</h2>

          <div className="flex mt-2 px-3 rounded-xl flex-col gap-3 h-auto w-auto">
            {folderOptions.map((item) => (
              <div
                key={item.id}
                className="w-[140px] md:w-[160px] lg:min-w-[200px] hover:bg-[#3B95C8] duration-150 ease-out group p-2 rounded-xl min-h-[40px] "
              >
                <NavLink
                  to="/all-notes"
                  className={`flex group-hover:text-white  items-center w-full h-full text-[#3B95C8] gap-2 flex-row`}
                >
                  <Folders size={24} />
                  <p className="text-[18px] font-medium">{item.name}</p>
                </NavLink>
              </div>
            ))}
          
          <Dialog>
            <div className="flex items-center gap-1 text-[#3B95C8]">
              <Plus size={18} />
              <DialogTrigger>Add</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </div>
         </Dialog>
          </div>
        </div>
      </div>
    </div>
  </>
);
}
