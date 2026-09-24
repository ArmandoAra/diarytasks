# DiaryTasks

DiaryTasks is a mobile application built with **React Native and Expo** that lets you manage
daily tasks and notes. It stores everything in a local SQLite database, so it works fully
offline — there is no backend and no account.

## Features

- **Task management**: add, edit, delete and complete daily tasks, with priority levels.
- **Daily notes**: keep notes per day and mark the ones you want to keep handy as favorites.
- **Calendar map**: see at a glance which days have tasks or notes, and jump to any of them.
- **Light and dark themes**, remembered between launches.

## Prerequisites

- **Node.js** 18 or newer — [download](https://nodejs.org/)
- The **Expo Go** app on your phone, or an Android emulator / iOS simulator.

You do *not* need a global React Native CLI install: everything runs through `npx expo`.

## Installation

```bash
git clone https://github.com/ArmandoAra/diarytasks.git
cd diarytasks
npm install
```

## Running

```bash
npm start          # start the Expo dev server, then scan the QR code with Expo Go
npm run android    # open directly on an Android device or emulator
npm run ios        # open directly on an iOS simulator
npm run web        # run in the browser
```

## Development

```bash
npm run typecheck  # TypeScript, no emit
npm run test:ci    # run the test suite once
npm test           # run the tests in watch mode
npm run lint       # expo lint
```

An overview of the codebase — architecture, data flow, a file-by-file index and the known
gotchas — lives in [`CLAUDE.md`](./CLAUDE.md).

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
