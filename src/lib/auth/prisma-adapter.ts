import { Adapter } from 'next-auth/adapters'
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { destroyCookie, parseCookies } from 'nookies'
// requisicao para poder pegar os cookies

export default function PrismaAdapter(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): Adapter {
  return {
    async createUser(user) {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })

      if (!userIdOnCookies) {
        throw new Error('User not found on cookies')
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          avatar_url: user.avatar_url,
          email: user.email,
        },
      })

      destroyCookie({ res }, '@ignitecall:userId', { path: '/' })

      return {
        id: prismaUser.id,
        email: prismaUser.email!,
        name: prismaUser.name,
        avatar_url: prismaUser.avatar_url!,
        username: prismaUser.username,
        emailVerified: null,
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({ where: { id } })

      if (!user) return null

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        avatar_url: user.avatar_url!,
        username: user.username,
        emailVerified: null,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) return null

      return {
        id: user.id,
        email: user.email!,
        name: user.name,
        avatar_url: user.avatar_url!,
        username: user.username,
        emailVerified: null,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: { user: true },
      })

      if (!account) return null

      return {
        id: account.user.id,
        username: account.user.username,
        emailVerified: null,
        email: account.user.email!,
        avatar_url: account.user.avatar_url!,
        name: account.user.name,
      }
    },

    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: user.email,
          avatar_url: user.avatar_url,
          name: user.name,
          username: user.username,
        },
      })

      return {
        id: prismaUser.id,
        email: prismaUser.email!,
        name: prismaUser.name,
        avatar_url: prismaUser.avatar_url!,
        username: prismaUser.username,
        emailVerified: null,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          provider_account_id: account.providerAccountId,
          provider: account.provider,
          type: account.type,
          scope: account.scope,
          expires_at: account.expires_at,
          id_token: account.id_token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          token_type: account.token_type,
          session_state: account.session_state,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      const session = await prisma.session.create({
        data: {
          user_id: userId,
          session_token: sessionToken,
          expires,
        },
      })

      return {
        sessionToken: session.session_token,
        expires: session.expires,
        userId: session.user_id,
      }
    },

    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!prismaSession) return null

      const { user, ...session } = prismaSession

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!,
          emailVerified: null,
          avatar_url: user.avatar_url!,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken: prismaSession.session_token,
        userId: prismaSession.user_id,
        expires: prismaSession.expires,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({ where: { session_token: sessionToken } })
    },
  }
}
