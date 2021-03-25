import { stationService } from "../services/station.service.js";

export const stationStore = {
    strict: true,
    state: {
        stations: [],
        genres: ["Hip-Hop", "Band", "Israeli"],
        filterBy: null,
        currStation: null
    },
    mutations: {
        setStations(state, { stations }) {
            state.stations = stations
        },
        setCurrStation(state, { id }) {
            const station = state.stations.find((s) => s._id === id)
            state.currStation = station;
        },
        addToStation(state, { payload }) {
            const station = state.stations.find((s) => s._id === payload.stationId)
            station.songs.push(payload.song)
        },
        removeSong(state, { songRemove }) {
            const station = state.stations.find((s) => s._id === songRemove.stationId)
            const idx = station.songs.findIndex((s) => s._id === songRemove.songId)
            station.songs.splice(idx, 1)
        },
        addStation(state, { stationToAdd }) {
            state.stations.push(stationToAdd)
        },
        addStationLike(state, { addLike }) {
            const station = state.stations.find((s) => s._id === addLike.station)
            station.likes += addLike.num
        },
        shuffleSongs(state, { stationShuffled }) {
            const station = state.stations.find((s) => s._id === stationShuffled._id)
            station.songs = stationShuffled.songs
        },
        removeStation(state, { stationId }) {
            const idx = state.stations.findIndex((s) => s._id === stationId)
            state.stations.splice(idx, 1)
        },
        addStationMsg(state, { stationMsgsAdd }) {
            const station = state.stations.find((s) => s._id === stationMsgsAdd._id)
            station.msgs = stationMsgsAdd.msgs
        },
        updateSongs(state, { stationOrdered }) {
            const station = state.stations.find((s) => s._id === stationOrdered._id)
            station.songs = stationOrdered.songs
        },
    },
    actions: {
        async loadStations({ commit }) {
            try {
                const stations = await stationService.query()
                commit({ type: 'setStations', stations })
            } catch {}
        },
        setCurrStation({ commit }, payload) {
            try {
                commit(payload)
            } catch {}
        },
        async removeSong({ commit }, { songRemove }) {
            try {
                await stationService.removeSong(songRemove)
                commit({ type: 'removeSong', songRemove })
            } catch {}
        },
        async addToStation({ commit }, { payload }) {
            try {
                const songToAdd = await stationService.addSongToStation(payload)
                commit({ type: 'addToStation', payload: { stationId: payload.stationId, song: songToAdd } })
            } catch {}
        },
        async addStation({ commit }, { station }) {
            try {
                const stationToAdd = await stationService.save(station)
                commit({ type: 'addStation', stationToAdd })
                return stationToAdd._id;
            } catch {}
        },
        async removeStation({ commit }, { stationId }) {
            try {
                await stationService.remove(stationId)
                commit({ type: 'removeStation', stationId })
            } catch {}
        },
        async addStationLike({ commit }, { addLike }) {
            try {
                const likeAdded = await stationService.addStationLike(addLike)
                commit({ type: 'addStationLike', addLike })
            } catch {}
        },
        async setFilter({ commit }, { filter }) {
            try {
                console.log('filter:', filter)
                const stations = await stationService.query(filter)
                commit({ type: 'setStations', stations })
            } catch {}
        },
        async shuffleSongs({ commit }, { stationId }) {
            try {
                const stationShuffled = await stationService.shuffleSongs(stationId)
                commit({ type: 'shuffleSongs', stationShuffled })
            } catch {}
        },
        async addStationMsg({ commit }, { addMsg }) {
            try {
                const stationMsgsAdd = await stationService.addStationMsg(addMsg)
                commit({ type: 'addStationMsg', stationMsgsAdd })
            } catch {}
        },
        async updateSongs( {commit} ,  {draggedSongs} ) {
            try {
                const stationOrdered = await stationService.updateSongs(draggedSongs)
                commit({ type: 'updateSongs', stationOrdered })
            } catch {}
        },
    }
}