import HabitDisplay from '~/components/habit'
import { authenticator, User } from '~/services/auth.server'
import { LoaderFunction } from '@remix-run/server-runtime'
import { json, useLoaderData } from 'remix'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/github'
  })
  return json<User>(user)
}

export default function Index () {
  const user = useLoaderData<User>()

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <span className="flex justify-center">
        Hi, {user.displayname}!
      </span>
      <div className="flex flex-wrap max-w-md justify-center">
        <HabitDisplay habit="No sugar" />
        <HabitDisplay habit="Meditate" />
        <HabitDisplay habit="Do Quizlet" />
        <HabitDisplay habit="Go on walk" />
        <HabitDisplay habit="Read" />
      </div>
    </div>
  )
}
