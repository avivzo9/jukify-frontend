<template>
  <div>
    <el-select
      v-model="value1"
      :multiple-limit="2"
      filterable
      no-match-text="Can't find this genre"
      multiple
      @change="sendGenres"
      placeholder="Select genre/s"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "hip-hop",
          label: "Hip-Hop",
        },
        {
          value: "israeli",
          label: "Israeli",
        },
        {
          value: "band",
          label: "Band",
        },
        {
          value: "chill",
          label: "Chill",
        },
        {
          value: "pop",
          label: "Pop",
        },
        {
          value: "latin",
          label: "Latin",
        },
        {
          value: "rock",
          label: "Rock",
        },
        {
          value: "techno",
          label: "Techno",
        },
        {
          value: "house",
          label: "House",
        },
        {
          value: "jazz",
          label: "Jazz",
        },
      ],
      value1: [],
    };
  },
  methods: {
    sendGenres() {
      this.$emit("genre-selected", this.value1);
    },
  },
};
</script>