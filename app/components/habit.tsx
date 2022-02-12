
export default function HabitDisplay({
  habit
}: {
  habit: string
}) {
  return (
    <div className="w-32 h-32 rounded-3xl shadow-xl bg-orange-500 m-2">
      <div className="h-full flex flex-col place-content-center">
        <div className="flex justify-center">
          <span className="text-gray-200">
            {habit}
          </span>
        </div>
      </div>
    </div>
  )
}
