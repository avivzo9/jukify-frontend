<template>
  <div class="explore-container column-layout-container">
    <div class="explore-header column-layout-container">
      <h1>Explore world music</h1>
      <filter-stations />
    </div>
    <div class="station-list-container row-layout-container">
      <station-list @loader="loading" />
    </div>
    <div v-if="isLoading" class="loader-container row-layout-container">
      <img
        src="../assets/img/loader.gif"
      />
    </div>
  </div>
</template>

<script>
import stationList from "../cmps/station-list";
import filterStations from "../cmps/filter-stations";
export default {
  name: "explore",
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    genres() {
      return this.$store.state.stationStore.genres;
    },
  },
  methods: {
    loading() {
      this.isLoading = false;
    },
  },
  components: {
    stationList,
    filterStations,
  },
};
</script>