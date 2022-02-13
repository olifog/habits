
const Day = ({ value, day }: {value: boolean, day: number}) => {
  const specificDay = new Date()
  specificDay.setDate(day)

  return (
    <div
      className={`w-5 h-5 rounded-md ${value ? 'bg-green-600' : 'bg-orange-500'}`}
      title={specificDay.toDateString()}
    />
  )
}

export const HistoryDisplay = ({ history, status }: {history: boolean[], status: boolean}) => {
  const displayHistory = [...history, status]

  const today = new Date()

  return (
    <div className="grid grid-cols-10 gap-2">
      {displayHistory.map((value, day) => (
        <Day key={day} value={value} day={today.getDate() - displayHistory.length + day + 1} />
      ))}
    </div>
  )
}
