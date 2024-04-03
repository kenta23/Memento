import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import SignInPage from './sign-in/[[...index]].tsx'
import SignUpPage from './sign-up/[[...index]].tsx'
import Root from './Root.jsx' 
import Archive from './components/Archive.tsx'
import { Link } from 'react-router-dom'
import SignIn from './components/Signin.tsx'
import Note from './components/Note.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { extractRouterConfig } from "uploadthing/server";
import Allnotes from './components/Allnotes.tsx'
import { OurFileRouter } from '../../backend/src/uploadthing.ts'
import CreateNew from './components/CreateNew.tsx'
// Import your publishable key

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
 
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient();

const router = createBrowserRouter([
   {
     path: '/',
     element: <Root />,
     errorElement: <div>GO BACK TO HOMEPAGE <Link to="/">Home</Link></div>,
     children: [
           {
            path: '/all-notes',
            element: <Allnotes />,
           },
           {
            path: '/note/:id',
            element: <Note />,
           },
           {
            path: '/archives',
            element: <Archive />,
           },
           {
            path: 'create-new',
            element: <CreateNew />
           }
       ],
   }, 
   {
    path: '/sign-in',
    element: <SignInPage />,
   }, 
   {
    path: '/sign-up',
    element: <SignUpPage />,
   },
   {
      path: '/archive',
      element: <Archive />,

   },
   {
    path: '/signin',
    element: <SignIn />
   },
], {
   future: {
      v7_partialHydration: true
   }
})

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
  <React.StrictMode>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
         <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
         </QueryClientProvider>
     </ClerkProvider>
  </React.StrictMode>,
)
