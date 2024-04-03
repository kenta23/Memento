import { SignUp } from '@clerk/clerk-react'


const SignUpPage = () => (
  <div className="w-full h-screen flex place-items-center justify-center">
    <SignUp path="/sign-up" routing="virtual" signInUrl="/sign-in" afterSignUpUrl={'/'}/>
  </div>
);

export default SignUpPage;