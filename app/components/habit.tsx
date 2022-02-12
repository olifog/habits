import { Habit } from '~/models/Habit/habit'
import { useState, MouseEvent } from 'react'
import { Link } from 'remix'

export default function HabitDisplay ({ habit, updateDB }: {habit: Habit, updateDB: (habit: Habit) => Promise<void> }) {
  const [done, setDone] = useState(habit.status)

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'svg') return
    habit.status = !done
    setDone(!done)
    await updateDB(habit)
  }

  return (
    <div
      className={`relative w-48 h-48 rounded-[3rem] shadow-xl m-2 cursor-pointer ${done ? 'bg-green-600' : 'bg-orange-500'}`}
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
            <span className="text-gray-100">{habit.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
