import axios from 'axios'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'

const API = 'AIzaSyCQRxkPwj5J_9uW0J8F17TBj5dSlklCPD0'
const SONGS_KEY = 'songs-results'
const KEY = 'station/'

export const stationService = {
    query,
    remove,
    save,
    addSongToStation,
    addStationLike,
    getStationById,
    getEmptyStation,
    removeSong,
    shuffleSongs,
    askSearch,
    addStationMsg,
    updateSongs,
}

async function askSearch(txt) {
    try {
        const songs = await storageService.query(`${SONGS_KEY}_${txt}`);
        if (songs.length) {
            return Promise.resolve(songs);
        }
        return axios.get(`https://www.googleapis.com/youtube/v3/search?maxResults=20&part=snippet&videoEmbeddable=true&type=video&key=${API}&q=${txt}`)
            .then(res => {
                storageService.postMany(`${SONGS_KEY}_${txt}`, res.data.items);
                return res.data.items;
            })
            .catch(err => {
                console.log('Service got Error:', err);
            })
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}

async function query(filterBy) {
    try {
        var query = '?'
        if (filterBy) {
            if (filterBy.byName) query += 'name=' + filterBy.byName + '&'
            if (filterBy.byGenre) query += 'genre=' + filterBy.byGenre + '&'
            if (filterBy.byPopular) query += 'popular=' + filterBy.byPopular + '&'
        }
        return await httpService.get(KEY + query)
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}

async function save(station) {
    try {
        if (station._id) return await httpService.put(KEY + station._id, station)
        else return await httpService.post(KEY, station)
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}



async function remove(stationId) {
    try {
        return await httpService.delete(KEY + stationId)
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}

async function getStationById(id) {
    try {
        return await httpService.get(KEY + id)
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}

function getEmptyStation() {
    return {
        name: '',
        imgUrl: '',
        desc: '',
        likes: 0,
        songs: [],
        genres: [],
        msgs: [],
    }
}

async function addSongToStation(payload) {
    try {
        const song = payload.selectedSong
        const station = await getStationById(payload.stationId)
        const songToAdd = {
            _id: utilService.makeId(),
            name: song.snippet.title,
            artist: song.snippet.channelTitle,
            desc: song.snippet.description,
            img: song.snippet.thumbnails.default.url,
            videoId: song.id.videoId,
            publishAt: song.snippet.publishedAt,
        };
        station.songs.push(songToAdd)
        await save(station);
        return songToAdd;
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}

async function removeSong(songRemove) {
    try {
        var station = await getStationById(songRemove.stationId)
        const idx = station.songs.find((s) => s._id === songRemove.songId)
        station.songs.splice(idx, 1)
        return await save(station);
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}

async function addStationLike(stationLiked) {
    try {
        var station = await getStationById(stationLiked.station)
        station.likes += stationLiked.num
        return await save(station);
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}

async function shuffleSongs(stationId) {
    try {
        var station = await getStationById(stationId)
        for (let i = station.songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [station.songs[i], station.songs[j]] = [station.songs[j], station.songs[i]];
        }
        return await save(station);
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}

async function addStationMsg(addMsg) {
    try {
        var station = await getStationById(addMsg.stationId)
        station.msgs.push(addMsg.msg)
        await save(station);
        return station;
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}

async function updateSongs(draggedSongs) {
    try {
        var station = await getStationById(draggedSongs.stationId)
        station.songs = draggedSongs.value
        await save(station)
        return station;
    } catch (err) {
        console.log('Error from stationService - ', err);
    }
}

function _createStations() {
    var stations = JSON.parse(localStorage.getItem(KEY))
    if (!stations || !stations.length) {
        storageService.postMany(KEY, gStations)
    }
}