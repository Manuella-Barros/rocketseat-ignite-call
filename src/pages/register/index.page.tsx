import React, { useEffect } from 'react'
import { Container, Form, FormError, Header } from '@/pages/register/style'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { api } from '@/pages/api/axios'
import { router } from 'next/client'
import { toast } from 'sonner'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Mínimo 2 caracteres.' })
    .regex(/^([a-z\\-]+)$/i, { message: 'Apenas letras e hífens.' })
    .transform((value) => value.toLowerCase()),
  name: z.string().min(2, { message: 'Mínimo 2 caracteres.' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const route = useRouter()

  useEffect(() => {
    if (route.query) {
      setValue('username', String(route.query.username))
    }
  }, [setValue, route.query.username])

  async function handleRegister(data: RegisterFormData) {
    try {
      const response = await api.post('/users', data)

      await router.push('/register/connect-calendar')

      console.log(response)
    } catch (e) {
      toast.error('Usuário já existe')

      console.log(e)
    }
  }

  return (
    <Container>
      <Header>
        <Heading as={'strong'}>Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>
        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as={'form'} onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size={'sm'}>Nome do usuário</Text>
          <TextInput
            prefix={'ignite.com/'}
            placeholder={'seu usuário'}
            {...register('username')}
            crossOrigin
          />
          {errors.username && (
            <FormError size={'sm'}>{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text size={'sm'}>Nome completo</Text>

          <TextInput
            placeholder={'insira seu nome'}
            {...register('name')}
            crossOrigin
          />

          {errors.name && (
            <FormError size={'sm'}>{errors.name.message}</FormError>
          )}
        </label>

        <Button type={'submit'} disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}

export default Register
