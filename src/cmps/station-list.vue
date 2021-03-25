<template>
  <div class="station-cards-container row-layout-container">
    <div v-if="!stations.length" class="list-empty column-layout-container">
      <h1>No results found for this search.</h1>
      <p>
        Please make sure you're words are spelled correctly<br />
        or use less or different keywords.
      </p>
    </div>
    <div
      class="station-preview-container column-layout-container"
      v-for="station in stations"
      :key="station._id"
    >
      <station-preview :station="station" />
    </div>
  </div>
</template>
 
<script>
import stationPreview from "./station-preview.vue";
export default {
  name: "station-list",
  data() {
    return {
      stationsFiltered: null,
      currStation: null,
    };
  },
  computed: {
    stations() {
      return this.$store.state.stationStore.stations;
    },
  },
  async created() {
    await this.$store.dispatch({ type: "loadStations" });
    if (this.stations.length) this.$emit("loader", false);
  },
  components: {
    stationPreview,
  },
};
</script>