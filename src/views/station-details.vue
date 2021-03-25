<template>
  <section class="details-container" v-if="currStation">
    <div class="station-details column-layout-container">
      <div class="station-img column-layout-container">
        <img :src="currStation.imgUrl" />
      </div>

      <div class="station-desc row-layout-container">
        <div>
          <div>
            <h1>{{ currStation.name }}</h1>
            <p>{{ currStation.desc }}</p>
          </div>
          <div>
            <font-awesome-icon style="color: red" icon="heart" />
            {{ likes(currStation.likes) }}
          </div>
        </div>
        <div class="menu-container">
          <span class="station-menu" v-if="!isDelete" @click="showDeleteStation"
            >⋮</span
          >
          <span class="station-menu-delete" v-else @click="removeStation"
            >🗑</span
          >
        </div>
      </div>
      <div class="station-play-like row-layout-container">
        <font-awesome-icon icon="play" @click="playVideo(null)" />
        <font-awesome-icon icon="random" @click="shuffleSongs" />
        <font-awesome-icon
          v-if="!isLiked"
          icon="heart"
          @click="addStationLike"
        />
        <font-awesome-icon
          v-else
          style="color: red"
          icon="heart"
          @click="addStationLike"
        />
      </div>
      <div class="search-songs-container row-layout-container">
        <div class="search-container row-layout-container">
          <font-awesome-icon
            class="plus-icon"
            :style="{ transform: searchClass }"
            icon="plus"
            @click="changeToSearch"
          />
          <div class="search-songs row-layout-container">
            <form v-if="isSearch">
              <input
                @input="debounceInput"
                type="text"
                placeholder="Search song online"
                v-model="search"
              />
            </form>
          </div>
        </div>
        <font-awesome-icon
          class="pen-icon"
          @click="showDeleteSong"
          :style="{ color: penClass }"
          icon="pen"
        />
      </div>
    </div>
    <div class="chat-room column-layout-container">
      <station-chat :currStation="currStation" />
    </div>
    <div class="songs-container row-layout-container">
      <div v-if="currStation" class="station-songs-container">
        <ul>
          <draggable v-model="myList">
            <li
              @click="playVideo(song.videoId)"
              v-for="song in currStation.songs"
              :key="song._id"
            >
              <div class="song-desc row-layout-container">
                <img :src="song.img" />
                <p>{{ song.name }}</p>
                <!-- {{ songNameDisplay(song) }} -->
              </div>
              <div class="sog-menu-container">
                <font-awesome-icon
                  v-if="isSongDelete"
                  class="delete-song"
                  icon="trash-alt"
                  @click.stop="removeSong(song._id)"
                  style="color: red"
                />
              </div>
            </li>
          </draggable>
        </ul>
      </div>
      <div
        class="songs-result-container"
        :style="{ 'max-width': resultsMaxwidth }"
      >
        <ul>
          <li
            @click="addToStation(idx)"
            v-for="(song, idx) in foundSongs"
            :key="idx"
          >
            <span>{{ songResaultNameDisplay(song.snippet.title) }}</span>
            <font-awesome-icon class="add-song" icon="plus" />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import draggable from "vuedraggable";
import { stationService } from "../services/station.service";
import { socketService } from "../services/socket.service.js";
import playerControl from "../cmps/player-control";
import stationChat from "../cmps/station-chat";
export default {
  name: "station-details",
  data() {
    return {
      currStation: null,
      foundSongs: null,
      isSearch: false,
      search: "",
      videoId: null,
      isLiked: false,
      isResult: false,
      isChat: false,
      isDelete: false,
      isSongDelete: false,
    };
  },
  methods: {
    playVideo(id) {
      socketService.emit("station new-song", id);
      socketService.emit("chat topic", this.currStation._id);
    },
    async playSongForSockets(id) {
      try {
        if (!id) id = this.currStation.songs[0].videoId;
        this.videoId = id;
        await this.$store.dispatch({
          type: "setStation",
          currStation: this.currStation,
        });
        await this.$store.dispatch({
          type: "setVideoId",
          videoId: this.videoId,
        });
        this.$root.$emit("startPlaySong");
      } catch (err) {}
    },
    likes(likes) {
      return likes.toLocaleString();
    },
    async searchSongs() {
      try {
        if (!this.search) this.isResult = false;
        this.isResult = true;
        const songs = await stationService.askSearch(this.search);
        this.foundSongs = songs;
      } catch {}
    },
    async removeSong(songId) {
      try {
        await this.$confirm(
          "Are you sure you want to delete this song?",
          "Warning",
          {
            confirmButtonText: "Sure",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        );
        const songRemove = {
          songId,
          stationId: this.currStation._id,
        };
        socketService.emit("station to-change-song", songRemove);
      } catch (err) {
        console.log("err", err);
      }
    },
    async removeSongForSockets(songRemove) {
      try {
        await this.$store.dispatch({ type: "removeSong", songRemove });
        this.$message({
          type: "success",
          message: "Song deleted successfuly!",
        });
      } catch (err) {
        if ((err = "cancel")) return;
        this.$message({
          type: "error",
          message: "Song could'nt be deleted, please try again later.",
        });
      }
    },
    async addToStation(idx) {
      try {
        const selectedSong = this.foundSongs[idx];
        const payload = {
          selectedSong,
          stationId: this.currStation._id,
        };
        socketService.emit("station to-add-song", payload);
      } catch (err) {
        console.log("err:", err);
      }
    },
    async addToStationForSockets(payload) {
      try {
        await this.$store.dispatch({ type: "addToStation", payload });
        this.$message({ type: "success", message: "Song added successfuly!" });
      } catch {
        this.$message({
          type: "error",
          message: "Song could'nt be added, please try again later.",
        });
      }
    },
    async removeStation() {
      try {
        if (
          !this.$store.state.userStore.user ||
          this.$store.state.userStore.user === "guest"
        )
          return this.$message({
            type: "warning",
            message: "You are not authorized!",
          });
        if (this.$store.state.userStore.user._id !== this.currStation.createdBy)
          return this.$message({
            type: "warning",
            message: "You are not authorized!",
          });
        await this.$confirm(
          "Are you sure you want to delete this station?",
          "Warning",
          { confirmButtonText: "Yes", cancelButtonText: "No", type: "warning" }
        );
        const stationId = this.currStation._id;
        await this.$store.dispatch({
          type: "removeStation",
          stationId,
        });
        this.$message({
          type: "success",
          message: "Station deleted successfuly!",
        });
        this.$router.push("/explore");
      } catch (err) {
        if (err === "cancel") return;
        this.$message({
          type: "error",
          message: "Station could'nt be deleted, please try again later.",
        });
      }
    },
    async addStationLike() {
      try {
        const num = this.isLiked ? -1 : 1;
        const addLike = {
          station: this.currStation._id,
          num,
        };
        this.isLiked = !this.isLiked;
        socketService.emit("station to-like", addLike);
      } catch (err) {
        console.log("err:", err);
      }
    },
    async addStationLikeForSockets(addLike) {
      try {
        await this.$store.dispatch({ type: "addStationLike", addLike });
      } catch (err) {
        console.log("err:", err);
      }
    },
    songNameDisplay(song) {
      var songName = JSON.parse(JSON.stringify(song.name));
      const name =
        song.name.length >= 70 ? songName.slice(0, 70) + "..." : song.name;
      return name;
    },
    songResaultNameDisplay(song) {
      const name = song.length >= 50 ? song.slice(0, 50) + "..." : song;
      return name;
    },
    async shuffleSongs() {
      try {
        const stationId = this.currStation._id;
        await this.$store.dispatch({ type: "shuffleSongs", stationId });
        this.currStation = this.$store.state.stationStore.currStation;
        socketService.emit("station to-shuffleSongs", this.currStation);
      } catch (err) {
        console.log("err", err);
      }
    },
    async shuffleSongsForSockets(shuffledStation) {
      try {
        this.currStation = shuffledStation;
        this.playVideo();
      } catch {}
    },
    debounce(func, wait = 500) {
      let timeout;
      return function (...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    changeToSearch() {
      this.isSearch = !this.isSearch;
      this.isResult = false;
    },
    setDragNDropForSockets(newStation) {
      try {
        this.currStation = newStation;
      } catch (err) {
        console.log("err:", err);
      }
    },
    showDeleteStation() {
      this.isDelete = true;
      setTimeout(() => {
        this.isDelete = false;
      }, 3000);
    },
    showDeleteSong() {
      this.isSongDelete = !this.isSongDelete;
    },
  },
  computed: {
    myList: {
      get() {
        return this.$store.state.stationStore.currStation.songs;
      },
      set(value) {
        const draggedSongs = {
          stationId: this.currStation._id,
          value,
        };

        this.$store.dispatch({ type: "updateSongs", draggedSongs });
        this.currStation = this.$store.state.stationStore.currStation;
        socketService.emit("station to-drag-n-drop", this.currStation);
      },
    },
    genres() {
      return this.$store.state.stationStore.genres;
    },
    resultsMaxwidth() {
      return this.isResult ? "100vw" : "0";
    },
    searchClass() {
      return this.isSearch ? "rotate(135deg)" : "";
    },
    penClass() {
      return this.isSongDelete ? "#1db954" : "";
    },
  },
  async created() {
    try {
      await this.$store.dispatch({ type: "loadStations" });
      const id = this.$route.params.stationName;
      this.$store.dispatch({ type: "setCurrStation", id });
      this.currStation = this.$store.state.stationStore.currStation;
      socketService.on("station change-song", this.playSongForSockets);
      socketService.on("station remove-song", this.removeSongForSockets);
      socketService.on("station add-song", this.addToStationForSockets);
      socketService.on("station like", this.addStationLikeForSockets);
      socketService.on("station shuffleSongs", this.shuffleSongsForSockets);
      socketService.on("station drag-n-drop", this.setDragNDropForSockets);
      this.debounceInput = this.debounce(this.searchSongs);
    } catch {}
  },
  destroyed() {
    socketService.off("station change-song", this.playSongForSockets);
    socketService.off("station remove-song", this.removeSongForSockets);
    socketService.off("station add-song", this.addToStationForSockets);
    socketService.off("station like", this.addStationLikeForSockets);
    socketService.off("station shuffleSongs", this.shuffleSongsForSockets);
    socketService.off("station drag-n-drop", this.setDragNDropForSockets);

    socketService.terminate();
  },
  components: {
    playerControl,
    stationChat,
    draggable,
  },
};
</script>