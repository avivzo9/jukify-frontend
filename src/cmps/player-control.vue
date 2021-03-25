<template>
  <div class="song-player">
    <div class="song-video">
      <youtube :video-id="songId" ref="youtube"></youtube>
    </div>
    <img v-if="song" :src="songImage" alt="" :class="imgRotate" />
    <div class="playing-now row-layout-container" v-if="song">
      <h3>{{ song }}</h3>
    </div>
    <div class="playing-now row-layout-container" v-else>
      <h3>No song has been playing</h3>
    </div>
    <div class="main-player-section column-layout-container">
      <div class="playing-btns row-layout-container">
        <font-awesome-icon icon="step-backward" @click="changeSong(-1)" />
        <font-awesome-icon
          icon="play"
          @click="togglePlay"
          v-if="!$store.getters.getIsPlaying"
        />
        <font-awesome-icon icon="pause-circle" @click="togglePlay" v-else />
        <font-awesome-icon icon="step-forward" @click="changeSong(1)" />
      </div>
      <div class="duration-song row-layout-container">
        <span>{{ songPlayer.formattedTime }}</span>
        <input
          class="song-duration"
          @input="setSongTime"
          v-model="songPlayer.currTime"
          type="range"
          :max="songPlayer.songLength"
        />
        <span v-if="songPlayer.duration">{{ songPlayer.duration }}</span>
        <span v-else>00:00</span>
      </div>
    </div>
    <div class="music-btns row-layout-container">
      <font-awesome-icon
        icon="volume-mute"
        @click="muteSong"
        v-if="$store.getters.getIsSongMuted"
      />
      <font-awesome-icon icon="volume-up" @click="muteSong" v-else />
      <div class="volume-range-container">
        <el-slider
          @input="setSongVolume(songPlayer.volumeRange)"
          v-if="!$store.getters.getIsSongMuted"
          v-model="songPlayer.volumeRange"
          :show-tooltip="false"
        ></el-slider>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      songPlayer: {
        volumeRange: 100,
        currTime: null,
        duration: null,
        songLength: null,
        formattedTime: null,
      },
    };
  },
  methods: {
    async togglePlay() {
      socketService.emit("player to-toggle-play-song");
    },
    async togglePlayForSockets() {
      try {
        const playing = await this.$store.dispatch({ type: "togglePlay" });
        playing ? this.player.playVideo() : this.player.pauseVideo();
      } catch (err) {
        throw err;
      }
    },
    async setSongVolume(vol) {
      const volume = await this.$store.dispatch({ type: "setSongVolume", vol });
      return this.player.setVolume(volume);
    },
    async playVideo() {
      await this.$store.dispatch({
        type: "playVideo",
      });
      this.$nextTick(() => {
        this.player.playVideo();
      });
    },
    async changeSong(dif) {
      try {
        socketService.emit("player to-next-previouse-song", dif);
      } catch (err) {
        throw err;
      }
    },
    async changeSongForSockets(dif) {
      try {
        const payload = { dif };
        await this.$store.dispatch({ type: "changeSong", payload });
        this.$nextTick(() => {
          this.player.playVideo();
        });
        this.$store.getters.getSongName;
      } catch (err) {
        throw err;
      }
    },
    async muteSong() {
      const isMute = await this.$store.dispatch({ type: "muteSong" });
      this.songPlayer.isMuted = !this.songPlayer.isMuted;
      return isMute ? this.player.mute() : this.player.unMute();
    },
    async setSongTime() {
      socketService.emit("player to-set-song-time", this.songPlayer.currTime);
    },
    async setSongTimeForSockets(time) {
      this.player.seekTo(time);
    },
  },
  computed: {
    player() {
      return this.$refs.youtube.player;
    },
    songs() {
      return this.$store.state.stationState.songs;
    },
    songId() {
      return this.$store.getters.getSongId;
    },
    songImage() {
      return this.$store.getters.getSongImage;
    },
    song() {
      var song = JSON.parse(JSON.stringify(this.$store.getters.getSongName));
      if (!song) return;
      const name = song.slice(0, 30) + "...";
      return name;
    },
    imgRotate() {
      return this.$store.state.playerStore.songPlayer.isPlaying
        ? "song-image rotating"
        : "song-image";
    },
  },
  created() {},
  mounted() {
    this.$root.$on("startPlaySong", () => {
      this.$nextTick(() => {
        this.player.playVideo();
        setInterval(() => {
          this.player.getCurrentTime().then((duration) => {
            var minutes = Math.floor(parseInt(duration.toFixed(0)) / 60);
            var seconds = parseInt(duration.toFixed(0)) - minutes * 60;
            if (duration - minutes * 60 > 59.9) {
              seconds = 0;
            }
            if (seconds < 10)
              this.songPlayer.formattedTime =  minutes + ":0" + seconds;
            else this.songPlayer.formattedTime =  minutes + ":" + seconds;
            this.songPlayer.currTime = duration.toFixed(0);
          });
        }, 100);
        setTimeout(() => {
          this.player.getDuration().then((duration) => {
            this.songPlayer.songLength = duration;
            var minutes = duration / 60;
            var seconds = duration - minutes;
            minutes = minutes.toFixed(0);
            seconds = Math.round(seconds.toFixed(0) / 10);
            this.songPlayer.duration = minutes + ":" + seconds;
          });
        }, 1500);
      });
      this.playVideo(this.songId);
      this.$store.getters.getSongName;
    });
  },
  async created() {
    try {
      this.songPlayer.currTime = 0;
      socketService.on("player toggle-play-song", this.togglePlayForSockets);
      socketService.on("player set-song-time", this.setSongTimeForSockets);
      socketService.on("player next-previouse-song", (dif) => {
        this.changeSongForSockets(dif);
      });
    } catch (err) {
      console.log("error: ", err);
    }
  },
  destroyed() {
    socketService.off("player toggle-play-song", this.togglePlayForSockets);
    socketService.off("player set-song-time", this.setSongTimeForSockets);
    socketService.off(
      "player next-previouse-song",
      this.changeSongForSockets(dif)
    );
    socketService.terminate();
  },
};
</script>
