<template>
  <div class="explore-container column-layout-container">
    <div class="explore-header column-layout-container">
      <h1>Explore world music</h1>
      <div v-if="isLoading" class="loading">
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          enable-background="new 0 0 100 100"
          xml:space="preserve"
        >
          <rect
            fill="#1DB954"
            width="1.5"
            height="20"
            transform="translate(0) rotate(180 3 50)"
          >
            <animate
              attributeName="height"
              attributeType="XML"
              dur="1s"
              values="20; 25; 20"
              repeatCount="indefinite"
            />
          </rect>
          <rect
            x="17"
            fill="#1DB954"
            width="1.5"
            height="20"
            transform="translate(0) rotate(180 20 50)"
          >
            <animate
              attributeName="height"
              attributeType="XML"
              dur="1s"
              values="18; 25; 18"
              repeatCount="indefinite"
              begin="0.1s"
            />
          </rect>
          <rect
            x="40"
            fill="#1DB954"
            width="1.5"
            height="1"
            transform="translate(0) rotate(180 40 50)"
          >
            <animate
              attributeName="height"
              attributeType="XML"
              dur="1s"
              values="23; 25; 23"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </rect>
          <rect
            x="60"
            fill="#1DB954"
            width="1.5"
            height="1"
            transform="translate(0) rotate(180 58 50)"
          >
            <animate
              attributeName="height"
              attributeType="XML"
              dur="1s"
              values="25; 29; 25"
              repeatCount="indefinite"
              begin="0.5s"
            />
          </rect>
          <rect
            x="80"
            fill="#1DB954"
            width="1.5"
            height="1"
            transform="translate(0) rotate(180 76 50)"
          >
            <animate
              attributeName="height"
              attributeType="XML"
              dur="1s"
              values="25; 30; 25"
              repeatCount="indefinite"
              begin="0.1s"
            />
          </rect>
        </svg>
      </div>
      <filter-stations />
    </div>
    <div class="station-list-container row-layout-container">
      <station-list @loader="loading" />
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
    loading(val) {
      this.isLoading = val;
    },
  },
  created() {
    const filter=this.$route.params.genre;
    console.log('this.$route.params:', this.$route.params)
    console.log('filter:', filter)
  },
  components: {
    stationList,
    filterStations,
  },
};
</script>