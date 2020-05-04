# README

### Binaries

Each server has binaries in `./[backend | frontend]/bin`. There are binaries for win/mac/linux, although I couldn't generate the frontend binary for windows because `pkg` doesn't want to work and `nexe` wants me to compile Node, which seems to take a lot of time :).

The backend runs on port 3000, while the frontend runs on port 9000.

**DISCLAIMER:** I could only try the linux binaries. Can't say if Windows and MacOS binaries work.

## Backend

It runs on port 3000 and implements [this API](https://agileengine.bitbucket.io/fsNDJmGOAwqCpzZx/api/).

### Scripts

These are available under `./backend`.

- `npm start`: Runs the server from source code.
- `npm test`: Runs the tests.
- `npm run build-bins`: Build the binary files. You'll find them in `./backend/bin`.

## Frontend

Binary runs on port 9000, `npm start` runs on port 3000 by default, but offers to use another
one if 3000 is not available.

### Scripts

These are available under `./frontend`.

- `npm start`: Runs the server from source code.
- `npm run build-bins`: Build the binary files. You'll find them in `./frontend/bin`.



