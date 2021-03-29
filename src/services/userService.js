import { httpService } from './http.service.js'
const KEY = 'loggedinUser'

var gUser = null;
_loadUserFromStorage();

export const userService = {
    getLoggedinUser,
    saveUser,
    loginUser,
    logoutUser,
    saveUserToStorage,
    loadUserFromStorage
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
        saveUserToStorage()
        return httpService.post('auth/logout')
    } catch (err) {
        throw err
    }
}

function saveUserToStorage() {
    sessionStorage.setItem(KEY, JSON.stringify(gUser))
}

function loadUserFromStorage() {
    gUser = JSON.parse(sessionStorage.getItem(KEY))
}