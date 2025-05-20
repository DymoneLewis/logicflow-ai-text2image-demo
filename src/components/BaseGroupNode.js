/* eslint-disable no-shadow */
import { h } from "@logicflow/core";
import { GroupNode, GroupNodeModel } from "@logicflow/extension";
import { v4 as uuidv4 } from "uuid";
import "@logicflow/extension/es/style/index.css";
class BaseGroupNodeView extends GroupNode {
  getResizeShape() {
    const { model } = this.props;
    const { x, y, width, height } = model;
    const style = model.getNodeStyle();
    const foldRectAttrs = {
      ...style,
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
    };
    return h("g", {}, [h("rect", { ...foldRectAttrs })]);
  }
}

class BaseGroupNodeModel extends GroupNodeModel {
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
    return `${flowCode}_${uuidv4().substring(0, 7)}`;
  }
  initNodeData(data = {}) {
    data.text = {
      value: data?.text?.value || data?.properties?.innerText,
      x: data.x,
      y: data.y,
      dragable: false,
      editable: false,
    };
    super.initNodeData(data);
    this.foldable = true;
    this.isFolded = false;
    this.isShowAnchor = false;
    this.resizable = false;
    this.draggable = true;
    this.isRestrict = true;
    // this.visible = false;
    this.text.editable = false;
  }

  setAttributes() {
    // 根据 properties中的配置重设 宽高
    this.resetWidthHeight();
  }

  // 自定义节点文本样式属性
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = "transparent";
    style.fontSize = "14px";
    return style;
  }
  // 自定义根据properties.iniProp
  resetWidthHeight() {
    const width =
      this?.properties?.width ||
      document.documentElement.clientWidth - 350 + 10;
    const height = this?.properties?.height || 175;
    width && (this.width = width);
    height && (this.height = height);
    const X = this?.properties?.X;
    const Y = this?.properties?.Y;
    const FIRSTH = this?.properties?.firstH;
    const targetX = X || this.x;
    const targetY = Y ? Y + height / 2 - FIRSTH / 2 - 10 : this.y;
    this.moveTo(targetX, targetY);
  }
  getNodeStyle() {
    const style = super.getNodeStyle();
    // style.stroke = 'rgb(23, 72, 150)';
    style.stroke = "red";
    style.strokeWidth = 0.5;
    style.fill = "transparent";
    style.strokeDasharray = "1 5";
    if (this.isSelected) {
      style.stroke = "rgb(23, 72, 150)";
    }
    if (this.isFolded) {
      style.fill = "#dddd";
    }
    return style;
  }

  getAddableOutlineStyle() {
    const style = super.getAddableOutlineStyle();
    style.stroke = "transparent";
    style.strokeDasharray = "5 5";
    style.strokeWidth = 2;
    return style;
  }

  addChild(id) {
    const model = this.graphModel.getElement(id);
    model.setProperties({
      parent: this.id,
    });
    super.addChild(id);
  }

  removeChild(id) {
    console.log(id);
    const model = this.graphModel.getElement(id);
    if (model) {
      model.setProperties({
        parent: null,
      });
      this.children.delete(id);
    }
    this.graphModel.eventCenter.emit("group:remove-node", {
      data: this.getData(),
    });
  }

  // 隐藏锚点而不是设置锚点数为0
  // 因为分组内部节点与外部节点相连时，
  // 如果折叠分组，需要分组代替内部节点与外部节点相连。
  getAnchorStyle() {
    const style = super.getAnchorStyle({});
    style.r = 4;
    style.hover.r = 6;
    style.fill = "transparent";
    style.stroke = "transparent";
    style.hover.fill = "transparent";
    style.hover.stroke = "transparent";
    return style;
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "transparent";
    // !style.hover && (style.hover = {});
    style.hover.stroke = "transparent";
    return style;
  }
  /**
   * 提供方法给插件在判断此节点被拖动边界事件节点靠近时调用，从而触发高亮
   */
  setTouching(flag) {
    this.setProperty("isBoundaryEventTouchingTask", flag);
  }
  /**
   * 附加后记录被附加的边界事件节点Id
   */
  addBoundaryEvent(nodeId) {
    this.setTouching(false);
    if (this.boundaryEvents.find((item) => item === nodeId)) {
      return false;
    }
    const boundaryEvent = this.graphModel.getNodeModelById(nodeId);
    boundaryEvent?.setProperties({
      attachedToRef: this.id,
    });
    this.boundaryEvents.push(nodeId);
    return true;
  }
  /**
   * 被附加的边界事件节点被删除时，移除记录
   */
  deleteBoundaryEvent(nodeId) {
    this.boundaryEvents = this.boundaryEvents.filter((item) => item !== nodeId);
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

export default {
  type: "baseGroupNode",
  view: BaseGroupNodeView,
  model: BaseGroupNodeModel,
};
