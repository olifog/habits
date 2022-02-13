import { Habit } from '~/models/Habit/habit'
import { useState, MouseEvent } from 'react'
import { Link } from 'remix'

export const StreakDisplay = ({
  text,
  streak,
  bg = 'from-slate-200 to-slate-50'
}: {
  text: string,
  streak: number,
  bg?: string
}) => (
  <div className="flex flex-col w-14 items-center">
    <span className="text-sm text-gray-800 font-semibold">{text}</span>
    <div className={`flex rounded-full font-bold text-2xl bg-gradient-to-tl font-mono w-10 h-10 justify-center items-center ${bg}`}>
      <p>{streak}</p>
    </div>
  </div>
)

export default function HabitDisplay ({ habit, updateDB }: {habit: Habit, updateDB: (habit: Habit) => Promise<void> }) {
  const [done, setDone] = useState(habit.status)

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).tagName === 'path') return
    habit.status = !done
    setDone(!done)
    await updateDB(habit)
  }

  return (
    <div
      className={`relative w-48 h-48 rounded-[3rem] shadow-2xl m-2 cursor-pointer bg-gradient-to-br ${done ? 'from-green-600 to-green-700' : 'from-orange-500 to-orange-600'}`}
      onClick={handleClick}
    >
      <Link to={`/habit/${habit.habitid}`} prefetch="intent" className="absolute top-3 right-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </Link>
      <div className="h-full flex flex-col">
        <div className="absolute flex justify-center text-5xl self-center pt-4">
          <span>{habit.emoji}</span>
        </div>
        <div className="h-full flex flex-col place-content-center">
          <div className="flex justify-center">
            <span className="text-white font-bold px-2 text-center">{habit.name}</span>
          </div>
        </div>
      </div>
      {done && (
        <div className="absolute w-full px-4 bottom-2 flex justify-around">
          <StreakDisplay text="Streak" streak={habit.streak + 1} />
          <StreakDisplay text="Record" streak={Math.max(habit.longestStreak, habit.streak + 1)} />
        </div>
      )}
    </div>
  )
}
