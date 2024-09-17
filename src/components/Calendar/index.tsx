import { StyledCalendar } from '@/components/Calendar/styles'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { getWeekDays } from '@/utils/get-week-days'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/pages/api/axios'
import { useRouter } from 'next/router'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  onDateSelected: (date: Date) => void
  selectedDate?: Date | null
}

interface BlockedDatesProps {
  blockedWeekDays: number[]
  blockedDates: number[]
}
export default function Calendar({ onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })
  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')
  const shortWeekDays = getWeekDays({ short: true })
  const router = useRouter()
  const username = router.query.username

  const { data: blockedDates } = useQuery<BlockedDatesProps>({
    queryKey: [
      'blocked-days',
      currentDate.get('year'),
      currentDate.get('month') + 1,
    ],
    queryFn: async () => {
      const { data } = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.get('month') + 1,
        },
      })

      return data
    },
  })

  function handlePreviousMonth() {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  function handleNextMonth() {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from(
      { length: currentDate.daysInMonth() },
      (_, i) => {
        return currentDate.set('date', i + 1)
      },
    )

    const firstWeekDay = currentDate.get('day')
    const previousMonthFillArray = Array.from(
      { length: firstWeekDay },
      (_, i) => {
        return currentDate.subtract(i + 1, 'day')
      },
    )

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )

    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({ length: lastWeekDay }, (_, i) => {
      return currentDate.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((days) => {
        return { date: days, disabled: true }
      }),
      ...daysInMonthArray.map((days) => {
        return {
          date: days,
          disabled:
            blockedDates?.blockedWeekDays.includes(days.get('day')) ||
            blockedDates?.blockedDates.includes(days.get('date')) ||
            days.endOf('day').isBefore(),
        }
      }),
      ...nextMonthFillArray.map((days) => {
        return { date: days, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <StyledCalendar.Container>
      <StyledCalendar.Header>
        <StyledCalendar.Title>
          {currentMonth} <span>{currentYear}</span>
        </StyledCalendar.Title>

        <StyledCalendar.Actions>
          <button>
            <CaretLeft onClick={handlePreviousMonth} />
          </button>
          <button>
            <CaretRight onClick={handleNextMonth} />
          </button>
        </StyledCalendar.Actions>
      </StyledCalendar.Header>

      <StyledCalendar.Body>
        <thead>
          <tr>
            {shortWeekDays.map((day, i) => (
              <th key={i}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <StyledCalendar.Day
                        onClick={() => onDateSelected(date.toDate())}
                        disabled={disabled}
                      >
                        {date.get('date')}
                      </StyledCalendar.Day>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </StyledCalendar.Body>
    </StyledCalendar.Container>
  )
}
