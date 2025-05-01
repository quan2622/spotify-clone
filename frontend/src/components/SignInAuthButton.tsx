import { useSignIn } from "@clerk/clerk-react"
import { Button } from "./ui/button";

const SignInAuthButton = () => {
  const { signIn, isLoaded } = useSignIn();

  const signWithGoogle = () => {
    signIn?.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/auth-callback',
    })
  }

  if (!isLoaded) return null;
  return (
    <Button variant={"secondary"} className="w-full text-white border-zinc-200 h-8" onClick={signWithGoogle}>
      Continue with Google
    </Button>
  )
}

export default SignInAuthButton