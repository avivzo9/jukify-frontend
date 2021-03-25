import { httpService } from './http.service.js'
const KEY = 'loggedinUser'

var gUser = null;
// _loadUserFromStorage();

export const userService = {
    getLoggedinUser,
    saveUser,
    loginUser,
    logoutUser
}

function getLoggedinUser() {
    return JSON.parse(JSON.stringify(gUser))
}

async function saveUser(user) {
    try {
        gUser = user
        return await httpService.post('auth/signup', user)
    } catch (err) {
        throw err
    }
}

async function loginUser(user) {
    try {
        return await httpService.post('auth/login', user)
    } catch (err) {
        throw err
    }
}

async function logoutUser() {
    try {
        gUser = null
        _saveUserToStorage()
        return httpService.post('auth/logout')
    } catch (err) {
        throw err
    }
}

function _saveUserToStorage() {
    sessionStorage.setItem(KEY, JSON.stringify(gUser))
}

function _loadUserFromStorage() {
    gUser = JSON.parse(sessionStorage.getItem(KEY))
    if (!gUser) {
        gUser = { _id: 'u101', fullname: 'Hadar Marom', username: 'Hadar' }
        _saveUserToStorage();
    }
}