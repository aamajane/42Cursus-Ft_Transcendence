const { gqlFetch } = require('./index.js');
const { getAllUsers } = require('./index.js');

// Fetches all users from the backend
async function fetchAllUsers() {
    const response = await gqlFetch(getAllUsers());
    return response;
}

alert(fetchAllUsers())