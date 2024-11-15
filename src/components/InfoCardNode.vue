<template>
  <div :style="nodeStyle" class="lf-info-card-node">
    <el-divider content-position="center"
      >{{ nodeTypeZhMap[type] }}描述</el-divider
    >
    <el-form>
      <el-form-item :label="item.label" v-for="item in config" :key="item.key">
        <el-select
          class="lf-info-card-node-selector"
          size="mini"
          v-model="descData[item.key]"
          placeholder="请选择"
          :filterable="item.filterable"
          :clearable="item.clearable"
          :multiple="item.multiple"
          :allow-create="item.allowCreate"
          @focus="onInfoCardNodeFocus"
          @blur="onInfoCardNodeBlur"
        >
          <template v-if="item.type === 'groupSelect'">
            <el-option-group
              v-for="group in item.options"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.label"
                :label="item.label"
                :value="item.label"
              />
            </el-option-group>
          </template>
          <template v-else>
            <el-option
              v-for="item in item.options"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            />
          </template>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { keys, isNil } from "lodash-es";
import { nodeFormConfig, nodeTypeZhMap } from "./config";

export default {
  name: "InfoCardNode",
  inject: ["getNode", "getGraph"],
  data() {
    return {
      nodeTypeZhMap,
      keys,
      config: {},
      descData: {},
      node: null,
      type: "",
      graph: null,
    };
  },
  computed: {
    nodeStyle() {
      if (isNil(this.$data.node)) return {};
      return this.$data.node.getNodeStyle();
    },
  },
  watch: {
    descData: {
      deep: true,
      handler(newVal) {
        this.$data.node.setProperties(newVal);
      },
    },
  },
  mounted() {
    const { type } = this.getNode();
    this.$data.config = nodeFormConfig[type];
    this.$data.type = type;
    this.$data.node = this.getNode();
    this.$data.graph = this.getGraph();
  },
  methods: {
    onInfoCardNodeFocus() {
      this.$data.graph.eventCenter.emit("info-card-select-focus");
    },
    onInfoCardNodeBlur() {
      this.$data.graph.eventCenter.emit("info-card-select-blur");
    },
  },
};
</script>

<style>
.lf-info-card-node {
  width: calc(90% - 12px);
  height: calc(96% - 20px);
  background: #fff;
  /* margin: 4px; */
  padding: 10px;
  border-radius: 10px;
}
.lf-info-card-nod-title {
  margin-bottom: 10px;
}

.el-form-item__label {
  line-height: 1;
}
</style>
