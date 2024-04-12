
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Archive, Check, EllipsisVertical, Heart } from 'lucide-react'
import {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { noteData } from '@/types';
import { Popover, PopoverContent, PopoverTrigger} from '../../@/components/ui/popover'
import { formatDate } from '@/lib/formats';
import { useToast } from './ui/use-toast';
import { useDebouncedCallback } from 'use-debounce'


enum orderBy {
   asc = "asc",
   desc = "desc"
}

export default function Allnotes() {
  const queryclient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId } = useAuth();
  const [order, setOrder] = useState<orderBy>(orderBy.desc);

  const [value, setValue] = useState<string>('');
  const debouncedVal = useDebouncedCallback((val) => {
            setValue(val)
  }, 1000)

  const { data, isPending, isError, isLoading, status } = useQuery({
     queryKey: ['allnotes'],
     queryFn: async () => await axios.get(`/getdata?q=${value}`, {
          headers: { Authorization: `Bearer ${userId}` },
     }),
     _optimisticResults: 'isRestoring'
  })

  
  useEffect(() => {
      if(value) {
        queryclient.invalidateQueries({ queryKey: ['allnotes']})
       }
  }, [queryclient, value])
  
  async function deleteData(id: number) { 
    try {
      await axios.post(`http://localhost:3000/api/delete/${id}`, null, {
          headers: {
              'Authorization': `Bearer ${userId}`,
          }
      })
      toast({
        title: "Deleted",
        description: 
         <div className='flex w-full flex-row gap-4 items-center justify-between'>
            <p>Successfully deleted data</p>
            <Check color='#68e988' size={24}/>
        </div>
     })
      queryclient.invalidateQueries({ queryKey: ['allnotes']})
     } catch (error) {
       console.log(error)
     }
  }

  // Sort by createdAt property in ascending order (oldest to newest)
  async function sortAsc() {
    setOrder(orderBy.asc);
    try {
       await axios.post('/ascending', order, {
        headers: {
          'Authorization': `Bearer ${userId}`,
        }
      })

      queryclient.invalidateQueries({ queryKey: ['allnotes']})
      toast({
         title: "Sorted",
         description: "Sorted data in ascending order"
      })
    } catch (error) {
      console.log(error)
      toast({
         title: "Error",
         description: "Something went wrong"
      })
    }
  }

  async function sortDesc() {
    setOrder(orderBy.desc);
    try {
       await axios.post('/ascending', order, {
        headers: {
          'Authorization': `Bearer ${userId}`,
        }
      })

      queryclient.invalidateQueries({ queryKey: ['allnotes']})
      toast({
         title: "Sorted",
         description: "Sorted data in descending order"
      })
    } catch (error) {
      console.log(error)
      toast({
         title: "Error",
         description: "Something went wrong"
      })
    }
  }
  return (
    <div className="w-full px-12 py-6 h-full min-h-screen">
      <div className="h-[50px] w-[320px] px-6  bg-[#CAE5F1] flex items-center rounded-full">
        <input
          defaultValue={value}
          onChange={(e) => debouncedVal(e.target.value)}
          placeholder="Search"
          className="outline-none bg-transparent z-10 py-2 w-full"
        />
      </div>

      <div className="mt-12 mb-6">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-bold">All Notes</h1>

          {/**FILTER NOTE SECTION */}
          <div className="flex text-[#677480] items-center gap-3 ">
            <button
              className="cursor-pointer active:scale-105"
              onClick={sortAsc}
            >
              Latest
            </button>
            <button
              className="cursor-pointer active:scale-105"
              onClick={sortDesc}
            >
              Oldest
            </button>
          </div>
        </div>

        {/**NOTE CARDS LIST */}

        {isLoading || isPending ? (
          <p>Loading data</p>
        ) : (
          <div className="mt-6 max-h-[620px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {data?.data.length > 0 ? (
              data?.data.map((item: noteData) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/note/${item.id}`)} 
                  className="w-[250px] active:scale-105 transition-all duration-150 cursor-pointer h-[250px] rounded-lg shadow-lg"
                >
                  <div className="flex flex-col py-3 justify-between gap-4 h-full">
                    <div className="w-full relative h-[150px] shadow-sm">
                      <div
                        className="right-0 top-2 absolute"
                        onClick={(e) => e.stopPropagation()} 
                      >
                        <Popover>
                          <PopoverTrigger>
                            <EllipsisVertical cursor={"pointer"} className="" />
                          </PopoverTrigger>
                          <PopoverContent className='bg-[#346e9e] text-white'>
                            <div className="gap-4 font-medium flex flex-col items-start ">
                              <button onClick={() => deleteData(item.id)}>
                                <span>Delete</span>
                              </button> 
                              <button onClick={() => navigate(`/note/${item.id}`)}>
                                <span>Open</span>
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {item.Images.length && item.Images[0].thumbnail ? (
                        <img
                          src={item.Images[0].thumbnail}
                          className="size-full object-cover"
                          alt="Note thumbnail"
                        />
                      ) : (
                        <p className="text-center m-auto">No thumbnail</p>
                      )}
                    </div>
                    {/**NOTES INFO */}
                    <div className="flex items-start justify-between  px-2">
                      <div className="left flex flex-col gap-2">
                        <p className="font-medium text-[18px] break-words max-w-[140px]">
                          {item.title}
                        </p>

                        {/**ICON OPTIONS */}
                        <div className="flex gap-3 items-center">
                          <Heart
                            aria-disabled={item.favorite}
                            color="#E26666"
                            className={`${
                              item.favorite ? "fill-[#E26666]" : "fill-none"
                            }`}
                            size={24}
                          />
                          <Archive
                            aria-disabled={item.archived}
                            color="#66AEE2"
                            size={24}
                            className={`${
                              item.archived ? "fill-[#66AEE2]" : "fill-none"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="font-light">
                        <p>{formatDate(`${item.updatedAt}`)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Empty notes</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
