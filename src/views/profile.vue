<template>
  <section class="profile-container column-layout-container">
    <div class="profile-sub-container column-layout-container">
      <div
        class="login-container login-form column-layout-container"
        v-if="!$store.state.userStore.user"
      >
        <div v-if="!isSignup">
          <button @click="toLogin">Login</button>
        </div>
        <form v-if="isLogin" @submit.prevent="login">
          <input
            type="text"
            v-model="userLogin.username"
            placeholder="Enter UserName"
          />
          <input
            type="password"
            v-model="userLogin.password"
            placeholder="Enter Password"
          />
          <button>login</button>
        </form>
        <!-- <button v-if="$store.getters.getUser" @click="logout">logout</button> -->
      </div>
      <div
        class="sign-up-container login-form column-layout-container"
        v-if="!$store.state.userStore.user"
      >
        <div v-if="!isLogin">
          <button @click="toSignup">Sign-Up</button>
        </div>
        <form v-if="isSignup" @submit.prevent="signup">
          <input
            type="text"
            v-model="userSignup.fullname"
            placeholder="Enter Full Name:"
          />
          <input
            type="text"
            v-model="userSignup.username"
            placeholder="Enter UserName"
          />
          <input
            type="password"
            v-model="userSignup.password"
            placeholder="Enter Password"
          />
          <button>Sign-Up</button>
        </form>
      </div>
      <div v-if="$store.getters.getUser">
        {{ $store.getters.getUser.fullname }} is logged in
      </div>
      <div v-else>{{ $store.getters.getMsgToUser }}</div>
      <button @click="closeAll">Back</button>
      <button v-if="$store.state.userStore.user" @click="logout">logout</button>
    </div>
  </section>
</template>

<script>
export default {
  name: "user-profile",
  data() {
    return {
      userSignup: {
        fullname: "",
        username: "",
        password: "",
      },
      userLogin: {
        username: "",
        password: "",
      },
      isLogin: false,
      isSignup: false,
    };
  },
  methods: {
    toLogin() {
      this.isLogin = true;
      this.isSignup = false;
    },
    toSignup() {
      this.isLogin = false;
      this.isSignup = true;
    },
    toLogout() {
      this.isLogin = false;
      this.isSignup = true;
    },
    closeAll() {
      this.isLogin = false;
      this.isSignup = false;
    },
    async signup() {
      try {
        if (
          this.userSignup.fullname === "" ||
          this.userSignup.username === "" ||
          this.userSignup.password === ""
        )
          throw error;
        await this.$store.dispatch({ type: "signUp", user: this.userSignup });
        this.$message({ type: "success", message: "congrads, you'r in" });
        this.userSignup = {
          fullname: "",
          username: "",
          password: "",
        };
      } catch {
        this.$message.error({
          message:
            "Oops, could'nt sign up, please check if  your details are currect.",
        });
      }
    },
    async login() {
      try {
        if (this.userLogin.username === "" || this.userLogin.password === "")
          throw error;
        await this.$store.dispatch({ type: "login", user: this.userLogin });
        this.$message({ type: "success", message: "logged in seccesfully" });
        this.userLogin = {
          username: "",
          password: "",
        };
      } catch {
        this.$message.error({
          type: "error",
          message: "Oops, could'nt log in, please try again later.",
        });
      }
    },
    async logout() {
      try {
        await this.$confirm("Are you sure you want to log our?", "Warning", {
          confirmButtonText: "Sure",
          cancelButtonText: "Cancle",
          type: "warning",
        });
        await this.$store.dispatch({ type: "logout" });
        this.$message({
          type: "success",
          message: "Logged out seccesfully",
        });
      } catch (err) {
        if ((err = "cancel")) {
          this.$message({
            type: "success",
            message: "You stayed after all 😊",
          });
        } else {
          this.$message({
          type: "warning",
            message: "something went wrong, please try again later",
          });
        }
      }
    },
  },
};
</script>