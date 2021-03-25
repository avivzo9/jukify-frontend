<template>
  <div>
    <el-select v-model="value1" :multiple-limit="2" multiple @change="sendGenres" placeholder="Select genre/s">
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
      ],
      value1: []
    };
  },
  methods: {
      sendGenres() {
          this.$emit('genre-selected', this.value1)
      }
  },
};
</script>