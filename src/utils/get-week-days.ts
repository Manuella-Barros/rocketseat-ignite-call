interface IGetWeekDaysProps {
  short?: boolean
}

export function getWeekDays({ short = false }: IGetWeekDaysProps = {}) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from({ length: 7 }, (_, day) => {
    if (short)
      return formatter.format(new Date(Date.UTC(2021, 5, day))).substring(0, 3)

    return formatter.format(new Date(Date.UTC(2021, 5, day)))
  })
}
