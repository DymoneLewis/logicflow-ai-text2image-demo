<template>
  <div ref="application" class="application">
    <div>
      isSilentMode: {{ graphModel.editConfigModel?.isSilentMode
      }}{{ isSilentMode }}
    </div>
    <el-input
      v-model="inputValue"
      type="number"
      placeholder="请输入数字"
      style="width: 100%; margin-bottom: 20px"
      :disabled="isSilentMode"
      :min="0"
      :max="100"
      :step="1"
      :size="'small'"
    ></el-input>
    <el-button :disabled="isSilentMode" @click="handleClick">
      点击复制HtmlNode
    </el-button>
  </div>
</template>

<script>
// import { isNil } from "lodash-es";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Application",
  props: {
    graphModel: {
      type: Object,
      default: () => ({}),
    },
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
    console.log("updated model", this.$props.graphModel, this.$props.model);
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
