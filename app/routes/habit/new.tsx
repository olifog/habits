import { ActionFunction, redirect } from '@remix-run/server-runtime'
import { authenticator } from '~/services/auth.server'
import { today } from '~/utils/today'
import { PutItemCommand, PutItemCommandInput, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb'
import client from '~/utils/dynamodb'
import { useLoaderData } from 'remix'

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/github'
  })
  const habitInput = await request.formData()

  const updateParams: UpdateItemCommandInput = {
    TableName: 'habit_id_habits.olifog.com',
    Key: {
      id: { S: '0' }
    },
    UpdateExpression: 'SET habit_id = habit_id + :a',
    ExpressionAttributeValues: {
      ':a': { N: '1' }
    },
    ReturnValues: 'UPDATED_NEW'
  }

  const newHabitidDoc = await client.send(new UpdateItemCommand(updateParams))

  if (newHabitidDoc.Attributes === undefined) {
    throw new Error('FATAL: habit_id table broken')
  }

  const putParams: PutItemCommandInput = {
    TableName: 'habits_habits.olifog.com',
    Item: {
      githubid: { S: user.githubid },
      habitid: { S: newHabitidDoc.Attributes.habit_id.N! },
      name: { S: habitInput.get('name')!.toString() },
      emoji: { S: habitInput.get('emoji')!.toString() },
      status: { BOOL: false },
      streak: { N: '0' },
      longestStreak: { N: '0' },
      lastChecked: { S: today.toString() },
      history: { L: [] }
    }
  }

  await client.send(new PutItemCommand(putParams))

  return redirect('/')
}

export const loader = async () => {
  throw new Response('Not Found', {
    status: 404
  })
}

export default function New () {
  useLoaderData()
}
