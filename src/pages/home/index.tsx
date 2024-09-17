import { Container, Hero, Preview } from '@/pages/home/style'
import { Heading, Text } from '@ignite-ui/react'
import appPreview from '../../assets/appPreview.png'
import Image from 'next/image'
import ClaimUsernameForm from '@/pages/home/components/claimUserame/ClaimUsernameForm'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading size={'4xl'}>Agendamento descomplicado</Heading>
        <Text size={'lg'}>
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>
        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image
          src={appPreview}
          height={400}
          alt={'Preview do aplicativo'}
          priority
        />
      </Preview>
    </Container>
  )
}
