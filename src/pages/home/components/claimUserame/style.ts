import { Text, Box, styled } from '@ignite-ui/react'

export const Form = styled(Box, {
  display: 'flex',
  marginTop: 10,
  padding: 10,
  width: '95%',
  gap: 10,
})

export const FormAnnotation = styled('div', {
  [`${Text}`]: {
    color: 'red',
  },
  paddingTop: 5,
})
