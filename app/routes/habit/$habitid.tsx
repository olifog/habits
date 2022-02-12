import { LoaderFunction, redirect, json, ActionFunction } from 'remix'
import { authenticator } from '~/services/auth.server'
import client from '~/utils/dynamodb'
import { GetItemCommand, GetItemCommandInput } from '@aws-sdk/client-dynamodb'
import fromDynamo from '~/models/Habit/fromdynamo'
import { Habit } from '~/models/Habit/habit'
import toDynamo from '~/models/Habit/todynamo'

export const action: ActionFunction = async ({ request }) => {
  const habit = await request.json()
  await toDynamo(habit)
  return json({ success: true })
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/github'
  })

  if (params.habitid === undefined) {
    return redirect('/')
  }

  const dynamoParams: GetItemCommandInput = {
    TableName: 'habits_habits.olifog.com',
    Key: {
      githubid: { S: user.githubid },
      habitid: { S: params.habitid }
    }
  }

  const data = await client.send(new GetItemCommand(dynamoParams))
  if (data.Item === undefined) {
    return redirect('/')
  }
  const habit = fromDynamo(data.Item)

  return json<Habit>(habit)
}

export default function HabitPage () {
  return (
    <div></div>
  )
}
