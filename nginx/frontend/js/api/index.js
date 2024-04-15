// Initializes the API for the frontend
const GRAPHQL_ENDPOINT = 'http://localhost:8000/api/graphql';
const WEBSOCKET_URL = 'ws://localhost:8000/ws';

// Fetches data from the GraphQL endpoint
// @param {string} gqlQuery - The GraphQL query to fetch data
// @param {function} { error, loading, response } - The callback function to handle the response

async function gqlFetch({
    gqlQuery, 
    setData
}) {
    setData({
        response: undefined,
        error: false,
        loading: true,
    })

    const response = await fetch(`${GRAPHQL_ENDPOINT}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            query: gqlQuery,
        }),
    });

    if (response.status !== 200) {
        setData({
            response: null,
            error: "Error occured while fetching data",
            loading: false,
        })
        return ;
    }

    setData({
        response: await response.json(),
        error: null,
        loading: false,
    })
}


const getAllUsers = require('./users/queries.js').gqlGetAllUsers;
const getUserById = require('./users/queries.js').gqlGetUserById;

module.exports = {
    gqlFetch,
    getAllUsers,
    getUserById,
    GRAPHQL_ENDPOINT,
    WEBSOCKET_URL,

}