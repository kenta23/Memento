
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Archive, EllipsisVertical, Heart } from 'lucide-react'
import { useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Allnotes() {
  const navigate = useNavigate();
  
  const { data, } = useQuery({
     queryKey: ['allnotes'],
     queryFn: async () => await axios.get('/users')
  })

  useEffect(() => {
      if(data) console.log('DATA', data);
  }, [data])

  console.log('DATA', data);
  return (
    <div className="w-full px-12 py-6 h-full min-h-screen">
          <div className='h-[50px] w-[320px] px-6  bg-[#CAE5F1] flex items-center rounded-full'>
              <input placeholder='Search' className='outline-none bg-transparent z-10 py-2 w-full'/>
          </div>
       

         <div className='mt-12 mb-6'>
              <div className='flex flex-col items-start gap-2'>
                   <h1 className='text-3xl font-bold'>All Notes</h1>

              {/**FILTER NOTE SECTION */}
                   <div className='flex text-[#677480] items-center gap-3 '>
                       <span>Latest</span>
                       <span>Oldest</span>
                   </div>
              </div>

              {/**NOTE CARS LIST */}
              <div className='mt-6'>
                   <div onClick={() => navigate('/note/2')} className='w-[250px] active:scale-105 transition-all duration-150 cursor-pointer h-[250px] rounded-lg shadow-lg'>
                        <div className='flex flex-col py-3 justify-between gap-4 h-full'>
                             <div className='w-full relative h-[150px] border-black border'>
                                   
                                    <div className='right-0 top-2 absolute'>
                                       <EllipsisVertical cursor={'pointer'}/>
                                    </div>
                             </div>
                        {/**NOTES INFO */}
                             <div className='flex items-start justify-between  px-2'>
                                    <div className='left flex flex-col gap-2'>
                                         <p className='font-medium text-[18px]'>My notes name</p>    
                                         
                                         {/**ICON OPTIONS */}
                                         <div className='flex gap-3 items-center'>
                                           <Heart color='#E26666' size={24}/>
                                           <Archive color='#66AEE2' size={24}/>
                                         </div>
                                    </div>

                                    <div className='font-light'>
                                        <p>12/24/23</p>
                                    </div>
                             </div>
                        </div>
                   </div>
              </div>

         </div>
    </div>
  )
}
