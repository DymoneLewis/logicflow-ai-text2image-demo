import { h } from "@logicflow/core";
import { GroupNode, GroupNodeModel } from "@logicflow/extension";
import { v4 as uuidv4 } from "uuid";
import "@logicflow/extension/es/style/index.css";

const laneMinSize = {
  width: document.documentElement.clientWidth - 350,
  height: 160,
};

class HorizontalLaneModel extends GroupNodeModel {
  shouldUpdate() {
    const data = {
      ...this.props.model.properties,
      isSelected: this.props.model.isSelected,
      isHovered: this.props.properties?.isHovered || this.props.model.isHovered,
    };
    if (this.preProperties && this.preProperties === JSON.stringify(data))
      return;
    this.preProperties = JSON.stringify(data);
    return true;
  }
  createId() {
    let flowCode = localStorage.getItem("apiCrcicFlowCode");
    return `${flowCode || ""}_${uuidv4().substring(0, 7)}`;
  }
  initNodeData(data) {
    super.initNodeData(data);
    this.height = 160;
    this.width = document.documentElement.clientWidth - 350;
    this.foldedWidth = 42;
    this.resizable = false;
    // this.isRestrict = true;
    this.text.editable = true;
  }

  setAttributes() {
    const width = this?.properties?.width || this.width;
    const height = this?.properties?.height || this.height;
    this.width = width;
    this.height = height;

    this.text = {
      ...this.text,
      value: this.text.value || "泳道",
      x: this.x - this.width / 2 + 8,
      y: this.y,
    };
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.textWidth = 16;
    style.lineHeight = 1;
    // style.overflowMode = 'ellipsis';
    return style;
  }

  foldGroup(isFolded) {
    this.setProperty("isFolded", isFolded);
    this.isFolded = isFolded;
    // step 1
    if (isFolded) {
      this.x = this.x - this.width / 2 + this.foldedWidth / 2;
      this.unfoldedWidth = this.width;
      this.unfoldedHight = this.height;
      this.width = this.foldedWidth;
    } else {
      this.width = this.unfoldedWidth;
      this.x = this.x + this.width / 2 - this.foldedWidth / 2;
    }
    // step 2
    let allEdges = this.incoming.edges.concat(this.outgoing.edges);
    this.children.forEach((elementId) => {
      const nodeModel = this.graphModel.getElement(elementId);
      nodeModel.visible = !isFolded;
      allEdges = allEdges.concat(
        nodeModel.incoming.edges.concat(nodeModel.outgoing.edges)
      );
    });
    // step 3
    this.foldEdge(isFolded, allEdges);
  }
  // 感应泳道变化，调整宽高
  resize(resizeId, newNodeSize) {
    if (!this.children.size) {
      return;
    }
    let minX = null;
    let maxX = null;
    let minY = null;
    let maxY = null;
    let hasMaxX = false;
    // 找到边界
    this.children.forEach((elementId) => {
      const nodeModel = this.graphModel.getElement(elementId);
      const { x, y, width, height, type, id } = nodeModel;
      if (type !== "lane") {
        return;
      }
      if (id === resizeId) {
        minX = newNodeSize.x - newNodeSize.width / 2;
        maxX = newNodeSize.x + newNodeSize.width / 2;
        hasMaxX = true;
      }
      if (!hasMaxX && (!minX || x - width / 2 < minX)) {
        minX = x - width / 2;
      }
      if (!hasMaxX && (!maxX || x + width / 2 > maxX)) {
        maxX = x + width / 2;
      }
      if (!minY || y - height / 2 < minY) {
        minY = y - height / 2;
      }
      if (!maxY || y + height / 2 > maxY) {
        maxY = y + height / 2;
      }
    });
    if (minX && maxX && minY && maxY) {
      this.width = maxX - minX + 30;
      this.height = maxY - minY;
      this.x = minX + (maxX - minX) / 2 - 15;
      this.y = minY + (maxY - minY) / 2;
      this.setAttributes();
      this.resizeChildren({});
    }
  }

  resizeChildren({ resizeDir = "", deltaHeight = 0 }) {
    const { x, y, width } = this;
    const laneChildren = [];
    this.children.forEach((elementId) => {
      const nodeModel = this.graphModel.getElement(elementId);
      const { type } = nodeModel;
      if (type === "lane") {
        laneChildren.push(nodeModel);
      }
    });
    // 按照位置排序
    laneChildren.sort((a, b) => {
      if (a.y < b.y) {
        return -1;
      } else {
        return 1;
      }
    });
    // 把泳池resize的高度加进来
    switch (resizeDir) {
      case "below":
        // 高度加在最下面的泳道上
        // eslint-disable-next-line no-case-declarations
        const lastLane = laneChildren[laneChildren.length - 1];
        lastLane.height =
          lastLane.height + deltaHeight < laneMinSize.height
            ? laneMinSize.height
            : lastLane.height + deltaHeight;
        laneChildren[laneChildren.length - 1] = lastLane;
        break;
      case "above":
        // 高度加在最上面的泳道上
        // eslint-disable-next-line no-case-declarations
        const firstLane = laneChildren[0];
        firstLane.height =
          firstLane.height + deltaHeight < laneMinSize.height
            ? laneMinSize.height
            : firstLane.height + deltaHeight;
        laneChildren[0] = firstLane;
        break;
      default:
        break;
    }
    const poolHeight = laneChildren.reduce((a, b) => {
      return a + b.height;
    }, 0);
    let aboveNodeHeights = 0;
    laneChildren.forEach((nodeModel) => {
      const { height } = nodeModel;
      nodeModel.changeAttribute({
        width: width - 30,
        height,
        x: x + 15,
        y: y - poolHeight / 2 + aboveNodeHeights + height / 2,
      });
      aboveNodeHeights += height;
    });
    this.height = poolHeight;
  }

  addChild(childId) {
    console.log(childId);
    const model = this.graphModel.getElement(childId);
    model.setProperties({
      parent: this.id,
    });
    super.addChild(childId);
    this.graphModel.group.nodeGroupMap?.set(childId, this.id);
  }

  /**
   * 删除分组子节点
   * @param childId 节点id
   */
  removeChild(childId) {
    const model = this.graphModel.getElement(childId);
    if (model) {
      this.children.delete(childId);
      model.setProperties({
        parent: null,
      });
    }
  }

  addChildAbove({ x, y, width, height }) {
    this.children.forEach((elementId) => {
      const nodeModel = this.graphModel.getElement(elementId);
      const { type, y: childY } = nodeModel;
      if (type !== "lane") {
        return;
      }
      // 在被操作的泳道之上
      if (childY < y) {
        nodeModel.changeAttribute({ y: childY - 120 });
      }
    });
    const { id: laneId } = this.graphModel.addNode({
      type: "lane",
      properties: {
        nodeSize: {
          width: width,
          height: 50,
        },
      },
      x,
      y: y - height / 2 - 60,
    });
    this.addChild(laneId);
    this.height = this.height + 120;
    this.y = this.y - 60;
  }

  addChildBelow({ x, y, width, height }) {
    this.children.forEach((elementId) => {
      const nodeModel = this.graphModel.getElement(elementId);
      const { type, y: childY } = nodeModel;
      if (type !== "lane") {
        return;
      }
      // 在被操作的泳道之下
      if (childY > y) {
        nodeModel.changeAttribute({ y: childY + 120 });
      }
    });
    const { id: laneId } = this.graphModel.addNode({
      type: "lane",
      properties: {
        nodeSize: {
          width: width,
          height: 120,
        },
      },
      x,
      y: y + height / 2 + 60,
    });
    this.addChild(laneId);
    this.height = this.height + 120;
    console.log(this.height);
    this.y = this.y + 60;
  }

  deleteChild(childId) {
    console.log(childId);
    const laneChildren = [];
    this.children.forEach((elementId) => {
      const nodeModel = this.graphModel.getElement(elementId);
      const { type } = nodeModel;
      if (type === "lane") {
        laneChildren.push(nodeModel);
      }
    });
    if (laneChildren.length <= 1) {
      return;
    }
    this.removeChild(childId);
    this.graphModel.deleteNode(childId);
    this.resize();
  }

  getConnectedSourceRules() {
    const rules = super.getConnectedSourceRules();
    const notAsTarget = {
      message: "组与节点不可以进行链接",
      validate: () => {
        return false;
      },
    };
    rules.push(notAsTarget);
    return rules;
  }
  getConnectedTargetRules() {
    const rules = super.getConnectedTargetRules();
    const notAsTarget = {
      message: "组与节点不可以进行链接",
      validate: () => {
        return false;
      },
    };
    rules.push(notAsTarget);
    return rules;
  }
}

class HorizontalLaneView extends GroupNode {
  getResizeShape() {
    const { model } = this.props;
    const { x, y, width, height } = model;
    const style = model.getNodeStyle();
    // 标题区域
    const foldRectAttrs = {
      ...style,
      x: x - width / 2,
      y: y - height / 2,
      width: 30,
      rx: 4,
      ry: 4,
      height,
    };
    // 泳道区域
    const transRectAttrs = {
      ...style,
      x: x - width / 2 + 30,
      y: y - height / 2,
      width: width - 30,
      rx: 4,
      ry: 4,
      height,
      // fill: '#f7f9ff'
      fill: "transparent",
    };
    return h("g", {}, [
      // this.getAddAbleShape(),
      h("rect", { ...foldRectAttrs }),
      h("rect", { ...transRectAttrs }),
      this.getFoldIcon(),
      this.getAddableShape(),
      // this.getOperateIcon(),
    ]);
  }
  getOperateIcon() {
    const { model } = this.props;
    const { isSelected, isHovered } = model;
    if (isHovered && !isSelected) {
      return [this.deleteIcon()];
    } else {
      if (!isSelected) {
        return null;
      }
      return [this.deleteIcon()];
    }
  }

  // 自定义删除图标
  deleteIcon() {
    const { x, y, width, height, id } = this.props.model;
    if (!window.vvm.$store.state.poolFlowReadonly) {
      return h(
        "g",
        {
          cursor: "pointer",
          onClick: () => {
            let pl = window.vvm.$store.state.poolCodeList;
            let newPl = pl.filter(
              (fil) => fil !== this.props.model?.properties?.flowPoolCode
            );
            window.vvm.$store.commit("setPoolCodeList", newPl);
            this.props.graphModel.deleteNode(id);
          },
        },
        [
          h("rect", {
            height: 20,
            width: 20,
            rx: 2,
            ry: 2,
            strokeWidth: 1,
            fill: "transparent",
            stroke: "transparent",
            x: x - width / 2 - 20,
            y: y - height / 2,
          }),
          h(
            "svg",
            {
              transform: "translate(1.000000, 1.000000)",
              fill: "#CC382F",
              x: x - width / 2 - 20,
              y: y - height / 2,
              width: 16,
              height: 16,
            },
            [
              h("path", {
                "pointer-events": "none",
                fill: "#CC382F",
                d: "M4.66732 2.66665V1.33331H11.334V2.66665H14.6673V3.99998H13.334V14C13.334 14.1768 13.2637 14.3464 13.1387 14.4714C13.0137 14.5964 12.8441 14.6666 12.6673 14.6666H3.33398C3.15717 14.6666 2.9876 14.5964 2.86258 14.4714C2.73756 14.3464 2.66732 14.1768 2.66732 14V3.99998H1.33398V2.66665H4.66732ZM4.00065 3.99998V13.3333H12.0007V3.99998H4.00065ZM6.00065 5.99998H7.33398V11.3333H6.00065V5.99998ZM8.66732 5.99998H10.0007V11.3333H8.66732V5.99998Z",
              }),
            ]
          ),
        ]
      );
    } else {
      return h("g", {});
    }
  }
}

export default {
  type: "base-pool",
  view: HorizontalLaneView,
  model: HorizontalLaneModel,
};
