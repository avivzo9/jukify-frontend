<template>
  <router-link
    class="link station-card column-layout-container"
    :to="'/details/' + station._id"
  >
    <img
      :src="station.imgUrl"
      :alt="station.name + ' image, cold\'nt found.'"
    />
    <h2>{{ showName(station.name) }}</h2>
    <div class="station-genre-container column-layout-container">
      <h4>{{ station.genres[0] }}</h4>
      <h4>{{ station.genres[1] }}</h4>
    </div>
    <p>
      <font-awesome-icon icon="heart" />
      {{ this.likesToShow }}
    </p>
    <p>{{ station.songs.length }} Songs</p>
  </router-link>
</template>

<script>
export default {
  props: ["station"],
  data() {
    return {
      likesToShow: null,
    };
  },
  methods: {
    sendStation() {},
    likes(likes) {
      likes.toLocaleString();
    },
    showName(name) {
      const newName = name.length > 15 ? name.slice(0, 15) + "..." : name;
      return newName;
    },
  },
  created() {
    this.likesToShow = this.station.likes.toLocaleString();
  },
};
</script>
