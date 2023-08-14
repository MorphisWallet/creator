import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      const path = req.nextUrl.pathname

      if (path.startsWith('/admin')) {
        return token?.role === 'Admin'
      }

      return !!token
    },
  },
  pages: {
    signIn: '/',
  },
})
