<template>
  <div
    class="img-generate-panel"
    @mouseenter="enableEventIsolation"
    @mouseleave="disableEventIsolation"
  >
    <div class="subFlowContainer" ref="subContainer" tabindex="0"></div>
  </div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import { DndPanel, MiniMap } from "@logicflow/extension";
import "@logicflow/core/lib/style/index.css";
import "@logicflow/extension/lib/style/index.css";

export default {
  name: "SubFlowNode",
  inject: ["getNode", "getGraph"],
  props: {
    lf: LogicFlow,
  },
  data() {
    return {
      subLf: null,
      isIsolated: false,
      eventHandlers: null,
      parentScaleX: 1,
      parentScaleY: 1,
      parentTranslateX: 0,
      parentTranslateY: 0,
    };
  },
  mounted() {
    this.$_initLf();
  },
  beforeDestroy() {
    this.disableEventIsolation();
  },
  methods: {
    $_initLf() {
      // 画布配置
      const lfIns = new LogicFlow({
        grid: {
          enabled: true,
          type: "mesh",
          size: 10,
        },
        height: 800,
        width: 400,
        background: {
          color: "#f6f8fa",
        },
        allowResize: true, // 全局的节点缩放配置
        allowRotate: true, // 全局的节点旋转配置
        keyboard: {
          enabled: true,
        },
        edgeType: "polyline",
        container: this.$refs.subContainer,
        plugins: [DndPanel, MiniMap],
      });

      const pattern = [];
      lfIns.setPatternItems(pattern);
      window.lf.on("graph:transform", (data) => {
        console.log("graph:transform", data);
        const { SCALE_X, SCALE_Y, TRANSLATE_X, TRANSLATE_Y } = data.transform;
        this.parentScaleX = SCALE_X;
        this.parentScaleY = SCALE_Y;
        this.parentTranslateX = TRANSLATE_X;
        this.parentTranslateY = TRANSLATE_Y;
      });
      this.subLf = lfIns;
      this.subLf.graphModel.transformModel.HtmlPointToCanvasPoint = (point) => {
        const [x, y] = point;
        const { TRANSLATE_X, TRANSLATE_Y, SCALE_X, SCALE_Y } =
          this.subLf.graphModel.transformModel;
        return [
          (x / this.parentScaleX - TRANSLATE_X) / SCALE_X,
          (y / this.parentScaleY - TRANSLATE_Y) / SCALE_Y,
        ];
      };
      this.subLf.render({
        nodes: [
          {
            id: 1,
            type: "rect",
            x: 100,
            y: 100,
            text: "生成图片",
            properties: {
              text: "生成图片",
            },
          },
          {
            id: 2,
            type: "rect",
            x: 200,
            y: 200,
            text: "生成图片",
            properties: {
              text: "生成图片",
            },
          },
        ],
        edges: [
          {
            type: "polyline",
            sourceNodeId: 1,
            targetNodeId: 2,
          },
        ],
      });
    },

    // HtmlPointToCanvasPoint(point) {
    //   const [x, y] = point;
    //   const { TRANSLATE_X, TRANSLATE_Y, SCALE_X, SCALE_Y } =
    //     this.subLf.graphModel.transformModel;
    //   return [
    //     (x - TRANSLATE_X - this.parentTranslateX) /
    //       (SCALE_X * this.parentScaleX),
    //     (y - TRANSLATE_Y - this.parentTranslateY) /
    //       (SCALE_Y * this.parentScaleY),
    //   ];
    // },

    // 启用事件隔离
    enableEventIsolation() {
      if (this.isIsolated) return;

      this.isIsolated = true;

      // 创建并存储所有事件处理函数
      this.eventHandlers = {
        // 使用捕获阶段拦截事件，防止事件传播到外部
        keydown: (e) => {
          // 关键：只有当事件不是来自内部 SVG 元素时才阻止传播
          if (
            (this.$el.contains(e.target) || e.target === this.$el) &&
            !this.isFromSvgCanvas(e.target)
          ) {
            e.stopPropagation();
          }
        },

        wheel: (e) => {
          // 只有当事件发生在画布边界但不是画布内部元素时才阻止传播
          if (
            (this.$el.contains(e.target) || e.target === this.$el) &&
            !this.isFromSvgCanvas(e.target)
          ) {
            e.stopPropagation();
            e.preventDefault();
          }
        },

        mousedown: (e) => {
          // 只在非画布元素上阻止事件冒泡
          if (this.$el.contains(e.target) || e.target === this.$el) {
            // 聚焦容器，使键盘事件能够被捕获
            this.$refs.subContainer.focus();

            // 只有当不是SVG画布内部元素时才阻止事件传播
            if (!this.isFromSvgCanvas(e.target)) {
              e.stopPropagation();
            }
          }
        },

        mouseup: (e) => {
          if (
            (this.$el.contains(e.target) || e.target === this.$el) &&
            !this.isFromSvgCanvas(e.target)
          ) {
            e.stopPropagation();
          }
        },

        click: (e) => {
          if (
            (this.$el.contains(e.target) || e.target === this.$el) &&
            !this.isFromSvgCanvas(e.target)
          ) {
            e.stopPropagation();
          }
        },

        contextmenu: (e) => {
          if (
            (this.$el.contains(e.target) || e.target === this.$el) &&
            !this.isFromSvgCanvas(e.target)
          ) {
            e.stopPropagation();
          }
        },

        mousemove: (e) => {
          // mousemove 是拖拽必需的，只有当不涉及 SVG 内部元素时才阻止
          if (
            (this.$el.contains(e.target) || e.target === this.$el) &&
            !this.isFromSvgCanvas(e.target) &&
            !this.isDragging
          ) {
            e.stopPropagation();
          }
        },

        // 添加鼠标离开事件处理
        mouseleave: () => {
          this.isDragging = false;
        },
      };

      // 跟踪是否正在拖拽
      this.isDragging = false;

      // 监听拖拽开始和结束
      this.$refs.subContainer.addEventListener("mousedown", () => {
        this.isDragging = true;
      });

      document.addEventListener("mouseup", () => {
        this.isDragging = false;
      });

      // 为所有事件添加捕获阶段的监听器
      document.addEventListener("keydown", this.eventHandlers.keydown, true);
      document.addEventListener("wheel", this.eventHandlers.wheel, {
        capture: true,
        passive: false,
      });
      document.addEventListener(
        "mousedown",
        this.eventHandlers.mousedown,
        true
      );
      document.addEventListener("mouseup", this.eventHandlers.mouseup, true);
      document.addEventListener("click", this.eventHandlers.click, true);
      document.addEventListener(
        "contextmenu",
        this.eventHandlers.contextmenu,
        true
      );
      document.addEventListener(
        "mousemove",
        this.eventHandlers.mousemove,
        true
      );
      document.addEventListener(
        "mouseleave",
        this.eventHandlers.mouseleave,
        true
      );
    },

    // 判断事件是否来自SVG画布内部元素
    isFromSvgCanvas(target) {
      // 向上遍历 DOM 树，检查是否有 SVG 元素是容器的子元素
      let currentElement = target;
      const container = this.$refs.subContainer;

      while (currentElement && currentElement !== document.body) {
        if (
          currentElement.tagName === "svg" &&
          container.contains(currentElement)
        ) {
          return true;
        }
        // 检查常见的 LogicFlow 元素类名
        if (
          currentElement.classList &&
          (currentElement.classList.contains("lf-node") ||
            currentElement.classList.contains("lf-edge") ||
            currentElement.classList.contains("lf-graph") ||
            currentElement.classList.contains("lf-canvas"))
        ) {
          return true;
        }
        currentElement = currentElement.parentElement;
      }
      return false;
    },

    // 禁用事件隔离
    disableEventIsolation() {
      if (!this.isIsolated) return;

      this.isIsolated = false;
      this.isDragging = false;

      // 移除所有事件监听器
      if (this.eventHandlers) {
        document.removeEventListener(
          "keydown",
          this.eventHandlers.keydown,
          true
        );
        document.removeEventListener("wheel", this.eventHandlers.wheel, {
          capture: true,
          passive: false,
        });
        document.removeEventListener(
          "mousedown",
          this.eventHandlers.mousedown,
          true
        );
        document.removeEventListener(
          "mouseup",
          this.eventHandlers.mouseup,
          true
        );
        document.removeEventListener("click", this.eventHandlers.click, true);
        document.removeEventListener(
          "contextmenu",
          this.eventHandlers.contextmenu,
          true
        );
        document.removeEventListener(
          "mousemove",
          this.eventHandlers.mousemove,
          true
        );
        document.removeEventListener(
          "mouseleave",
          this.eventHandlers.mouseleave,
          true
        );
        this.eventHandlers = null;
      }
    },
  },
};
</script>

<style scoped>
.img-generate-panel {
  padding: 10px;
  position: relative;
}

.subFlowContainer {
  outline: none;
  position: relative;
  /* 提高组件的层级，确保在隔离模式下正确接收事件 */
  z-index: 1;
}

/* 其他样式保持不变 */
.img-generate-panel-desc {
  padding: 10px;
}
.img-generate-img {
  height: 120px;
  width: 120px;
  margin: 10px;
  border: 3px solid #eaeaea;
}
.el-col {
  margin: 10px 0;
}
.image-slot {
  height: 100%;
  width: 100%;
  background: #eaeaea;
}
.image-slot-icon {
  font-size: 30px;
  color: #c0c4cc;
  margin-top: 40px;
}
</style>
