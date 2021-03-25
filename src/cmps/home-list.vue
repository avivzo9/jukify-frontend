<template>
  <ul class="home-station-song row-layout-container">
    <li
      class="home-station-card-container"
      v-for="station in stations"
      :key="station._id"
    >
      <home-preview :station="station" />
    </li>
  </ul>
</template>
 
<script>
import homePreview from "../cmps/home-preview.vue";
export default {
  props: ["genre"],
  name: "station-list",
  data() {
    return {
      stations: null,
    };
  },
  methods: {
    checkGenre() {
      const stations = this.$store.state.stationStore.stations;
      const stationsAfterFilter = stations.filter((s) => {
        return s.genres.includes(this.genre.toLowerCase());
      });
      this.stations = stationsAfterFilter;
      if (this.stations) this.$emit('loader', false)
    },
  },
  async created() {
    await this.$store.dispatch({ type: "loadStations" });
    this.checkGenre();
  },
  components: {
    homePreview,
  },
};
</script>