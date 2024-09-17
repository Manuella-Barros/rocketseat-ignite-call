import React from 'react'
import CalendarStep from '@/pages/schedule/[username]/schedule-form/CalendarStep'
import { ConfirmStep } from '@/pages/schedule/[username]/schedule-form/ConfirmStep'

function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | null>()

  function handleSelectTime(date: Date | null) {
    setSelectedDateTime(date)
  }

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={() => handleSelectTime(null)}
      />
    )
  }

  return <CalendarStep onSelectDate={handleSelectTime} />
}

export default ScheduleForm
