import HabitDisplay from '~/components/habit'
import { authenticator } from '~/services/auth.server'
import { LoaderFunction } from '@remix-run/server-runtime'
import { json, useLoaderData } from 'remix'
import { Habit } from '~/models/Habit/habit'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb'
import fromDynamo from '~/models/Habit/fromdynamo'
import client from '~/utils/dynamodb'

interface LoaderData {
  user: {
    githubid: string,
    displayname: string,
    // eslint-disable-next-line camelcase
    avatar_url: string
  },
  habits: Habit[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/github'
  })

  const params: QueryCommandInput = {
    TableName: 'habits_habits.olifog.com',
    KeyConditionExpression: 'githubid = :g',
    ExpressionAttributeValues: {
      ':g': { S: user.githubid }
    }
  }

  const data = await client.send(new QueryCommand(params))
  const habits = data.Items?.map((item) => fromDynamo(item))

  return json<LoaderData>({
    user: user,
    habits: habits || []
  })
}

export default function Index () {
  const { user, habits } = useLoaderData<LoaderData>()

  const updateDB = async (habit: Habit) => {
    await fetch(`/habit/${habit.habitid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habit)
    })
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <span className="flex justify-center">
        Hi, {user.displayname}!
      </span>
      <div className="flex flex-wrap max-w-md justify-center">
        {
          habits.map((habit) => (
            <HabitDisplay key={habit.habitid} habit={habit} updateDB={updateDB} />
          ))
        }
      </div>
    </div>
  )
}
