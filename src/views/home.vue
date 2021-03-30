<template>
  <div class="home-page-container column-layout-container">
    <div class="hero-container column-layout-container">
      <router-link class="hero-header link" to="/explore"
        >start listening now</router-link
      >
    </div>
    <div class="home-cards-container column-layout-container">
      <h1>Looking for music?</h1>
      <div
        class="home-genre-container column-layout-container"
        v-for="(genre, idx) in genres"
        :key="idx"
      >
        <div class="genre-header row-layout-container">
          <h2>{{ genre }}</h2>
          <button @click="sendToGenre(genre)">See All</button>
        </div>
        <home-list :genre="genre" @loader="loading" />
      </div>
    </div>
    <div v-if="isLoading" class="loader-container row-layout-container">
      <img
        src="../assets/img/loader.gif"
      />
    </div>
  </div>
</template>
<script>
import homeList from "../cmps/home-list";
export default {
  name: "Home",
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    genres() {
      return this.$store.state.stationStore.homeGenres;
    },
  },
  methods: {
    loading() {
      this.isLoading = false;
    },
    sendToGenre(genre) {
      this.$store.dispatch({ type: "updateGenreFilter", genre });
      this.$router.push("/explore");
    },
  },
  components: {
    homeList,
  },
};
</script>