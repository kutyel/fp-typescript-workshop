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

export type EmptyObj = Record<PropertyKey, never>

export const getPost = (id: number): Effect.Effect<never, never, Post> =>
  Effect.gen(function* (_) {
    yield* _(Effect.sleep('0.3 seconds'))
    return { id, title: 'Love them futures' }
  })

export const getComments = (id: number): Effect.Effect<never, never, string[]> =>
  Effect.gen(function* (_) {
    yield* _(Effect.sleep('0.3 seconds'))
    return ['This book should be illegal', 'Monads are like space burritos']
  })

const program = Console.log('Hello, Functional World!')

Effect.runSync(program)
