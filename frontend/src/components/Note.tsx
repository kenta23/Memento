import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Archive, Camera, Check, FolderClosed, Heart, Tags, X } from 'lucide-react';
import React, {  useRef, useState, KeyboardEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { noteData } from '@/types';
import {  FieldValues, useForm } from 'react-hook-form'
import { useEdgeStore } from '@/lib/edgestore';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { deleteNote } from '@/lib/data';
import { useToast } from './ui/use-toast';

export default function Note() {
  const { id } = useParams();
  const [edit, setEdit] = useState<boolean>(false);
  const { userId } = useAuth();
 
  const { data, isLoading } = useQuery({
    queryKey: ['note'], 
    queryFn: async () => axios.get(`http://localhost:3000/api/note/${id}`, {
      headers: { 'Authorization': `Bearer ${userId}` }
    }),
  })

  console.log('MY DATAs', data);

  //DEFAULT is not editing

  //view the note first based on note id
  return (
    <div className="lg:px-12 py-6 flex items-start justify-center h-full min-h-screen w-min md:w-full">
      <div className="h-auto shadow-lg w-[85%] border rounded-xl">
        {isLoading ? <p>loading</p> : edit ? <EditNote id={id as string} setEdit={setEdit} data={data?.data} /> : <ViewNote data={data?.data} setEdit={setEdit} />}
      </div>
    </div>
  );
}

function EditNote({ setEdit, data, id }: { data: noteData, setEdit:  React.Dispatch<React.SetStateAction<boolean>>, id: string }) {
  const {register, handleSubmit, reset, formState, setValue, resetField } = useForm({ 
    defaultValues: {
      title: '',
      note: '',
    }
  });
  const { userId } = useAuth();
  const { edgestore } = useEdgeStore();
  const queryClient = useQueryClient();


  const [inputValue, setInputValue] = useState<string>('')
  const [tags, setTags] = useState<string[]>([]);

  const { data: item, mutate, isPending, isSuccess } = useMutation({
    mutationKey: ['updatedata'],
    onSettled: async () => {
       return await queryClient.invalidateQueries({ queryKey: ['note'] })
    },
    mutationFn: async(val: FormData) => await axios.post('/updatedata', val,  {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userId}`
     }, 
    })
  })
  const addPhoto = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);


    async function submitData(data: FieldValues) {
        const formData = new FormData();
         if(images.length) {
          try {
            //MULTIPLE IMAGE UPLOAD
            await Promise.all(
              images.map(async (image) => {
                try {
                  const res = await edgestore.publicFiles.upload({
                    file: image,
                    onProgressChange: async (progress) => {
                      toast.loading(`Uploading ${progress}%`);
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
                  toast.error("Failed to upload image");
                  console.error("Error uploading image:", error);
                }
              })
            ); 
        
         } catch(error) {
            console.log(error)
         } 
      }

      formData.append('title', data?.title);
      formData.append('note', data?.note);
      formData.append('tags', JSON.stringify(tags));
      formData.append('id', id);

     mutate(formData, {
      onSuccess: (res) => {
         console.log('Succesfully updated data', res);
         setTags([]);
         setImages([]);
         setEdit(false);

         reset({
          title: '',
          note: ''
        })
      }, 
      onError: (error) => {
         console.log('Error updating data', error);
      }
    })

    for(const entry of formData.entries()) {
      console.log(entry[0], entry[1])
   }
    
  }

    function handleDeleteTag () {

    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim() !== '') {
        e.preventDefault();
        setTags([...tags, inputValue.trim()]);
        setInputValue('');
      }
    };
  

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files; 
      if (file) {
          const newImage = Array.from(file);
          setImages(prevImage => [...prevImage, ...newImage]);
        }
     }


  return (
    <div className="">
      <form method="POST" onSubmit={handleSubmit(submitData)}>
        {/**TAGS HERE */}
        <div className="flex p-4 text-[#90A0A9] items-center">
          <div className="flex items-center">
            <div className="flex items-center space-x-1  ">
              {data.Tags.map((tag) =>
                tag.tagNames.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 text-red-600"
                  >
                    <Tags />
                    <span>{name}</span>
                      <X />
                  </div>
                ))
              )}

              {tags && tags.map((tag, i) =>
                  <div
                    key={i}
                    className="flex items-center gap-1 text-red-600"
                  >
                    <Tags />
                    <span>{tag}</span>
                    <X />
                  </div>
              )}
            </div>

            <input
              type="text"
              onKeyDown={handleKeyDown}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add tag"
              className="outline-none p-2"
            />
          </div>
        </div>

        <div className="px-4 py-2 border">
          <input
            {...register("title")}
            type="text"
            className="w-full outline-none"
            placeholder="Title"
          />
        </div>

        <div className="px-4 py-2">
          <textarea
            {...register("note", {
              maxLength: { value: 500, message: "Maximum value reached" },
            })}
            //value={noteData.text}
            //onChange={(e) => setNoteData(prev => ({...prev, text: e.target.value}))}
            placeholder="Enter note"
            className="w-full outline-none h-auto indent-3 resize-none"
            defaultValue={data?.text || ''}
          />
        </div>

        <div className="my-4 h-auto max-w-full px-4">
          <div className="grid items-center w-full h-full grid-cols-2 gap-3 lg:grid-cols-4">
            {data.Images &&
              data.Images.map((image) => (
                <div
                  key={image.id}
                  className="flex relative items-start justify-between flex-row gap-2 w-full h-full border shadow-md px-4 py-4"
                >
                  <img
                    src={image.url}
                    className="w-full max-w-[250px] h-full object-cover center"
                    alt="Note images"
                  />
                  <X
                    cursor="pointer"
                    size={24}
                    className="text-blue-800 z-20 absolute right-2 top-2"
                  />
                </div>
              ))}

            {images &&
              images.map((image, i) => (
                <div
                  key={i}
                  className="flex items-start relative justify-between flex-row gap-2 w-full h-full border shadow-md px-4 py-4"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    className="w-full max-w-[250px] h-full object-cover center"
                    alt="Note images"
                  />
                  <X
                    cursor="pointer"
                    onClick={() =>
                      setImages(images.filter((_, index) => index !== i))
                    }
                    size={24}
                    className="text-blue-800 absolute top-2 right-2 z-20"
                  />
                </div>
              ))}
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

          <button
            type="submit"
            className="bg-[#69a379] active:bg-[#3f8152] px-6 py-2 rounded-lg shadow-md"
          >
            <p className="text-white">Submit</p>
          </button>
        </div>
      </form>
    </div>
  );
}
function ViewNote({ setEdit, data }: { setEdit:  React.Dispatch<React.SetStateAction<boolean>>, data: noteData}) {
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const { userId } = useAuth();
   const { toast } = useToast()

  async function deletedata() {
     try {
      deleteNote(data.id, userId as string);

      queryClient.invalidateQueries({ queryKey: ['note', 'allnotes']});
      console.log('successfully deleted data');
      toast({
         title: "Deleted",
         description: 
          <div className='flex w-full flex-row gap-4 items-center justify-between'>
             <p>Successfully deleted data</p>
             <Check color='#68e988' size={24}/>
         </div>
      })
      
      setEdit(false);
      navigate('/all-notes');

     } catch (error) {
        console.log(error);
     }
   }

   async function archiveNote(id: number) {
    try {
       const data = await axios.post(`http://localhost:3000/api/archivenote/${id}`, null, {
        headers: {
          "Authorization": `Bearer ${userId}`
        } 
      })
      console.log('successfully archived note');
      toast({
        title: `Archived`,
        description: data.data.title
      })
      queryClient.invalidateQueries({ queryKey: ['note', 'allnotes']});
      setEdit(false);
      //add toast here 
     } catch (error) {
        console.log(error); 
        toast({ 
          title: "Error", 
          description: <p>Something went wrong</p>
      })
     }
   }

   async function favoriteNote(id: number) {
    try {
      const data = await axios.post(`http://localhost:3000/api/favorite/${id}`, null, {
       headers: {
         "Authorization": `Bearer ${userId}`
       } 
     })
     console.log('successfully added to favorites');
     toast({
       title: `Added to favorites`,
       description: data.data.title
     })
     setEdit(false);
     //add toast here 
    } catch (error) {
       console.log(error);
       toast({ 
         title: "Error", 
         description: <p>Something went wrong</p>
     })
    }
   }

   
  return (
    <>
      {data && (
        <>
          <div className="px-4 py-2 w-full">
            <div className="flex items-center space-x-1  ">
              {data.Tags.map((tag) =>
                tag.tagNames.map((name, i) => (
                  <div key={i} className="flex items-center gap-1 text-red-600">
                    <Tags />
                    <span>{name}</span>
                    <X />
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="px-4 py-2 border w-full">
            <h1 className="text-xl  font-medium">Title: {data.title}</h1>
          </div>
          <div className="px-4 py-2">
            <p>{data.text}</p>
          </div>
          <div className="my-4 h-auto w-full max-w-full px-4">
            <div className="grid items-center w-full h-full grid-cols-2 gap-3 lg:grid-cols-4">
              {data.Images &&
                data.Images.map((image) => (
                  <div
                    key={image.id}
                    className="flex items-start relative justify-between flex-row gap-2 w-full h-full border shadow-md px-4 py-4"
                  >
                    <img
                      src={image.url}
                      className="w-full max-w-[250px] h-full object-cover center"
                      alt="Note images"
                    />
                    <X
                      cursor="pointer"
                      size={24}
                      className="text-black z-20 absolute top-2 right-2"
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="flex px-4 py-2 mt-12 w-full justify-between items-center">
            <div className="mb-6 flex-row items-center gap-4 justify-end flex me-6">
              <Heart
                cursor={"pointer"}
                color="#E26666"
                className={`${data.favorite ? "fill-[#E26666]" : "fill-none"}`}
                onClick={() => favoriteNote(data.id)}
              />
              <Archive
                cursor={"pointer"}
                color="#3D603D"
                className={`${data.archived ? "fill-[#3D603D]" : "fill-none"}`}
                onClick={() => archiveNote(data.id)}
              />
              <FolderClosed cursor={"pointer"} color="#3E3BC8" className={``} />
            </div>
            <div className="mb-6 flex-row items-center gap-4 justify-end flex me-6">
              <Dialog>
                <div className="flex items-center gap-1 text-[#3B95C8]">
                  <DialogTrigger>
                    <span className="text-white bg-[#DE2828] active:bg-[#3f8152] px-6 py-2 rounded-lg shadow-md">
                      Delete
                    </span>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-100 shadow-xl space-y-6">
                    <DialogHeader>
                      <DialogTitle>
                        <p>Delete note</p>
                      </DialogTitle>
                      <DialogDescription>
                          <span>
                            Are you sure you want to delete this note?
                          </span>

                            <button
                              onClick={deletedata}
                              className="bg-[#DE2828] active:bg-[#813f3f] px-6 py-2 mx-6 rounded-lg shadow-md"
                            >
                              <span className="text-white">Delete</span>
                            </button>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </div>
              </Dialog>

              <button
                onClick={() => setEdit(true)}
                className="bg-[#E0C460] active:bg-[#3f8152] px-6 py-2 rounded-lg shadow-md"
              >
                <span className="text-white">Edit</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
