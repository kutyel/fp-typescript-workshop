import { Effect, Console } from 'effect'

const program = Console.log('Hello, Functional World!')

Effect.runSync(program)
