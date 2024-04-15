# fake users store (only usernames stored)
users = []

def in_users(users_list, username):
    for user in users_list:
        if user == username:
            return True
        print('COMPARING USERS:', user, username)
    return False