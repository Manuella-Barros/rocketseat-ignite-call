import React from 'react'
import {
  Form,
  FormAnnotation,
} from '@/pages/home/components/claimUserame/style'
import { Button, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

const claimUsernameSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Mínimo 2 caracteres.' })
    .regex(/^([a-z\\-]+)$/i, { message: 'Apenas letras e hífens.' })
    .transform((value) => value.toLowerCase()),
})

type IClaimUsername = z.infer<typeof claimUsernameSchema>

function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IClaimUsername>({
    resolver: zodResolver(claimUsernameSchema),
  })

  const route = useRouter()

  async function handleClaimUsername(data: IClaimUsername) {
    await route.push(`/register?username=${data.username}`)
  }

  return (
    <>
      <Form as={'form'} onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size={'sm'}
          prefix={'ignite.com/'}
          placeholder={'seu usuário'}
          {...register('username')}
          crossOrigin
        ></TextInput>

        <Button type={'submit'} disabled={isSubmitting}>
          Reservar <ArrowRight />
        </Button>
      </Form>

      {errors && (
        <FormAnnotation>
          <Text>{errors.username?.message}</Text>
        </FormAnnotation>
      )}
    </>
  )
}

export default ClaimUsernameForm
