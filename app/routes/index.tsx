import HabitDisplay from '~/components/habit'
import { authenticator } from '~/services/auth.server'
import { LoaderFunction } from '@remix-run/server-runtime'
import { json, useLoaderData } from 'remix'
import { Habit } from '~/models/Habit/habit'
import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb'
import fromDynamo from '~/models/Habit/fromdynamo'
import client from '~/utils/dynamodb'
import { NewHabit } from '~/components/NewHabit'
import { useState } from 'react'

interface LoaderData {
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
    habits: habits || []
  })
}

export default function Index () {
  const habits = useLoaderData<LoaderData>().habits
  const [modalOpen, setModalOpen] = useState(false)

  const updateDB = async (habit: Habit) => {
    await fetch(`/habit/${habit.habitid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habit)
    })
  }

  return (
    <>
      {
        modalOpen && <NewHabit setOpen={setModalOpen} />
      }
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="flex flex-wrap max-w-2xl justify-center">
          {
            habits.map((habit) => (
              <HabitDisplay key={habit.habitid} habit={habit} updateDB={updateDB} />
            ))
          }
        </div>
        <div className="rounded-full bg-gray-100 p-4 mt-6 hover:bg-gray-200 cursor-pointer" onClick={() => setModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="#666666">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
    </>
  )
}
