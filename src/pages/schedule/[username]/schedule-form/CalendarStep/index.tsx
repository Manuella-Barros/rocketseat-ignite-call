import React from 'react'
import {
  Container,
  TimePicker,
} from '@/pages/schedule/[username]/schedule-form/CalendarStep/styles'
import Calendar from '@/components/Calendar'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { api } from '@/pages/api/axios'
import { useQuery } from '@tanstack/react-query'

interface IAvailability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface ICalendarStepProps {
  onSelectDate: (date: Date) => void
}

export default function CalendarStep({ onSelectDate }: ICalendarStepProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>()

  const isDateSelected = !!selectedDate
  const router = useRouter()
  const username = String(router.query.username)

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery<IAvailability>({
    queryKey: ['availability', selectedDateWithoutTime],
    queryFn: async () => {
      const { data } = await api.get(`/users/${username}/avaiability`, {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
        },
      })

      return data
    },
    enabled: isDateSelected,
  })

  function HandleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate).set('hour', hour).startOf('hour')

    onSelectDate(dateWithTime.toDate())
  }

  const weekDay = selectedDate ? dayjs(selectedDate).format('ddd') : null
  const describedWeedDay = selectedDate
    ? dayjs(selectedDate).format('DD [ de ] MMMM')
    : null

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker.Container>
          <TimePicker.Header>
            {weekDay} - <span>{describedWeedDay}</span>
          </TimePicker.Header>

          <TimePicker.List>
            {availability?.possibleTimes?.map((hour) => {
              return (
                <TimePicker.Item
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                  onClick={() => HandleSelectTime(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimePicker.Item>
              )
            })}
          </TimePicker.List>
        </TimePicker.Container>
      )}
    </Container>
  )
}
