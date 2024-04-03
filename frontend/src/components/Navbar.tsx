import { UserButton, useAuth } from "@clerk/clerk-react";
import { CircleUserRound } from 'lucide-react'


export default function Navbar() {
    const { userId } = useAuth();
  return (
    <div className="w-full h-[80px] bg-[#307FB9] flex items-center justify-center px-12 py-2"> 
         <div className="flex w-full flex-row items-center justify-between gap-2">
             {/** LOGO */}
             <div>
             <img 
               src={'/Memento.svg'}
               width={150}
               height={150}
               className=""
             />

             </div>

             <div>
                  {/**USER PROFILE CLERK */}
              {userId ? <UserButton afterSignOutUrl="/" userProfileMode="navigation"/> : <CircleUserRound color="#ffff" size={40} className=""/> }

             </div>
         </div>


    </div>
  )
}
