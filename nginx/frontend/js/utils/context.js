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
        this.is2X2 = data?.is2x2 || false ;
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
        this.score1 = data?.score1 || null ;
        this.score2 = data?.score2 || null ;
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
        this.score = data?.pointsEarned || null;
        this.level = undefined;
        this.winRate = undefined;
        this.matches = undefined;
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
/*  - state: this represents the state of the tournament (PENDING | ONGOING | OVER)
/*  - players: this represents the players of the tournament
/*  - games: this represents the games of the tournament
/*********************************************************************/

class Tournament {
    constructor(data) {
        this.id = data?.id || null ;
        this.mode = data?.mode || null ;
        this.state = data?.state || null ;
        this.players = {
            player1: undefined,
            player2: undefined,
            player3: undefined,
            player4: undefined,
        } ;
        this.games = {
            demiFinalGame1: new Game(data?.demiFinalFirstGame),
            demiFinalGame2: new Game(data?.demiFinalSecondGame),
            finalGame: new Game(data?.finalGame)
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

// class User {

//     constructor(data) {
//         this.id = data?.id || null ;
//         this.name = data?.username || null ;
//         this.avatar = data?.avatarUrl || null ; 
//     }
// }

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
        this.totalGamesPlayed = 0 ;
        this.totalGamesWon = 0 ;
        this.totalGamesLost = 0 ;
        this.winRate = 0 ;
        this.league = 0 ;
        this.grade = undefined ;
    }

}

class Track {
    constructor() {
        this.gameId = undefined;
        this.gameMap = undefined;
        this.gameMode = undefined;

        this.tournamentId = undefined;
        this.tournamentStatus = undefined;
        this.tournamentData = {
            players: [],
            games: []
        };

        this.initProfileOfUser = new Player();
    }
}

class Search {
    constructor(data) {
        this.username = data?.username || null ;
        this.avatarUrl = data?.avatarUrl || null ;
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
        this.user = undefined ;
        this.api = new APIContext() ; // an APIContext object
        this.profileOfUser = undefined ; // a Profile object
        this.track = new Track() ; // a Track object
        this.navigation = undefined ; // a function that navigates to a page
        this.searchResults = []; // array of Users
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
        this.user = new Player(this.api.response.getUserByUsername) ;
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

        /************************************************************************
         * data to be fetched:
         * - user data (username, avatar, score, level, winRate, rank)
         * - list of games 1v1
         * - list of games 2v2
         * - list of tournaments
         * - list of followers
         * - list of following
         * - isOnline
         * - isPlaying
         * - status = "online" | "offline" | "playing"
         * - isLoggedUser
         */

        // fetch the user data
        const queryUserData = `
            query {
                getUserByUsername(username: "${username}") {
                    username,
                    avatarUrl,
                    pointsEarned,
                    numberOfFollowers,
                    numberOfFollowing,
                    createdAt,
                }
            }
        `
        await this.api.graphqlFetch(queryUserData)
        if (this.api.error) {
            alert("Error occured while fetching user data [CONTEXT]")
            return false ;
        }
        
        this.profileOfUser = new Profile() ;
        this.profileOfUser.player = new Player(this.api.response.getUserByUsername) ;


        // fetch the list of all games
        const queryListOfAllGames = `
            query {
                getAllGamesPlayedByPlayer(data: {player: "${username}"}) {
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
                    score1,
                    score2,
                    is2x2
                }
            }
        `

        await this.api.graphqlFetch(queryListOfAllGames)
        if (this.api.error) {
            alert("Error occured while fetching user games [CONTEXT]")
            return false ;
        }
        console.log("GAMES => ", this.api.response.getAllGamesPlayedByPlayer)
        this.profileOfUser.games1v1 = this.api.response.getAllGamesPlayedByPlayer.filter(game => game.is2x2 === false).map(game => new Game(game));
        this.profileOfUser.games2v2 = this.api.response.getAllGamesPlayedByPlayer.filter(game => game.is2x2 === true).map(game => new Game(game));
        console.log("GAMES 1V1 => ", this.profileOfUser.games1v1)
        console.log("GAMES 2V2 => ", this.profileOfUser.games2v2)
        // fetch the list of all tournaments
        const queryListOfAllTournaments = `
            query {
                getTournamentsPlayedByUser(data:{username:"hel-mefe"}) {
                    id,
                    demiFinalFirstGame {
                        id,
                        mode,
                        player1 {
                            username,
                        avatarUrl
                        },
                        player2 {
                            username,
                            avatarUrl
                        }
                        state,
                        isPartOfTournament
                        score1,
                        score2
                    }
                    demiFinalSecondGame {
                        id,
                        mode,
                        player1 {
                            username,
                            avatarUrl
                        },
                        player2 {
                            username,
                            avatarUrl
                        }
                        state,
                        isPartOfTournament
                        score1,
                        score2
                    }
                    finalGame {
                        id,
                        mode,
                        player1 {
                            username,
                            avatarUrl
                        },
                        player2 {
                            username,
                            avatarUrl
                        }
                        state,
                        isPartOfTournament
                        score1,
                        score2
                    }
                    state,
                    createdAt
                }
            }
        `

        await this.api.graphqlFetch(queryListOfAllTournaments)
        if (this.api.error) {
            alert("Error occured while fetching user tournaments [CONTEXT]")
            return false ;
        }
        console.log("TOURNAMENTS => ", this.api.response.getTournamentsPlayedByUser)
        this.profileOfUser.tournaments = this.api.response.getTournamentsPlayedByUser.map(tournament => new Tournament(tournament));
        this.profileOfUser.tournaments.forEach(tournament => {
            console.log("TOURNAMENT => ", tournament)
            if (tournament.games.demiFinalGame1.score1 > tournament.games.demiFinalGame1.score2)
                tournament.players.player4 = tournament.games.demiFinalGame1.player1 ;
            if (tournament.games.demiFinalGame2.score1 > tournament.games.demiFinalGame2.score2)
                tournament.players.player3 = tournament.games.demiFinalGame2.player1 ;
            if (tournament.games.finalGame.score1 > tournament.games.finalGame.score2)
                tournament.players.player1 = tournament.games.finalGame.player1,
                tournament.players.player2 = tournament.games.finalGame.player2 ;
            else
                tournament.players.player1 = tournament.games.finalGame.player2,
                tournament.players.player2 = tournament.games.finalGame.player1 ;
        })
    
        console.log("TOURNAMENTS => ", this.profileOfUser.tournaments)

        // fetch the list of all followers
        const queryListOfFollowers = `
            query {
                getUserFollowers(username: "${username}") {
                    user {
                        username,
                        avatarUrl
                    }
                }
            }
        `

        await this.api.graphqlFetch(queryListOfFollowers)
        if (this.api.error) {
            alert("Error occured while fetching user followers [CONTEXT]")
            return false ;
        }

        this.profileOfUser.followers = this.api.response.getUserFollowers.map(follower => new Player(follower.user));
        console.log("FOLLOWERS => ", this.profileOfUser.followers)

        // fetch the list of all following
        const queryListOfFollowing = `
            query {
                getUserFollowing(username: "${username}") {
                    following {
                        username,
                        avatarUrl
                    }
                }
            }
        `
        await this.api.graphqlFetch(queryListOfFollowing)
        if (this.api.error) {
            alert("Error occured while fetching user following [CONTEXT]")
            return false ;
        }

        this.profileOfUser.following = this.api.response.getUserFollowing.map(following => new Player(following.following));
        console.log("FOLLOWING => ", this.profileOfUser.following)

        //  calculate the total games played
        this.profileOfUser.totalGamesPlayed = this.profileOfUser.games1v1.length + this.profileOfUser.games2v2.length ;

        // calculate the total games won
        this.profileOfUser.totalGamesWon = this.profileOfUser.games1v1.filter((game) => {
            console.log(game.player1.username, context.profileOfUser.player.name, game.isTeam1Won)
            if (game.player1.username === context.profileOfUser.player.name && game.isTeam1Won === true)
                return true ;
            if (game.player2.username === context.profileOfUser.player.name && game.isTeam1Won === false)
                return true ;
            return false ;
        }).length
        + this.profileOfUser.games2v2.filter((game) => {
            if (game.player1.username === context.profileOfUser.player.name && game.isTeam1Won === true)
                return true ;
            if (game.player2.username === context.profileOfUser.player.name && game.isTeam1Won === false)
                return true ;
            return false ;
        }).length ;

        // calculate the total games lost
        this.profileOfUser.totalGamesLost = this.profileOfUser.totalGamesPlayed - this.profileOfUser.totalGamesWon ;

        // calculate the win rate and protect against division by zero
        this.profileOfUser.winRate = this.profileOfUser.totalGamesPlayed === 0 ? 0 : Math.floor((this.profileOfUser.totalGamesWon / this.profileOfUser.totalGamesPlayed) * 100) ;

        // calculate the league
        this.profileOfUser.league = Math.floor(this.profileOfUser.winRate / 13  + 1) ;

        // calculate the grade
        const grades = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "GrandMaster", "Challenger"] ;
        this.profileOfUser.grade = grades[this.profileOfUser.league - 1] ;
    }

    // state = "enable" | "disable"
    async setTwoFactorAuthentication(state) {
        // set the two factor authentication
    }

    // status = true | false
    async setUserStatus(status) {
        // set the user status
        const changeStatus = undefined ;

        if (status === true)
            changeStatus = `mutation { setUserPlaying(username: "${this.user.name}") { success, error } }`
        else
            changeStatus = `mutation { setUserNotPlaying(username: "${this.user.name}") { success, error } }`

        await this.api.graphqlFetch(changeStatus)

        if (this.api.error) {
            alert("Error occured while changing user status")
            return false ;
        }
    }

    async getUserStatus() {
        // get the user status
        const query = `query { getUserByUsername(username: "${this.user.name}") { isPlaying } }`
        await this.api.graphqlFetch(query)
        if (this.api.error) {
            alert("Error occured while fetching user status")
            return false ;
        }
        return this.api.response.getUserByUsername.isPlaying ;
    }

    async getProfileData() {
        const query = `query { getUserByUsername(username: "${this.user.name}") { username, firstName, lastName } }`
        await this.api.graphqlFetch(query)
        if (this.api.error) {
            console.log("Error occured while fetching user data [CONTEXT]")
            return false ;
        }
        this.user = this.api.response.getUserByUsername ;
        this.api.resetAPIContext() ;
        return true ;
    }

    async getAvailableGame() {
        // context.track.gameMap = "egypt" ; // egypt | factory | space
        // context.track.gameMode = "1v1" ; // 1v1 | 2v2
        console.log("CONTEXT: ", context.track.gameMap)
        console.log("CONTEXT: ", context.track.gameMode)
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

    async updateGame(data) {
        console.log("ChangeGamefasfasdfadsfadsfadsfadsfdsf")
        const ChangeGame = `
            mutation {
                updateGame(data: { gameId: ${data.gameId}, state: "${data.state}", player1: "${data.player1}", player2: "${data.player2}", player3: "${data.player3}", player4: "${data.player4}", score1: ${data.score1}, score2: ${data.score2}, isTeam1Won: ${data.score1 > data.score2} }) {
                    success,
                    error,
                    gameId
                }
            }`
        console.log(ChangeGame, "CHANGE GAME")
        await this.api.graphqlFetch(ChangeGame)
        if (this.api.error) {
            alert("Error occured while fetching available games")
            return false ;
        }
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

    async search(username) {
        const query = `
            query {
                getUsersBySubstring(substring: "${username}") {
                    username,
                    avatarUrl
                }
            }
        `
        await this.api.graphqlFetch(query)
        if (this.api.error) {
            console.log("Error occured while fetching search data")
            return false ;
        }

        this.searchResults = [];

        this.searchResults = this.api.response.getUsersBySubstring.map(user => new Search(user));
    }

    async follow(username) {
        const query = `
            mutation {
                addFollowership(user: "${this.user.name}", following: "${username}") {
                    success,
                    error
                  }
            }
        `
        await this.api.graphqlFetch(query)
        if (this.api.error) {
            console.log("Error occured while following user")
            return false ;
        }
    }

    async unfollow(username) {
        const query = `
            mutation {
                deleteFollowership(user: "${this.user.name}", following: "${username}") {
                    success,
                    error
                  }
            }
        `
        await this.api.graphqlFetch(query)
        if (this.api.error) {
            console.log("Error occured while unfollowing user")
            return false ;
        }
    }
}

const context = new Context()
// context.initContext({ username: "hel-mefe" })

function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null;
}

const username = getCookie('username');

context.initContext({ username: username })
