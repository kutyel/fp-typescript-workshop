<p align="center">
    <img alt="lambda" src="./logo.png" width="200">
</p>

# Functional Programming in TypeScript Workshop

[![CI Build](https://github.com/kutyel/fp-typescript-workshop/actions/workflows/main.yml/badge.svg)](https://github.com/kutyel/fp-typescript-workshop/actions/workflows/main.yml)

⚡️ Let's learn some functional programming together!

We will be using the amazing [Effect.ts](https://effect.website/) library (v4) because it is designed from the ground up to work nicely with TypeScript! 😎

## Requirements

Install [Bun](https://bun.sh/docs/installation)!

> This project uses Bun instead of Node as an experiment and to make things crazy fast! 🚄

If you are using homebrew:

```sh
$ brew tap oven-sh/bun # for macOS and Linux
$ brew install bun
```

## Run the tests and solve the exercises!

There are 3 rounds of exercises: `functors`, `applicatives` and `monads`.

My recommendation is that you run only the specific test file in watch mode and solve the exercises in that order before moving to the next challenge. 😉

```sh
$ bun test --watch functors
$ bun test --watch applicatives
$ bun test --watch monads
```

Happy coding! ⚡️
