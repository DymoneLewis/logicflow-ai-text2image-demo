<template>
  <div id="app">
    <div class="lf-container" ref="container"></div>
  </div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import { DndPanel } from "@logicflow/extension";
import "@logicflow/core/lib/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import InfoCardNode from "./components/InfoCardNode";
import { ImgGenerator } from "./components/ImgGenerator";
import {
  nodeType,
  nodeType2Model,
  nodeTypeZhMap,
  nodeTypeIcon,
  nodeTypeProperties,
} from "./components/config";
import { register } from "@logicflow/vue-node-registry";

export default {
  name: "App",
  data() {
    return {
      lf: null,
    };
  },
  mounted() {
    this.$_initLf();
  },
  methods: {
    getNodePatternConfig(type) {
      // 生成节点在拖拽面板上的映射
      return {
        type,
        label: nodeTypeZhMap[type],
        icon: nodeTypeIcon[type],
        properties: nodeTypeProperties[type],
      };
    },
    $_initLf() {
      // 画布配置
      const lf = new LogicFlow({
        grid: {
          enabled: true,
          size: 20,
        },
        allowResize: true, // 全局的节点缩放配置
        allowRotate: true, // 全局的节点旋转配置
        keyboard: {
          enabled: true,
        },
        edgeType: "bezier",
        container: this.$refs.container,
        plugins: [DndPanel, ImgGenerator],
      });

      const pattern = [];
      nodeType.forEach((type) => {
        register(
          {
            type: type,
            component: InfoCardNode,
            model: nodeType2Model(type),
          },
          lf
        );
        pattern.push(this.getNodePatternConfig(type));
      });
      lf.setPatternItems(pattern);
      this.lf = lf;
      this.lf.render({});
      this.lf.on("connection:not-allowed", ({ msg }) => {
        this.$message.error(msg);
      });
      this.lf.on("info-card-select-focus", () => {
        this.lf.keyboard.disable();
      });
      this.lf.on("info-card-select-blur", () => {
        this.lf.keyboard.enable();
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100vh;
  width: 100vw;
  display: flex;
}
.lf-container {
  height: 100%;
  width: 100%;
}
.lf-dndpanel {
  width: 120px;
  height: 540px;
  margin-top: 120px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.lf-dnd-item {
  width: 80px;
  height: 80px;
  border: 1px solid #acacac;
  border-radius: 10px;
}
.lf-dnd-shape {
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
}
.lf-generate-panel {
  width: 400px;
  padding: 1%;
  height: 800px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
