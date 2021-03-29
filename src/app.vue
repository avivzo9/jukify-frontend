<template>
  <div id="app" class="main-layout">
    <section class="container">
      <div class="nav sub-container">
        <div>
          <router-link class="main-logo link" to="/"> <img class="logo-image" height="45px" width="65.5" src="http://www.88bit.net/img/Jukify_outline_white.png" alt=""></router-link>
        </div>
          <span @click="isMenu = !isMenu" class="menu">☰</span>
        <div @click="isMenu = false" :style="{'max-width': menuDisplay}" class="nav-content">
          <router-link class="link" to="/explore">Explore</router-link>
          <router-link class="link" to="/create">Create station</router-link>
          <router-link class="link" to="/profile">Profile</router-link>
        </div>
      </div>
    </section>
    <section @click="isMenu = false" class="view-router">
      <router-view />
    </section>
    <section @click="isMenu = false" class="player-container">
      <playerControl />
    </section>
  </div>
</template>

<script>
import { socketService } from "./services/socket.service";
import playerControl from "./cmps/player-control";
export default {
  data() {
    return {
      isMenu: false
    }
  },
  computed: {
    menuDisplay() {
      return (this.isMenu) ? '100vw' : '0'
    }
  },
  async created() {
    await this.$store.dispatch({ type: "loadStations" });
    socketService.setup();
  },
  components: {
    playerControl,
  },
};
</script>
