import { Link } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"
export default function Archive() {
    const { userId } = useAuth();

    const {data, isLoading, isError } = useQuery({
      queryKey: ['archives'],
      queryFn: async () => await axios.get('/archive', {
        headers: {
           Authorization: `Bearer ${userId}`
        }
      })
    })

    console.log('archives', data);

  return (
    <div className="w-full px-12 py-6 h-full min-h-screen">
      <div className="h-[50px] w-[320px] px-6  bg-[#CAE5F1] flex items-center rounded-full">
        <input
          placeholder="Search"
          className="outline-none bg-transparent z-10 py-2 w-full"
        />
      </div>

      <div className="mt-12 mb-6">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-bold">All Notes</h1>

          {/**FILTER NOTE SECTION */}
          <div className="flex text-[#677480] items-center gap-3 ">
            <button className="cursor-pointer active:scale-105">Latest</button>
            <button className="cursor-pointer active:scale-105">Oldest</button>
          </div>

          <div className="mt-6 max-h-[620px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center"></div>
        </div>
      </div>

    </div>
  );
}
