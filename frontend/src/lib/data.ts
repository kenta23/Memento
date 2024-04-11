import axios from "axios";


export async function deleteNote(id: number, userId: string) {
   try {
    const res = await axios.post(`http://localhost:3000/api/delete/${id}`, null, {

        headers: {
            'Authorization': `Bearer ${userId}`,
        }
    })
    console.log(res.data);
    
   } catch (error) {
     console.log(error)
   }
}