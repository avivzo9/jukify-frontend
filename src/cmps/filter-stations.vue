<template>
  <div class="filter-container column-layout-container">
    <div>
      <input
        type="text"
        placeholder="Search station"
        @input="filterSong"
        v-model="filterBy.byName"
      />
    </div>
    <div class="filter-genre-container row-layout-container">
      <button :class="isClicked('all')" @click="genreSelect('all')">All</button>
      <button :class="isClicked('popular')" @click="genreSelect('popular')">
        Popular
      </button>
      <button
        v-for="(genre, idx) in genres"
        :key="idx"
        :class="isClicked(genre)"
        @click="genreSelect(genre)"
      >
        {{ genre }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      genre: "all",
      filterBy: {
        byName: "",
        byGenre: "",
        byPopular: false,
      },
    };
  },
  methods: {
    async filterSong() {
      try {
        const filter = this.filterBy;
        await this.$store.dispatch({ type: "setFilter", filter });
      } catch {}
    },
    genreSelect(genre) {
      if (genre === "popular") {
        this.filterBy.byPopular = !this.filterBy.byPopular;
      } else {
        this.genre = genre;
        this.filterBy.byGenre = genre.toLowerCase();
      }
      this.filterSong();
    },
    isClicked(genre) {
      if (genre === "popular")
        return this.filterBy.byPopular ? "clicked-filter-btn" : "";
      return (genre === this.genre && genre === "All") || genre === this.genre
        ? "clicked-filter-btn"
        : "";
    },
  },
  computed: {
    genres() {
      return this.$store.state.stationStore.genres;
    },
    showGenre() {
      this.genre.charAt(0);
      return this.genre;
    },
  },
  mounted() {
    if (!this.$store.state.stationStore.filterBy.byGenre) return
    this.filterBy.byGenre = this.$store.state.stationStore.filterBy.byGenre;
    this.genreSelect(this.$store.state.stationStore.filterBy.byGenre);
    const resetGenre = ''
    this.$store.dispatch({ type: "updateGenreFilter", resetGenre });
  },
};
</script>

<style>
</style>