import { Camera, X, } from 'lucide-react'
import React, { useRef, useState, KeyboardEvent } from 'react'
import HashtagInput from './Tags'
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/clerk-react';
import { useEdgeStore } from '@/lib/edgestore';

type Note = {
  title: string;
  text: string;
}

export default function CreateNew() {
    const addPhoto = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);
    const { user } = useUser();
    const { edgestore } = useEdgeStore();
    const [noteData, setNoteData] = useState<Note>({
       text: '',
       title: ''
    })
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [imageData, setImageData] = useState([{
      url: '',
      thumb: ''
    }])
    const {data, isError, mutate, status, isPending } = useMutation({
      mutationFn: async (newdata: FormData) => await axios.post('/newnote', newdata, {
         headers: {
           "Content-Type": 'multipart/form-data'
         }
      })
    })
  
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim() !== '') {
        e.preventDefault();
        setTags([...tags, inputValue.trim()]);
        setInputValue('');
      }
    };
  
    const handleDeleteTag = (index: number) => {
      setTags(tags.filter((_, i) => i !== index));
    };

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files; 
      if (file) {
          const newImage = Array.from(file);
          setImages(prevImage => [...prevImage, ...newImage]);
        }
     }

    async function submitData(e: React.FormEvent<HTMLFormElement>) {
       e.preventDefault();
       const formData = new FormData();
      
      if(!noteData) {
         toast.info('No content!');
         return;
      }

       formData.append('title', noteData.title);
       formData.append('note', noteData.text);
       formData.append('tags', JSON.stringify(tags, undefined, 2));
       formData.append('userid', user?.id as string);

   if (images.length) {
    const uploadImage = await Promise.all(
       images.map(async (image) => {
         try {
           const res = await edgestore.publicFiles.upload({
             file: image,
             onProgressChange: async (progress) => {
               toast.loading(`Uploading ${progress}%`);
             },
           });
           console.log("image res", res);
          /* setImageData((prev) => [
             ...prev,
             {
               url: res.url,
               thumb: res.thumbnailUrl as string,
             },
           ]); */
           //formData.append("images", JSON.stringify(imageData));
            return {
               url: res.url,
               thumb: res.thumbnailUrl as string,
            }
         } catch (error: unknown) {
           toast.error("Failed to upload image");
         }
       })
     );

     uploadImage.forEach(image => {
         if(image) formData.append("images", JSON.stringify(image));
     })
   } 

     mutate(formData, {
        onError: (err) => { 
            console.log(err)
        },
        onSuccess: () => {
          toast('Note created successfully', {
             autoClose: 5000,
          })
        }
     }) 
  }

  return (
    <div className="px-12 py-6 flex items-start justify-center h-full min-h-screen w-full">
      <div className="h-auto shadow-lg w-[85%] border rounded-xl">
      <form action="" onSubmit={submitData} encType="multipart/form-data">

        <div className='px-4 py-2 border'>
            <input 
               type="text" 
               className='w-full outline-none'
               value={noteData.title}
               onChange={(e) => setNoteData(prev => ({...prev, title: e.target.value}))}  
               placeholder="Title" 
            />
        </div>
          <div className="flex p-4 text-[#90A0A9] items-center">
             <HashtagInput 
                 tags={tags} 
                 setInputValue={setInputValue}  
                 inputValue={inputValue} 
                 handleKeyDown={handleKeyDown} 
                 handleDeleteTag={handleDeleteTag}
              />
          </div>
  
        <div className="px-4 py-2">
          <textarea
            value={noteData.text}
            onChange={(e) => setNoteData(prev => ({...prev, text: e.target.value}))}
            placeholder="Enter note"
            className="w-full outline-none h-auto indent-3 resize-none"
          />
        </div>

        <div className="my-4 h-auto max-w-full px-4">
           <div className='grid items-center w-full h-full grid-cols-2 gap-3 lg:grid-cols-4'>
             {images && images.map((image, i) =>
                <div key={i} className='flex items-start justify-between flex-row gap-2 w-max h-full border shadow-md px-4 py-4'>
                   <img key={i} src={URL.createObjectURL(image)} className='w-full max-w-[250px] h-full object-cover center' alt="Note images" />  
                   <X cursor='pointer' onClick={() => setImages(images.filter((_, index) => index !== i))} size={24} className='text-blue-800 z-20'/>
                </div>
             )}
           </div>
        </div>

        <div className="mb-6 flex-row items-center gap-8 justify-end flex me-6">
          <button
            className="flex items-center gap-2"
            onClick={() => addPhoto.current?.click()}
          >
            <Camera />
            <span className="font-medium">Add Photo</span>
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={addPhoto}
            multiple
            onChange={handleImageChange}
          />

          <button type='submit' className="bg-[#69a379] active:bg-[#3f8152] px-6 py-2 rounded-lg shadow-md">
            <p className="text-white">Submit</p>
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
