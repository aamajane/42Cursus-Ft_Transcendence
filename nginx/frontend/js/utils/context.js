/*********************************************************************/
/* Game is representing the game object
/*  - id: this represents the id of the game
/*  - mode: this represents the mode of the game
/*  - isVsAi: this represents if the game is against AI
/*  - is2X2: this represents if the game is 2X2
/*  - state: this represents the state of the game
/*  - gameHoster: this represents the hoster of the game
/*  - player1: this represents the first player
/*  - player2: this represents the second player
/*  - player3: this represents the third player
/*  - player4: this represents the fourth player
/*  - isTeam1Won: this represents if the team 1 won
/*  - isPartOfTournament: this represents if the game is part of a tournament
/*  - tournamentId: this represents the id of the tournament
/*  - createdAt: this represents the creation date of the game
/*  - winner: this represents the winner of the game
/*********************************************************************/
class Game {
    constructor(data) {
        this.id = data?.id || null ;
        this.mode = data?.mode || null ;
        this.isVsAi = data?.isVsAi || false ;
        this.is2X2 = data?.is2X2 || false ;
        this.state = data?.state || null;
        this.gameHoster = data?.gameHoster || undefined ;
        this.player1 = data?.player1 || null ;
        this.player2 = data?.player2 || null ;
        this.player3 = data?.player3 || null ;
        this.player4 = data?.player4 || null ;
        this.isTeam1Won = data?.isTeam1Won || false ;
        this.isPartOfTournament = data?.isPartOfTournament || false ;
        this.tournamentId = data?.tournamentId || undefined ;
        this.createdAt = data?.createdAt || null ;
        this.winner = data?.winner || undefined ;
    }
}

/*********************************************************************/
/* Player is representing the player object
/*  - id: this represents the id of the player
/*  - name: this represents the name of the player
/*  - avatar: this represents the avatar of the player
/*  - score: this represents the score of the player
/*  - level: this represents the level of the player
/*  - winRate: this represents the win rate of the player
/*  - rank: this represents the rank of the player
/*********************************************************************/
class Player {
    constructor(data) {
        this.id = null;
        this.name = data?.username || null;
        this.avatarUrl = data?.avatarUrl || null;
        this.score = null;
        this.level = null;
        this.winRate = null;
        this.rank = null;
    }
}

// class Notification {
//     constructor() {
//         this.id = null;
//         this.type = null;
//         this.message = null;
//         this.createdAt = null;
//         this.sender = new Player();
//         this.receiver = new Player();
//     }

// }

/*********************************************************************/
/* Tournament is representing the tournament object
/*  - id: this represents the id of the tournament
/*  - mode: this represents the mode of the tournament (EGYPT | CLASSIC | SPACE)
/*  - state: this represents the state of the tournament (PENDING | IN_PROGRESS | FINISHED)
/*  - players: this represents the players of the tournament
/*  - games: this represents the games of the tournament
/*********************************************************************/

class Tournament {
    constructor() {
        this.id = null;
        this.mode = null ;
        this.state = null ;
        this.players = {
            player1: undefined,
            player2: undefined,
            player3: undefined,
            player4: undefined,
        } ;
        this.games = {
            demiFinalGame1: new Game(),
            demiFinalGame2: new Game(),
            finalGame: new Game(),
        };
    }
}


/***************************************************************************************
 * User is representing the current user
 *   - id: this represents the current id of the use
 *   - user: this represents the current user data
 *   - friends: this represents the friends of the current user
 *   - tournamentsHistory: this represents the tournaments history of the current user
 *   - gamesHistory: this represents the games history of the current user
 **************************************************************************************/

class User {

    constructor(data) {
        this.id = data?.id || null ;
        this.name = data?.username || null ;
        this.avatar = data?.avatarUrl || null ; 
    }
    // get Name() {
    //     const timeInterval = s
    //     return this.name ;

    // }
    // get friends() {

    // set f1(name) {
    //     //name and avatar
    // }
}

/***************************************************************************************
 * APIResponse is representing the response from the API
 *  - data: this represents the data from the API
 *  - error: this represents the error from the API
 *  - isLoading: a boolean value that represents the loading state of the API
 **************************************************************************************/
class APIResponse {
    constructor(data, error, isLoading) {
        this.data = undefined ;
        this.error = undefined ;
        this.isLoading = false ;
    }
}
/*********************************************************************************
/* APIContext is encapsulating everything about the API
 *   - websocketEndpoint: this represents the websocket endpoint of the API
 *   - graphqlEndpoint: this represents the graphql endpoint of the API
 ******************************************************************************/
class APIContext {
    constructor() {
        this.websocketEndpoint = "http://" + window.location.host + ":80/ws";
        this.graphqlEndpoint = "http://" + window.location.host + ":80/api/graphql/";
        this.loading = false ;
        this.response = undefined ;
        this.error = undefined
    }

    /*******************************************************************
    *** method that takes a query and a data setter function **********
     * - query: a string that represents the graphql query 
     * - dataSetter: a function that takes the data from the api and sets it
     * in a response object
     ********************************************************************/
    
    async graphqlFetch (queryOrMutation) {
        this.resetAPIContext() ;
        this.loading = true ;

        let jsonQuery = JSON.stringify({ query: queryOrMutation })

        try {
            let res = await fetch(this.graphqlEndpoint, {
                method: 'POST',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonQuery
            }) ;

            // if error occurs during the fetching of the data
            if (!res || !res.ok) {
                this.error = "Error occured while fetching data from the API";
                this.loading = false ;
                return;
            }

            // if the data is fetched successfully
            if (res.data?.error) {
                this.loading = false ;
                this.error = "Error returned from the API server"
                return ;
            }

            this.response = await res.json()
            this.response = this.response.data ;
        } catch (err) { // api call failed, or json parsing failed
            alert(err) 
            this.loading = false ;
            this.error = err.message ;
            return 
        }

        
        this.loading = false ;
        this.error = null ;
    }

    /********************************************************/
    /* - method that resets the API context             *******/
    /* - graphqlFetch always calls it before each fetch *******/
    /********************************************************/
    resetAPIContext() {
        this.loading = false ;
        this.response = undefined ;
        this.error = undefined ;
    
    }
}

/***************************************************************************************
 * Profile is representing the profile of the user
 *  - games1v1: this represents the 1v1 games of the user
 * - games2v2: this represents the 2v2 games of the user
 * - tournaments: this represents the tournaments of the user
 * - followers: this represents the followers of the user
 * - following: this represents the following of the user
 * - player: this represents the user object
* ************************************************
*/
class Profile {
    constructor() {
        this.games1v1 = [] ; // array of games Game[]
        this.games2v2 = [] ; // array of games Game[]
        this.tournaments = [] ; // array of tournaments Tournament[]
        this.followers = [] ; // array of players Player[]
        this.following = [] ; // array of players Player[]
        this.player = new Player() ; // a user object
        this.isLoggedUser = false ; // boolean value that represents if the user is the logged user
    }

}

class trackPlayer {
    constructor() {
        this.id = undefined;
        this.avatar = undefined;
        this.name = undefined;
        this.score = undefined;
    }
}

class trackGame {
    constructor() {
        this.id = undefined;
        this.map = undefined;
        this.status = undefined;
        this.player1 = undefined;
        this.player2 = undefined;
        this.winner = undefined;
    }
}

class Track {
    constructor() {
        this.gameId = undefined;
        this.gameMap = undefined;
        this.gameMode = undefined;
        this.gameStatus = undefined;
        this.gameScore = undefined;

        this.tournamentId = undefined;
        this.tournamentMode = undefined;
        this.tournamentStatus = undefined;
        this.tournamentData = {
            players: [],
            games: []
        };
    }
}

/***************************************************************************************
 * Context is encapsulating everything about the current user
 *   - route: this represents the current route the user is in
 *   - user: this represents the current user data
 *   - friends: this represents the friends of the current user
 *   - tournamentsHistory: this represents the tournaments history of the current user
 *   - gamesHistory: this represents the games history of the current user
 **************************************************************************************/
class Context {
    constructor() {
        this.route = undefined ; 
        this.user = undefined ;
        this.followers = undefined ; // array of players Player[]
        this.tournamentsHistory = [] ; // array of tournaments Tournament[]
        this.gamesHistory = [] ; // array of games Game[]
        this.notifications = [] ; // array of notifications Notification[]
        this.tournamentId = undefined ; // a tournament object
        this.gameId = undefined ; // a game object
        this.api = new APIContext() ; // an APIContext object
        this.profileOfUser = undefined ; // a Profile object
        this.track = new Track() ; // a Track object
        this.navigation = undefined ; // a function that navigates to a page
    }
    get User() {
        const timeInterval = setInterval(() => {
            if (this.api.loading === false) {
                clearInterval(timeInterval) ;
                return this.user ;
            }
        }, 1000);
    }

    // takes a test user for testing purposes
    async initContext(testUser) {

        // retrieve the user name and avatar
        let query = `query { 
            getUserByUsername(username: "${testUser.username}") 
            { 
                username,
                avatarUrl,
            }
        }`

        await this.api.graphqlFetch(query)
        if (this.api.error)
        {
            alert("Error occured while fetching user data [CONTEXT]")
            return ;
        }
        this.user = new User(this.api.response.getUserByUsername) ;
        query = `query {
            getUserFollowers(username: "${testUser.username}") {
                user {
                    username,
                    avatarUrl
                }
            }
        }`
        await this.api.graphqlFetch(query)
        if (this.api.error)
        {
            alert("Error occured while fetching friends data [CONTEXT]")
            return ;
        }
        this.followers = this.api.response.getUserFollowers ;
    }

    async initProfileOfUser(username) {
        context.api.loading = true ;
        setTimeout(() => {
            context.api.loading = false ;
        }, 3000);
        /************************************************************************
         * data to be fetched:
         * - list of games 1v1
         * - list of games 2v2
         * - list of tournaments
         * - list of followers
         * - list of following
         * - user data (username, avatar, score, level, winRate, rank)
         * - isOnline
         * - isPlaying
         * - status = "online" | "offline" | "playing"
         * - isLoggedUser
         */

        // fetch the list of all games
        const queryListOfAllGames = `
            query {
                getAllGames(username: "$username") {
                    player1 {
                        username,
                        avatarUrl,
                    },
                    player2 {
                        username,
                        avatarUrl,
                    },
                    player3 {
                        username,
                        avatarUrl,
                    },
                    player4 {
                        username,
                        avatarUrl,
                    },
                    isTeam1Won,
                    createdAt,
                    mode,
                    isVsAi,
                    is2X2, 
                    score1,
                    score2
                }
            }
        `

        // fetch the list of all tournaments
        const queryListOfAllTournaments = `
            query {
                getAllTournaments(username: "$username") {
                    demiFinalGame1 {
                        player1 {
                            username,
                            avatarUrl,
                        },
                        player2 {
                            username,
                            avatarUrl,
                        },
                        player3 {
                            username,
                            avatarUrl,
                        },
                        player4 {
                            username,
                            avatarUrl,
                        },
                        isTeam1Won,
                        createdAt,
                        mode,
                        isVsAi,
                        is2X2,
                        state,
                        score1,
                        score2
                    },
                    demiFinalGame2 {
                        player1 {
                            username,
                            avatarUrl,
                        },
                        player2 {
                            username,
                            avatarUrl,
                        },
                        player3 {
                            username,
                            avatarUrl,
                        },
                        player4 {
                            username,
                            avatarUrl,
                        },
                        isTeam1Won,
                        createdAt,
                        mode,
                        isVsAi,
                        is2X2,
                        state,
                        score1,
                        score2
                    },
                    finalGame {
                        player1 {
                            username,
                            avatarUrl,
                        },
                        player2 {
                            username,
                            avatarUrl,
                        },
                        player3 {
                            username,
                            avatarUrl,
                        },
                        player4 {
                            username,
                            avatarUrl,
                        },
                        isTeam1Won,
                        createdAt,
                        mode,
                        isVsAi,
                        is2X2,
                        state,
                        score1,
                        score2
                    },
                    winner {
                        username,
                        avatarUrl,
                    },
                    secondPlace {
                        username,
                        avatarUrl,
                    },
                    thirdPlace {
                        username,
                        avatarUrl,
                    },
                    fourthPlace {
                        username,
                        avatarUrl,
                    },
                    createdAt,
                    mode,
                    state,
                }
            }
            `
        

        // context.profileOfUser.player.isLoggedUser = context.user.username === context.profileOfUser.player.username
    }

    // state = "enable" | "disable"
    async setTwoFactorAuthentication(state) {
        // set the two factor authentication
    }

    // status = "online" | "offline" | "playing"
    async setUserStatus(status) {
        // set the user status
    }

    

    async getProfileData() {
        const query = `query { getUserByUsername(username: "${this.user.username}") { username, firstName, lastName } }`
        await this.api.graphqlFetch(query)
        if (this.api.error) {
            console.log("Error occured while fetching user data [CONTEXT]")
            return false ;
        }
        this.user = this.api.response.getUserByUsername ;
        this.api.resetAPIContext() ;
        return true ;
    }

    async getGameAvailable() {
        context.track.gameMap = "egypt" ; // egypt | factory | space
        context.track.gameMode = "1v1" ; // 1v1 | 2v2

        // fetch the available games
        const gameQuery = `
            mutation {
                getAvailableGame(mode: "${context.track.gameMap}", is2x2: ${context.track.gameMode === "2v2"}) {
                    success,
                    error,
                    gameId
            }
        }`

        console.log(gameQuery)

        await this.api.graphqlFetch(gameQuery)

        if (this.api.error) {
            alert("Error occured while fetching available games")
            return false ;
        }

        context.track.gameId = this.api.response.getAvailableGame.gameId ;
        console.log("GAME ID => ", context.track.gameId)
    }

    async updateGame() {
        // fetch the list of all games
        const ChangeGame = `
            mutation {
                updateGame(data: { gameId: ${context.track.gameId}, score1: 10, score2: 5, winner: "hel-mefe" }) {
                    success,
                    error,
                    gameId
                }
            }`
        await this.api.graphqlFetch(ChangeGame)
        if (this.api.error) {
            alert("Error occured while fetching available games")
            return false ;
        }
        console.log(this.api.response.updateGame);
    }

    async getGameById(id) {
        const query = `query { getGameById(gameId: ${id}) { id, mode, isVsAi, is2x2, state,
            player1 {
              username,
                avatarUrl,  
            },
            player2 {
                username,
                avatarUrl,
            }, player3 {
            username,
                avatarUrl,
            }, player4 {
            username,
                avatarUrl,
            }, isTeam1Won, isPartOfTournament, createdAt, score1, score2 } }`

        await this.api.graphqlFetch(query)

        if (this.api.error) {
            console.log("Error occured while fetching game data getGameById")
            return false ;
        }
        console.log("GAME ID => ", this.api.response)
        this.gameId = this.api.response.getGameById ;
        this.api.resetAPIContext() ;
        return true ;
    }

}

const context = new Context()
context.initContext({ username: "hel-mefe" })
// console.log("CONTEXT: ", context)
// context.getGameAvailable() ;
context.updateGame() ;
context.getGameById() ;