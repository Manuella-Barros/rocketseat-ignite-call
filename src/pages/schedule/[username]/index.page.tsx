import React from 'react'
import { Container, UserHeader } from '@/pages/schedule/[username]/styles'
import { Avatar, Heading, Text } from '@ignite-ui/react'
import { prisma } from '@/lib/prisma'
import { GetStaticPaths, GetStaticProps } from 'next'
import ScheduleForm from '@/pages/schedule/[username]/schedule-form/schedule-form'

interface IScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function IndexPage({
  user: { name, bio, avatarUrl },
}: IScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={avatarUrl} />
        <Heading>{name}</Heading>
        <Text>{bio}</Text>

        <ScheduleForm />
      </UserHeader>
    </Container>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)
  console.log(username)

  const user = await prisma.user.findUnique({
    where: { username },
  })

  console.log(user)

  if (!user) return { notFound: true }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // recarrega 1 vez por dia
  }
}
