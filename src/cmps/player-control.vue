<template>
  <div class="song-player">
    <div class="song-video">
      <youtube :video-id="songId" ref="youtube"></youtube>
    </div>
    <img v-if="song" :src="songImage" alt="" :class="imgRotate" />
    <img
      v-else
      src="https://images.macrumors.com/t/tCPS-yWwAQ_siFOl14cUWLHEw1c=/400x0/filters:quality(90)/article-new/2018/05/apple-music-note-800x420.jpg?lossy"
      :class="imgRotate"
    />
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
        <span v-else>0:00</span>
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
      interval: null,
      songPlayer: {
        volumeRange: 100,
        currTime: null,
        duration: null,
        songLength: null,
        formattedTime: "0:00",
      },
    };
  },
  methods: {
    async togglePlay() {
      try {
        // const playing = await this.$store.dispatch({ type: "togglePlay" });
        // playing ? this.player.playVideo() : this.player.pauseVideo();
        socketService.emit("player to-toggle-play-song");
      } catch (err) {
        console.log("err:", err);
      }
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
      try {
        const volume = await this.$store.dispatch({
          type: "setSongVolume",
          vol,
        });
        return this.player.setVolume(volume);
      } catch (err) {
        console.log("err:", err);
      }
    },
    async playVideo() {
      await this.$store.dispatch({ type: "playVideo" });
      this.$nextTick(() => {
        this.player.playVideo();
      });
    },
    changeSong(dif) {
      try {
        socketService.emit("player to-next-previouse-song", dif);
      } catch (err) {
        throw err;
      }
    },
    async changeSongForSockets(dif) {
      console.log("dif:", dif);
      try {
        clearInterval(this.interval);
        this.interval = null;
        const payload = { dif };
        this.$store.dispatch({ type: "changeSong", payload }).then(() => {
          this.songPlayer.currTime = 0;
          this.$nextTick(() => {
            this.playVideo();
            this.$root.$emit("startPlaySong");
          });
          this.$store.getters.getSongName;
        });
      } catch (err) {
        throw err;
      }
    },
    async muteSong() {
      const isMute = await this.$store.dispatch({ type: "muteSong" });
      this.songPlayer.isMuted = !this.songPlayer.isMuted;
      return isMute ? this.player.mute() : this.player.unMute();
    },
    setSongTime() {
      socketService.emit("player to-set-song-time", this.songPlayer.currTime);
    },
    async setSongTimeForSockets(time) {
      this.player.seekTo(time);
    },
    forMounted(num = 0) {
      try {
        this.$nextTick(() => {
          this.player.playVideo();
          this.interval = setInterval(() => {
            this.player.getCurrentTime().then((currTime) => {
              if (!currTime || !this.songPlayer.songLength) return;
              var minutes = Math.floor(parseInt(currTime.toFixed(0)) / 60);
              var seconds = parseInt(currTime.toFixed(0)) - minutes * 60;
              const songPlayercurrTimeCopy = JSON.stringify(
                JSON.parse(this.songPlayer.currTime)
              );
              if (
                songPlayercurrTimeCopy === this.songPlayer.songLength.toFixed(0)
              ) {
                this.changeSong(1);
                return;
              }
              if (currTime - minutes * 60 > 59.9) {
                seconds = 0;
              }
              if (seconds < 10)
                this.songPlayer.formattedTime = minutes + ":0" + seconds;
              else this.songPlayer.formattedTime = minutes + ":" + seconds;
              this.songPlayer.currTime = currTime.toFixed(0);
            });
          }, 200);
          setTimeout(() => {
            this.player.getDuration().then((duration) => {
              this.songPlayer.songLength = duration;
              var minutes = duration / 60;
              minutes = Math.floor(minutes);
              var seconds = duration - minutes * 60;
              seconds = Math.round(seconds.toFixed(0));
              if (seconds < 10)
                this.songPlayer.duration = minutes + ":0" + seconds;
              else this.songPlayer.duration = minutes + ":" + seconds;
            });
          }, num);
        });
        this.playVideo(this.songId);
        this.$store.getters.getSongName;
      } catch {}
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
      return this.$store.getters.getSongName;
    },
    imgRotate() {
      return this.$store.state.playerStore.songPlayer.isPlaying
        ? "song-image rotating"
        : "song-image";
    },
  },
  mounted() {
    this.$root.$on("startPlaySong", () => this.forMounted(1500));
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
    socketService.off("player next-previouse-song", this.changeSongForSockets);
    socketService.terminate();
  },
};
</script>