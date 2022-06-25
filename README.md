[![Logo](public/favicon.svg)](https://github.com/CarpentersKeys/greed-game)

### Game of Greed

A game matching two competitors to test their patience and ambition. One player sets a time, the other can interrupt the timer to gain points but the longer they wait the more they get, if time runs out it all goes to the one who set the time. This web app is built using React in TypeScript with React-Query to manage server state. The backend is implemented using multiple Nextjs serverless endpoints connecting to MongoDB with the mongoose gmail. Mantines design system takes care of UI so it's easier to get functionality onto the page.
  
[View Demo](https://github.com/CarpentersKeys/greed-game) · [Report Bug](https://github.com/CarpentersKeys/greed-game/issues)

## About The Project 
![AGameofGreed](https://www.dropbox.com/s/ixkscoi0kglavft/greed1.png?dl=0)

([back to top](#top))

### Built With 
* [Next.js](https://nextjs.org/) 
* [React.js](https://reactjs.org/) 
* [TypeScript](https://www.typescriptlang.org/) 
* [React-Query](https://react-query.tanstack.com/) 
* [MongoDB](https://www.mongodb.com/)

([back to top](#top))

## Try it out!

If you want to see it yourself, can simply fork the project, install the package contents and then start your development server. The Next framework takes care of everything.
```
npm i
npm run dev
```
([back to top](#top))

## Current State
### Frontend
The point is, a user can end a name and the app will send that to the backend. once both player and game state have come back form the back the app renders the Game component. Game is further subdivided into two container components for each of the two game roles. When a player joins a game another has created (meaning there are enough players to start) another call is made to the backend to assign roles at random and alter the game state object to indicate the game is closed.
#### Future
The next step is to create a series of conditionally rendered function components in each players' given role for each stage of the game. Picking the time, interupting the running timer, and eventually settling up and deciding if they want to play another round.
### Datafetching
React-query is being leveraged to facilitate a statefull and cached approach. This also alleviates the need for many backend routes and react-query's query key provides the server with all the data required to case out each request to correct endpoint. React-query implements hooks both for maintaining the up to date server state (useQuery) and for altering it (useMutation). Both of these are utlized to move from one stage to the next in the game. These hooks provide a lot of powerful options and callback functions which allow for excellent control flow.
### Backend
Next provides a serverless function API in it's framework. These functions appear very similar to a nodejs express app. There is some initial startup time and they can go dormant so cold starts can occur. Do to the brevity of each game however the decision was made to try it this way rather than implementing an entire custom sever.
### Database
Mongoose provides a client for the MongoDB database. There are a host of different methods to create, read, update, delete the hosted collections. These collections are how server state is maintained across the session. For now a player is erased when they end their session and an empty (or otherwise invalid game) is also cleaned up, but this could easily be changed to persist.
### Design 
Currently this is very bare bones. Mantine design system is used but little to no styling has been applied. 

([back to top](#top))

## Roadmap 
- [ ] Setup game, assign player roles, and maintain state.
- [ ] Game flow, timers, interaction.
- [ ] Conclusion, iteration.

([back to top](#top))

## Contact Joshua - 
joneilltechnical@gmail.com

([back to top](#top))

License Distributed under the MIT License.