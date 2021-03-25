export const playerStore = {
    strict: true,
    state: {
        songId: null,
        currStation: null,
        songPlayer: {
            isPlaying: false,
            isMuted: false,
            volumeRange: 50,
            songName: "",
            songImg: ""
        },
    },
    getters: {
        getSongId(state) {
            return state.songId
        },
        getSongName(state) {
            return state.songPlayer.songName
        },
        getSongImage(state) {
            return state.songPlayer.songImg
        },
        getIsPlaying(state) {
            return state.songPlayer.isPlaying
        },
        getIsSongMuted(state) {
            return state.songPlayer.isMuted
        },
        getSongVolume(state) {
            return state.songPlayer.volumeRange
        },
        getCurrStation(state) {
            return state.currStation
        },
    },
    mutations: {
        togglePlay(state) {
            state.songPlayer.isPlaying = !state.songPlayer.isPlaying
        },
        setSongVolume(state, { vol }) {
            state.songPlayer.volumeRange = +vol
        },
        setStation(state, payload) {
            state.currStation = payload.currStation;
        },
        setVideoId(state, payload) {
            state.songPlayer.isPlaying = true;
            state.songId = payload.videoId;
        },
        playVideo(state) {
            state.songId = state.songId
            const currSong = state.currStation.songs.find((song) => {
                return song.videoId === state.songId;
            });
            state.songPlayer.songImg = currSong.img
            state.songPlayer.songName = currSong.name;
        },
        changeSong(state, { payload }) {
            const idx = state.currStation.songs.findIndex((song) => {
                return song.videoId === state.songId;
            });
            var songIdx = idx + payload.payload.dif;
            if (songIdx === state.currStation.songs.length) songIdx = 0;
            if (songIdx === -1) songIdx = state.currStation.songs.length - 1;
            const nextSong = state.currStation.songs[songIdx];
            state.songId = nextSong.videoId;
            state.songPlayer.songName = nextSong.name;
        },
        muteSong(state) {
            if (!state.songPlayer.isMuted) {
                state.songPlayer.isMuted = true;
            } else {
                state.songPlayer.isMuted = false;
            }
        },
    },
    actions: {
        async togglePlay(state) {
            try {
                state.commit({ type: 'togglePlay' })
                return state.state.songPlayer.isPlaying;

            } catch {}
        },
        setSongVolume(state, { vol }) {
            try {
                state.commit({ type: 'setSongVolume', vol })
                return state.state.songPlayer.volumeRange
            } catch {}
        },
        playVideo(state) {
            try {
                state.commit({ type: 'playVideo' })
                return state.songPlayer.songName
            } catch {}
        },
        changeSong(state, payload) {
            try {
                state.commit({ type: 'changeSong', payload })
            } catch {}
        },
        muteSong(state) {
            try {
                state.commit({ type: 'muteSong' })
                return state.state.songPlayer.isMuted
            } catch {}
        },
        setStation(state, { currStation }) {
            try {
                state.commit({ type: 'setStation', currStation })
            } catch {}
        },
        setVideoId(state, { videoId }) {
            try {
                state.commit({ type: 'setVideoId', videoId })
            } catch {}
        },
    }
}