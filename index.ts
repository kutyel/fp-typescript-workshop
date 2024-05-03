import { Effect, Console } from 'effect'

export interface User {
  readonly id: number
  readonly name: string
  readonly active?: boolean
  readonly address?: Address
}

interface Address {
  readonly city: string
  readonly street: { number: number; name: string }
}

export interface Post {
  readonly id: number
  readonly title: string
}

export interface Comment {
  readonly postId: number
  readonly body: string
}

export type EmptyObj = Record<PropertyKey, never>

export const getPost = (id: number) =>
  Effect.gen(function* () {
    yield* Effect.sleep('0.3 seconds')
    return { id, title: 'Love them futures' }
  })

export const getComments = (postId: number) =>
  Effect.gen(function* () {
    yield* Effect.sleep('0.3 seconds')
    return [
      { postId, body: 'This book should be illegal' },
      { postId, body: 'Monads are like space burritos' },
    ]
  })

const program = Console.log('Hello, Functional World!')

Effect.runSync(program)
