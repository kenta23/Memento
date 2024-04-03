import { SignIn } from '@clerk/clerk-react'


const SignInPage = () => (
     <div className='w-full h-screen flex place-items-center justify-center'>
         <SignIn 
          path='/sign-in' 
          routing='virtual'
          signUpUrl='/sign-up'
          afterSignInUrl={'/'}
        />
     </div>
)

export default SignInPage;