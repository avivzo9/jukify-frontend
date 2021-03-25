<template>
  <router-link
    class="link station-card column-layout-container"
    :to="'/details/' + station._id"
  >
    <img :src="station.imgUrl" />
    <h2>{{ showName(station.name) }}</h2>
    <p>
      <font-awesome-icon icon="heart" />
      {{ this.likesToShow }}
    </p>
    <p>{{ station.songs.length }} songs</p>
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
