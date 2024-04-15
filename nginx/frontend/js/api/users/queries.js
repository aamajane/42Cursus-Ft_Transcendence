function gqlGetAllUsers() {
    return `
        query {
            getAllUsers {
                username
            }
        }
    `;
}

function gqlGetUserById(id) {
    return `
        query {
            getUserById(id: ${id}) {
                username
            }
        }
    `;
}

module.export = {
    gqlGetAllUsers,
    gqlGetUserById,
}