import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return !!token
    },
  },
  pages: {
    signIn: '/',
  },
})

export const config = { matcher: ['/dashboard/(.*)'] }
