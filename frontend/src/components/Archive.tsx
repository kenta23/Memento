import { Link } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import axios from "axios"
import { UploadButton } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
export default function Archive() {
 
  return (
    <div className="w-full px-12 py-6 h-full min-h-screen">
      <h1>Archive</h1>
       <button>
          <Link to={'/sign-up'}>Go to Sign up</Link>
       </button>
  
       <div>
          <h1>Uploadthing here</h1>
           <UploadButton 
           config={{
            mode: "manual"
           }}
           skipPolling={true}
           
            onClientUploadComplete={(res) => {
              console.log(`onClientUploadComplete`, res);
              alert("Upload Completed");
            }}
            onUploadBegin={() => {
              console.log(`onUploadBegin`);
            }}
             endpoint=""
             content={{
              button({ ready }) {
                  if(ready) return <p>Add photo</p>
              },
              allowedContent({ ready, fileTypes, isUploading }) {
                if (!ready) return "Checking what you allow";
                if (isUploading) return "Seems like stuff is uploading";
                return `Stuff you can upload: ${fileTypes.join(", ")}`;
              },
            }}
            
             />
       </div>
    </div>
  )
}
