import React from 'react'
import { Container, Header } from '@/pages/register/style'
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import {
  ErrorMessage,
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from '@/pages/register/time-intervals/styles'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { getWeekDays } from '@/utils/get-week-days'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertStringTimeToMinute } from '@/utils/convert-string-time-to-minute'
import { api } from '@/pages/api/axios'
import { useRouter } from 'next/router'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number(),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length, {
      message: 'Precisa habilitar ao menos um dia',
      path: [''],
    })
    .transform((intervals) =>
      intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeMinutes: convertStringTimeToMinute(interval.startTime),
          endTimeMinutes: convertStringTimeToMinute(interval.endTime),
        }
      }),
    )
    .refine(
      (intervals) =>
        intervals.every(
          (interval) => interval.endTimeMinutes > interval.startTimeMinutes,
        ),
      {
        message: 'Horario de término deve ser maior do que o de início',
        path: [''],
      },
    ),
})

type TimeIntervalsFormSchemaInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormSchemaOutput = z.output<typeof timeIntervalsFormSchema>

function TimeIntervals() {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormSchemaInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })
  const router = useRouter()

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormSchemaOutput

    await api.post('users/time-intervals', { intervals })
    router.push('/register/update-profile/')
  }

  const weekdays = getWeekDays()
  const intervals = watch('intervals')

  return (
    <Container>
      <Header>
        <Heading as={'strong'}>Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalsContainer>
          {fields.map((field, i) => {
            return (
              <IntervalItem key={i}>
                <IntervalDay>
                  <Controller
                    name={`intervals.${i}.enabled`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Checkbox
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                          checked={field.value}
                        />
                      )
                    }}
                  />
                  <Text>{weekdays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    size={'sm'}
                    type={'time'}
                    step={60}
                    crossOrigin={undefined}
                    disabled={!intervals[i].enabled}
                    {...register(`intervals.${i}.startTime`)}
                  />
                  <TextInput
                    size={'sm'}
                    type={'time'}
                    step={60}
                    crossOrigin={undefined}
                    disabled={!intervals[i].enabled}
                    {...register(`intervals.${i}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            )
          })}
        </IntervalsContainer>

        {errors.intervals && (
          <ErrorMessage>{errors.intervals.message}</ErrorMessage>
        )}

        <Button disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}

export default TimeIntervals
