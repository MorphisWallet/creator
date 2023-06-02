import { type NextApiRequest, type NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import { authOptions } from '@/server/auth'

const Auth = (req: NextApiRequest, res: NextApiResponse): unknown => {
  const authOpts = authOptions({ req })

  return NextAuth(req, res, authOpts)
}

export default Auth
