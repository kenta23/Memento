import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { noteData } from '@/types';
import { Popover, PopoverContent, PopoverTrigger} from '../../@/components/ui/popover'
import { Archive, EllipsisVertical, Heart } from 'lucide-react';
import { formatDate } from '@/lib/formats';
import { useNavigate } from 'react-router-dom';



export default function Favorites() {
        const navigate = useNavigate();
        const { userId } = useAuth();
        const {data, isLoading, isError, isPending } = useQuery({
          queryKey: ['archives'],
          queryFn: async () => await axios.get('/favorites', {
            headers: {
               Authorization: `Bearer ${userId}`
            }
          })
        })
    
        console.log('favorites', data);
    
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
              <h1 className="text-3xl font-bold">Favorites</h1>
    
              {/**FILTER NOTE SECTION */}
              <div className="flex text-[#677480] items-center gap-3 ">
                <button className="cursor-pointer active:scale-105">Latest</button>
                <button className="cursor-pointer active:scale-105">Oldest</button>
              </div>
    
              <div className="mt-6 max-h-[620px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center"></div>
            </div>


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
                              <button>
                                <span>Delete</span>
                              </button>
                              <button>
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

