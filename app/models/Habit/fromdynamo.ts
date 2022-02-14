import { AttributeValue } from '@aws-sdk/client-dynamodb'
import { Habit } from './habit'
import todynamo from './todynamo'

interface Item {
  [key: string]: AttributeValue;
}

const fromDynamo = (habitResponse: Item): Habit => {
  const lastChecked = parseInt(habitResponse.lastChecked.S!)
  const today = Math.floor(new Date().getTime() / 8.64e7)

  const habit = {
    githubid: habitResponse.githubid.S!,
    habitid: habitResponse.habitid.S!,
    name: habitResponse.name.S!,
    status: habitResponse.status.BOOL!,
    emoji: habitResponse.emoji.S!,
    streak: parseInt(habitResponse.streak.N!),
    longestStreak: parseInt(habitResponse.longestStreak.N!),
    history: habitResponse.history.L!.map((day) => day.BOOL!),
    lastChecked: today
  }

  if (today > lastChecked) {
    habit.history.push(habit.status)
    if (habit.status) {
      habit.streak++
    } else {
      habit.streak = 0
    }
    habit.longestStreak = Math.max(habit.longestStreak, habit.streak)
    habit.status = false
    const diff = today - lastChecked - 1 // minus extra one for the initial status

    for (let x = 0; x < diff; x++) { habit.history.push(false) }
    if (diff > 0) {
      habit.streak = 0
    }

    todynamo(habit)
  }

  return habit
}

export default fromDynamo
