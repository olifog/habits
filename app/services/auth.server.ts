import { Authenticator } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { GitHubStrategy } from 'remix-auth-github'
import client from '~/utils/dynamodb'
import { UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb'

export interface User {
  githubid: string,
  displayname: string,
  avatar_url: string
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage)

const gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async ({ accessToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile

    const params: UpdateItemCommandInput = {
      TableName: 'users_habits.olifog.com',
      Key: {
        githubid: { S: profile.id }
      },
      UpdateExpression: 'set displayname = :d, avatar_url = :a',
      ExpressionAttributeValues: {
        ':d': { S: profile.displayName },
        ':a': { S: profile._json.avatar_url }
      },
      ReturnValues: 'ALL_NEW'
    }

    const data = await client.send(new UpdateItemCommand(params))
    if (data.Attributes === undefined) {
      throw new Error('DynamoDB Update failed')
    }

    const user: User = {
      githubid: data.Attributes.githubid.S!,
      displayname: data.Attributes.displayname.S!,
      avatar_url: data.Attributes.avatar_url.S!
    }

    return user
  }
)

authenticator.use(gitHubStrategy)
