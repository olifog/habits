import { LoaderFunction, redirect, json, ActionFunction, useLoaderData, Link } from 'remix'
import { authenticator } from '~/services/auth.server'
import client from '~/utils/dynamodb'
import { GetItemCommand, GetItemCommandInput, DeleteItemCommand, DeleteItemCommandInput } from '@aws-sdk/client-dynamodb'
import fromDynamo from '~/models/Habit/fromdynamo'
import { Habit } from '~/models/Habit/habit'
import toDynamo from '~/models/Habit/todynamo'
import { StreakDisplay } from '~/components/habit'
import { EmojiDisplay } from '~/components/EmojiDisplay'
import { NameDisplay } from '~/components/NameDisplay'
import { debounce } from 'debounce'
import { useCallback } from 'react'
import { HistoryDisplay } from '~/components/HistoryDisplay'
import { useNavigate } from 'react-router'

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/github'
  })

  const habit = await request.json()

  switch (request.method) {
    case 'POST': {
      await toDynamo(habit)
      return redirect('/')
    }
    case 'DELETE': {
      const params: DeleteItemCommandInput = {
        TableName: 'habits_habits.olifog.com',
        Key: {
          githubid: { S: user.githubid },
          habitid: { S: habit.habitid }
        }
      }

      await client.send(new DeleteItemCommand(params))

      return redirect('/', 303)
    }
  }
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
  const navigate = useNavigate()
  const habit = useLoaderData<Habit>()

  const actualStreak = habit.status
    ? habit.streak + 1
    : habit.streak

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const update = useCallback(
    debounce((updates: {}) => {
      fetch(`/habit/${habit.habitid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...habit, ...updates })
      })
    }, 1000),
    []
  )

  const handleDelete = async () => {
    await fetch(`/habit/${habit.habitid}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitid: habit.habitid })
    })
    navigate('/')
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="relative flex rounded-b-[3rem] rounded-r-[3rem] rounded-tl-lg bg-gradient-to-tl from-slate-50 to-slate-100 shadow-2xl">
        <Link to="/" className="absolute top-1 left-1 z-50" prefetch="render">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
        </Link>
        <div className="basis-1/2">
          <div className="flex items-center justify-between pr-10 pt-1">
            <EmojiDisplay emoji={habit.emoji} update={update} />
            <svg onClick={handleDelete} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h1 className="px-4 pt-2 text-md font-bold">
            <NameDisplay name={habit.name} update={update} />
          </h1>
          <div className="flex justify-around py-4">
            <StreakDisplay text="Streak" streak={actualStreak} bg="to-slate-200 from-slate-300" />
            <StreakDisplay text="Record" streak={Math.max(habit.longestStreak, actualStreak)} bg="to-yellow-400 from-yellow-500" />
          </div>
        </div>
        <div className="basis-1/2">
          <h2 className="pt-4 text-sm pb-2">History</h2>
          <HistoryDisplay history={habit.history} status={habit.status} />
        </div>
      </div>
    </div>
  )
}
