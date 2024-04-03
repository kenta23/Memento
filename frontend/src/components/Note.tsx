import { Camera } from 'lucide-react';
import React from 'react'
import { useParams } from 'react-router-dom'

export default function Note() {
    const { id } = useParams(); 
  return (
    <div className='px-12 py-6 flex items-start justify-center h-full min-h-screen w-full'>
         <div className='h-auto shadow-lg w-[85%] border rounded-xl'>
          
                 <div className='p-4'>
                     <textarea placeholder='Enter note' contentEditable className='w-full outline-none h-[500px] indent-3 resize-none '>

                     </textarea>
                 </div>

                 <div className='mb-6 flex-row items-center gap-8 justify-end flex me-6'>
                      <div className='flex items-center gap-2'>
                        <Camera />
                         <span>Add Photo</span>
                      </div>

                       <button className='bg-[#57BB73] active:bg-[#3f8152] px-6 py-2 rounded-lg shadow-md'>
                           <p className='text-white'>Submit</p>
                       </button>
                 </div>
         </div>
    </div>
  )
}
