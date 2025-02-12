import { Button, Image } from '@mantine/core'
import Google from '../public/Google.svg'
import { GToast } from './common/GToast'

export const GoogleSignIn = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const redirectUri = `${window.location.origin}/integration/callback`
  const scope = 'openid email profile'
  const responseType = 'code'
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=consent`
  console.log(googleAuthUrl)

  const handleGoogleLogin = async () => {
    try {
      window.location.href = googleAuthUrl
    } catch {
      GToast.error({
        title: 'Login with Google failed!'
      })
    }
  }

  return (
    <Button
      variant="outline"
      radius="md"
      leftSection={<Image src={Google} h={20} />}
      onClick={handleGoogleLogin}
    >
      Login with Google
    </Button>
  )
}
