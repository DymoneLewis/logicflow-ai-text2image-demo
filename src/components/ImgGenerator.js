// import LogicFlow from "@logicflow/core";
import Vue from "vue";
import { isEmpty, flattenDeep, uniqBy } from "lodash-es";
import ImgGeneratePanel from "./ImgGeneratePanel.vue";
import { subjectQuantifierMap } from "./config";

export class ImgGenerator {
  static pluginName = "imgGenerator";
  lf;
  vueInstance;
  panelComponent;
  panelElement;
  domContainer;
  desc;
  isMounted = false;

  /**
   * 核心流程
   * 1. 获取画布数据的能力
   * 2. 流程图数据转换成完整句子
   * 3. 句子转换成propmpt
   * 4. prompt生成图片并展示
   * 5. 图片下载
   */

  constructor({ lf }) {
    // do anything
    this.lf = lf;
    const {
      graphModel: { eventCenter },
    } = lf;
    eventCenter.on("generate-start", () => {
      this.generateDesc();
    });
    eventCenter.on("img-generator-focus", () => {
      lf.keyboard.disable();
    });
    eventCenter.on("img-generator-blur", () => {
      lf.keyboard.enable();
    });
  }

  render(lf, domContainer) {
    const panelElement = document.createElement("div");
    const panelContainer = document.createElement("div");
    panelContainer.className = "lf-generate-panel";
    panelContainer.appendChild(panelElement);
    domContainer.appendChild(panelContainer);
    this.domContainer = domContainer;
    this.vueInstance = new Vue({
      render: (h) => {
        const component = h(ImgGeneratePanel, {
          props: {
            lf,
            desc: this.desc,
          },
        });
        this.panelComponent = component;
        return component;
      },
    });
    this.vueInstance.$mount(panelElement);
    this.panelElement = panelElement;
  }

  generateDesc() {
    const data = this.lf.getGraphData();
    if (isEmpty(data)) return;
    const result = this.convertDataToPrompt(data);
    this.desc = result;
    this.panelComponent.componentInstance.$props.desc = result;
    this.lf.graphModel.eventCenter.emit("generate-request-start", result);
  }

  subjectInfoTranslate(data, withCount = true) {
    // 初始化一个对象用于统计不同年龄和类型的数量
    const counts = {};
    // 遍历每个节点，统计每种年龄和类型的出现次数
    data.forEach((node) => {
      const {
        somatotype = "",
        hair = "",
        emotion = "",
        type = "",
      } = node.properties;
      const key = `${emotion}${somatotype}${hair}${type}`;

      if (counts[key]) {
        counts[key].count += 1;
      } else {
        counts[key] = { emotion, hair, somatotype, type, count: 1 };
      }
    });

    // 将统计结果转换成文本描述
    const result = Object.values(counts).map(
      ({ emotion, hair, somatotype, type, count }) => {
        return withCount
          ? `${count}${subjectQuantifierMap(
              type
            )}${emotion}${somatotype}${hair}${type}`
          : `${emotion}${somatotype}${hair}${type}`;
      }
    );
    // 处理连接符，将最后一个描述项与前面的项用“和”连接
    if (result.length > 1) {
      return result.slice(0, -1).join("、") + "和" + result[result.length - 1];
    } else {
      return result[0];
    }
  }

  sceneInfoTranslate(sceneInfo) {
    const { time, place } = sceneInfo;
    return `${time || ""}${place ? `在${place}` : ""}，`;
  }

  summaryTranslate(subjectNodes, behaviors) {
    if (subjectNodes.length > 2) {
      const behaviorDesc =
        behaviors.slice(0, -1).join("、") +
        "和" +
        behaviors[behaviors.length - 1];
      return `有${this.subjectInfoTranslate(
        subjectNodes
      )}在${behaviorDesc}, 其中`;
    }
    return "有";
  }

  convertDataToPrompt(data) {
    let sceneDesc = "";
    let summary = "";
    let subjectDesc = "";
    let behaviorDesc = "";
    let subjects = [];
    let behaviors = [];
    const sceneNodeInfo = data.nodes.find((node) => node.type === "sceneNode");

    if (sceneNodeInfo) {
      const { id, properties } = sceneNodeInfo;
      sceneDesc = this.sceneInfoTranslate(properties);
      const sceneNodeModel = this.lf.graphModel.getNodeModelById(id);
      const { nodes } = sceneNodeModel.outgoing;
      subjects = nodes.filter((node) => node.type === "subjectNode");
    } else {
      subjects = data.nodes
        .filter((node) => node.type === "subjectNode")
        .map((item) => this.lf.graphModel.getNodeModelById(item.id));
    }
    behaviors = uniqBy(
      flattenDeep(
        subjects.map((node) => {
          const { nodes } = node.outgoing;
          return nodes;
        })
      ),
      "id"
    );
    if (!isEmpty(subjects)) {
      subjectDesc = this.subjectInfoTranslate(subjects);
    }
    if (!isEmpty(behaviors)) {
      summary = this.summaryTranslate(subjects, behaviors);
      // subjectDesc = subjectInfoTranslate(nodes, false);
      behaviorDesc = behaviors
        .map((behaviorItem) => {
          const subjects = behaviorItem.incoming.nodes.filter(
            (node) => node.type === "subjectNode"
          );
          return `${this.subjectInfoTranslate(subjects)}在${
            behaviorItem.properties.behavior
          }`;
        })
        .join(",");
    }
    console.log("desc", sceneDesc, summary, subjectDesc, behaviorDesc);
    return `${sceneDesc}${summary}${behaviorDesc || subjectDesc}`;
  }

  destroy() {
    if (
      this.domContainer &&
      this.panelElement &&
      this.domContainer.contains(this.panelElement)
    ) {
      this.vueInstance.$destroy();
      this.domContainer.removeChild(this.panelElement);
    }
  }
}
