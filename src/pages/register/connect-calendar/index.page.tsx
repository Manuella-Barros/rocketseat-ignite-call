import React from 'react'
import { Container, Header } from '@/pages/register/style'
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import {
  ConnectBox,
  ConnectItem,
} from '@/pages/register/connect-calendar/styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function Register() {
  const { data, status } = useSession()
  const { query } = useRouter()
  const hasAuthError = !!query.error
  const isSignIn = status === 'authenticated'

  return (
    <Container>
      <Header>
        <Heading as={'strong'}>Conecte sua agenda</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>
        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          <Button
            disabled={!!data?.user?.email}
            variant={'secondary'}
            size={'sm'}
            onClick={() => signIn('google')}
          >
            Conectar
            <ArrowRight />
          </Button>
        </ConnectItem>

        {hasAuthError && <Text>Falha ao conectar ao goole</Text>}

        <Button type={'submit'} disabled={!isSignIn}>
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}

export default Register
