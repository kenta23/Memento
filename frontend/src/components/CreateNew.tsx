import { Camera, Check, X, } from 'lucide-react'
import React, { useRef, useState, KeyboardEvent } from 'react'
import HashtagInput from './Tags'
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {  useUser } from '@clerk/clerk-react';
import { useEdgeStore } from '@/lib/edgestore';
import { useForm, FieldValues } from 'react-hook-form'
import { useToast } from './ui/use-toast';

export default function CreateNew() {
    const addPhoto = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);
    const { user } = useUser();
    const { register, formState: { errors }, setValue, handleSubmit, reset: resetFields } = useForm({
      defaultValues: {
          title: '',
          note: ''
      }
    });
    const { edgestore } = useEdgeStore();
    const { toast } = useToast();
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [imageData, setImageData] = useState([{
      url: '',
      thumb: ''
    }])
    const {data, isError, mutate, status, isPending, reset } = useMutation({
      mutationFn: async (newdata: FormData) => await axios.post('/postdata', newdata, {
          headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${user?.id}`
          },
      })
    })

    console.log(data);
  
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

  async function submitData(data: FieldValues) {
   const formData = new FormData();
   if (images.length) {
    try {
      //MULTIPLE IMAGE UPLOAD
     if(images.length > 1){
      await Promise.all(
        images.map(async (image) => {
          try {
            const res = await edgestore.publicFiles.upload({
              file: image,
              onProgressChange: async (progress) => {
                toast({
                    title: `Uploading ${progress}%`
                });
              },
            });
  
            // Append image data to formData     
            const imageUploaded = { 
              url: res.url, 
              thumb: res.thumbnailUrl as string 
            };
            formData.append("imageData", JSON.stringify(imageUploaded));
            //formData.append("url", res.url);
            //formData.append('thumbnail', res.thumbnailUrl as string);
          } catch (error: unknown) {
            toast({
               title: "Failed to upload image"
            });
            console.error("Error uploading image:", error);
          }
        })
      ); 
     }
     else {
         //SINGLE IMAGE UPLOAD
       const res = await edgestore.publicFiles.upload({
          file: images[0],
          onProgressChange: async (progress) => {
            toast({
               title: `Uploading ${progress}%`
            });
          },
       })
      
       // Append image data to formData
        // Check if res.url and res.thumbnailUrl are defined before appending

          const imageUploaded = {
            url: res.url,
            thumb: res.thumbnailUrl as string,
          }
          
          formData.append("imageData", JSON.stringify(imageUploaded));
        }     
   } catch(error) {
      console.log(error)
   } 
  }

  formData.append('title', data?.title)
  formData.append('note', data?.note);
  formData.append('tags', JSON.stringify(tags));
  formData.append('userid', user?.id as string);

  mutate(formData, {
    onError: (err) => { 
        console.log(err)
    },
    onSuccess: () => {
      toast({
          title: "Successfully created new note",
          description: 
          <div className='flex w-full flex-row gap-4 items-center justify-between'>
          <p>new note created</p>
          <Check color='#68e988' size={24}/>
      </div>
      })
      reset();
      setImages([]);
      setTags([]);
      resetFields({
        note: '',
        title: ''
      })
    }
 }, ) 
   for(const entry of formData.entries()) {
      console.log(entry[0], entry[1])
   }
   
}
  return (
    <div className="lg:px-12 py-6 flex items-start justify-center h-full min-h-screen w-min md:w-full">
      <div className="h-auto shadow-lg w-full md:w-[85%] border rounded-xl">
      <form method='POST' onSubmit={handleSubmit(submitData)} >
        <div className='px-4 py-2 border'>
            <input 
               {...register('title')}
               type="text"   
               className='w-full outline-none'
               //value={noteData.title}
               //onChange={(e) => setNoteData(prev => ({...prev, title: e.target.value}))}  
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
             {...register('note', { maxLength: { value: 500, message: "Maximum value reached" } })}
            //value={noteData.text}
            //onChange={(e) => setNoteData(prev => ({...prev, text: e.target.value}))}
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
            type="button"
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
