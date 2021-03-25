<template>
  <div class="station-create-container column-layout-container">
    <div class="create-header">
      <h1>Create new station!</h1>
    </div>
    <div class="form-container row-layout-container">
      <div class="left-side-container column-layout-container">
        <div class="img-container">
          <img v-if="!imgSrc" src="../assets/img/no-img-jukify.jpg" />
          <img v-else :src="imgSrc" />
        </div>
        <div class="img-upload-container flex">
          <label>
            <input
              type="file"
              @change="imgLoad"
              class="img-upload-input"
            />Upload Image</label
          >
          <button v-if="!isUrl" @click="isUrl = !isUrl">Use URL</button>
          <div v-if="isUrl">
            <input type="text" placeholder="Place URL here" v-model="imgSrc" />
            <button @click="isUrl = !isUrl">Save</button>
          </div>
        </div>
      </div>
      <div class="right-side-container column-layout-container">
        <form @submit.prevent="addStation">
          <input
            type="text"
            maxlength="17"
            placeholder="Station name"
            v-model="newStation.name"
          />
          <genre-select @genre-selected="setGenre" />
          <textarea
            placeholder="Station description"
            rows="3"
            v-model="newStation.desc"
          />
          <button>Save</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import genreSelect from "../cmps/genre-select";
import { stationService } from "../services/station.service";
export default {
  data() {
    return {
      newStation: null,
      imgSrc: null,
      isUrl: false,
    };
  },
  methods: {
    setGenre(genres) {
      this.newStation.genres = genres;
    },
    imgLoad(ev) {
      if (!ev.target.files[0]) return;
      const image = ev.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (ev) => {
        this.imgSrc = ev.target.result;
      };
    },
    async addStation() {
      try {
        if (!this.imgSrc) this.imgSrc =  'https://images.macrumors.com/t/tCPS-yWwAQ_siFOl14cUWLHEw1c=/400x0/filters:quality(90)/article-new/2018/05/apple-music-note-800x420.jpg?lossy'
        this.newStation.name = this.newStation.name.charAt(0).toUpperCase() + this.newStation.name.slice(1);
        this.newStation.name.replace(" and ", " & ");
        this.newStation.imgUrl = this.imgSrc;
        const station = this.newStation;
        const stationId = await this.$store.dispatch({
          type: "addStation",
          station,
        });
        this.$message({
          type: "success",
          message: "station created seccesfully",
        });
        this.$router.push(`/details/${stationId}`);
      } catch {
        this.$message.error({
          type: "error",
          message: "Oops, could'nt create station, please try again later.",
        });
      }
    },
  },
  components: {
    genreSelect,
  },
  created() {
    this.newStation = stationService.getEmptyStation();
  },
};
</script>

<style>
</style>