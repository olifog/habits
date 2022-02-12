import client from '~/utils/dynamodb'
import { Habit } from './habit'
import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'

const toDynamo = async (habit: Habit): Promise<void> => {
  const params: PutItemCommandInput = {
    TableName: 'habits_habits.olifog.com',
    Item: {
      githubid: { S: habit.githubid },
      habitid: { S: habit.habitid },
      name: { S: habit.name },
      emoji: { S: habit.emoji },
      status: { BOOL: habit.status },
      streak: { N: habit.streak.toString() },
      longestStreak: { N: habit.longestStreak.toString() },
      lastChecked: { S: habit.lastChecked.toString() },
      history: { L: habit.history.map((day) => ({ BOOL: day })) }
    }
  }

  await client.send(new PutItemCommand(params))
}

export default toDynamo
