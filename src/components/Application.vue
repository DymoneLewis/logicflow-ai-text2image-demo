<template>
  <div ref="application" class="application">
    <div>isSilentMode: {{ isSilentMode }}</div>
    <div>{{ properties.tableName }}</div>
    <div>hoverStatus: {{ model.isHovered }}</div>
    <div>selectStatus: {{ model.isSelected }}</div>
    <input v-model="inputValue" />
    <div>{{ inputValue }}</div>
    <button :disabled="isSilentMode" @click="handleClick">
      点击复制HtmlNode
    </button>
  </div>
</template>

<script>
// import { isNil } from "lodash-es";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Application",
  props: {
    properties: {
      type: Object,
      default: () => ({}),
    },
    model: {
      type: Object,
      default: () => ({}),
    },
    isSilentMode: Boolean,
  },
  data() {
    return {
      inputValue: "",
    };
  },
  updated() {
    console.log("updated model", this.model.isSelected);
  },
  watch: {
    properties: {
      handler(newVal) {
        console.log("newVal properties", newVal);
      },
    },
    inputValue: {
      handler(newVal) {
        const { graphModel, id, height } = this.$props.model;
        const isSameHeight = height === this.$refs.application.scrollHeight;
        if (newVal > 10 && !isSameHeight) {
          graphModel.eventCenter.emit("change-node-height", {
            id,
            height: this.$refs.application.scrollHeight,
          });
        }
      },
    },
  },
  methods: {
    handleClick() {
      console.log("handleClick");
      const { graphModel } = this.$props.model;
      const data = this.$props.model.getData();
      console.log("click data", data);
      graphModel.eventCenter.emit("custom:node-click", {
        data,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* .vue-container {
    width: 100%;
    height: 100%;
  } */
.application {
  background: #ffaacc;
  padding: 5%;
  border-radius: 8px;
  width: 90%;
  height: 80%;
}
h3 {
  margin: 40px 0 0;
}
</style>
