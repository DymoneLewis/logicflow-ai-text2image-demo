<template>
  <div id="app">
    <div class="operae-btn-panel">
      <!-- <el-button @click="changeWidthHeight">修改节点宽高</el-button> -->
      <el-button @click="changeSilentMode">修改静默状态</el-button>
      <el-button @click="changeSnapGrid">修改网格吸附</el-button>
    </div>
    <div class="lf-container" ref="container"></div>
  </div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import {
  Menu,
  DndPanel,
  MiniMap,
  SelectionSelect,
  DynamicGroup,
} from "@logicflow/extension";
import "@logicflow/core/lib/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import InfoCardNode from "./components/InfoCardNode";
// import { ImgGenerator } from "./components/ImgGenerator";
import SubFlowNode from "./components/SubFlowNode.vue";
import CustomHtmlNode from "./components/customHtmlNode";

import {
  nodeType,
  nodeType2Model,
  nodeTypeZhMap,
  nodeTypeProperties,
} from "./components/config";
import { register, VueNodeModel } from "@logicflow/vue-node-registry";
// import renderData from "./flow.js";

export default {
  name: "App",
  data() {
    return {
      lf: null,
      poolCodeList: [],
      publickPoolNodeData: {},
    };
  },
  mounted() {
    this.$_initLf();
  },
  methods: {
    changeSilentMode() {
      const { editConfigModel } = this.lf.graphModel;
      const { isSilentMode } = editConfigModel;
      console.log("isSilentMode", isSilentMode);
      this.lf.updateEditConfig({
        isSilentMode: !isSilentMode,
      });
    },
    changeSnapGrid() {
      const { editConfigModel } = this.lf.graphModel;
      const { snapGrid } = editConfigModel;
      console.log("snapGrid", snapGrid);
      this.lf.updateEditConfig({
        snapGrid: !snapGrid,
      });
    },
    changeWidthHeight() {
      const { nodes } = this.lf.graphModel;
      nodes.forEach((node) => {
        const {
          incoming: { edges: incomingEdges },
          outgoing: { edges: outgoingEdges },
          anchors,
        } = node;
        node.setProperties({
          width: 20,
          height: 100,
        });
        incomingEdges.forEach((edge) => {
          console.log("incomingEdges", node, edge);
          const { targetAnchorId, endPoint } = edge;
          const newTargetAnchor = anchors.find(
            (anchor) => anchor.id === targetAnchorId
          );
          const deltaX = newTargetAnchor.x - endPoint.x;
          const deltaY = newTargetAnchor.y - endPoint.y;
          console.log("newTargetAnchor", newTargetAnchor, "endPoint", endPoint);
          console.log("deltaX", deltaX, "deltaY", deltaY);
          edge.updatePoints();
        });
        outgoingEdges.forEach((edge) => {
          console.log("outgoingEdges", edge);
          const { sourceAnchorId, startPoint } = edge;
          const newSourceAnchor = anchors.find(
            (anchor) => anchor.id === sourceAnchorId
          );
          const deltaX = newSourceAnchor.x - startPoint.x;
          const deltaY = newSourceAnchor.y - startPoint.y;
          console.log(
            "newSourceAnchor",
            newSourceAnchor,
            "startPoint",
            startPoint
          );
          console.log("deltaX", deltaX, "deltaY", deltaY);
          edge.updatePoints();
        });
      });
    },
    getNodePatternConfig(type) {
      // 生成节点在拖拽面板上的映射
      return {
        type,
        label: nodeTypeZhMap[type],
        // icon: nodeTypeIcon[type],
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
        stopZoomGraph: false,
        stopScrollGraph: true,
        stopMoveGraph: false,
        allowResize: true, // 全局的节点缩放配置
        allowRotate: true, // 全局的节点旋转配置
        keyboard: {
          enabled: true,
        },
        edgeType: "polyline",
        container: this.$refs.container,
        plugins: [
          Menu,
          DndPanel,
          MiniMap,
          // ImgGenerator,
          SelectionSelect,
          DynamicGroup,
        ],
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
      register(
        {
          type: "subFlow",
          component: SubFlowNode,
          model: VueNodeModel,
        },
        lf
      );
      lf.extension.menu.setMenuByType({
        type: "lf:defaultSelectionMenu",
        menu: [
          {
            text: "组合",
            icon: true,
            callback: (data) => {
              let minX = Infinity;
              let minY = Infinity;
              let maxX = -Infinity;
              let maxY = -Infinity;
              console.log("data", data);
              data.nodes.forEach((node) => {
                minX = Math.min(minX, node.x - node.properties.width / 2);
                minY = Math.min(minY, node.y - node.properties.height / 2);
                maxX = Math.max(maxX, node.x + node.properties.width / 2);
                maxY = Math.max(maxY, node.y + node.properties.height / 2);
              });
              const width = maxX - minX;
              const height = maxY - minY;

              const centerX = minX + width / 2;
              const centerY = minY + height / 2;
              const groupNode = this.lf.graphModel.addNode({
                type: "dynamic-group",
                x: centerX,
                y: centerY,
                resizable: true,
                properties: {
                  width: width + 40,
                  height: height + 40,
                },
              });

              data.nodes.forEach((node) => {
                groupNode.addChild(node.id);
              });
              this.lf.graphModel.selectNodeById(groupNode.id);
              console.log("groupNode", groupNode);
            },
          },
        ],
      });
      lf.setPatternItems([
        {
          label: "选区",
          callback: () => {
            lf.openSelectionSelect();
            lf.once("selection:selected", () => {
              lf.closeSelectionSelect();
            });
          },
        },
        {
          type: "applicationNode",
          label: "自定义Html节点",
          properties: {
            width: 400,
            height: 400,
          },
        },
        ...pattern,
      ]);
      lf.register(CustomHtmlNode);
      this.lf = lf;
      window.lf = lf;
      this.lf.render({
        nodes: [
          {
            id: 1,
            type: "sceneNode",
            x: 300,
            y: 500,
            properties: {
              width: 200,
              height: 200,
            },
          },
          {
            id: 2,
            type: "behaviorNode",
            x: 600,
            y: 500,
            rotate: 0.25,
            properties: {
              width: 200,
              height: 120,
            },
          },
        ],
        edges: [
          // {
          //   type: "polyline",
          //   sourceNodeId: 1,
          //   targetNodeId: 2,
          // },
        ],
      });
      this.lf.extension.miniMap.show();

      setTimeout(() => {
        let allPoolFlowData = this.lf
          .getGraphData()
          ?.nodes?.filter((fil) => fil.type === "POOL");
        let allPoolFlowDataFlowPoolCodes = allPoolFlowData.map(
          (mm) => mm.properties?.flowPoolCode
        );

        console.log(
          "allPoolFlowDataFlowPoolCodes",
          allPoolFlowDataFlowPoolCodes
        );

        allPoolFlowData?.forEach((ff) => {
          this.lf.selectElementById(ff.id, false, true);
        });
      }, 10);
      // this.lf.render(renderData);
      this.lf.on("connection:not-allowed", ({ msg }) => {
        this.$message.error(msg);
      });
      this.lf.on("info-card-select-focus", () => {
        console.log("info-card-select-focus");
        this.lf.keyboard.disable();
      });
      this.lf.on("info-card-select-blur", () => {
        this.lf.keyboard.enable();
      });
    },
  },
};
</script>

<style lang="less">
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
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
}
.lf-dnd-item {
  width: 60px;
  height: 60px;
  border: 1px solid #acacac;
  border-radius: 10px;
}
.lf-dnd-shape {
  width: 10px;
  height: 10px;
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
.operae-btn-panel {
  display: flex;
  /* gap: 20px; */
  padding: 20px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .el-button {
    margin: 10px 0;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
