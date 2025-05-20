import { HtmlNode, HtmlNodeModel } from "@logicflow/core";
import Vue from "vue"; // { createApp, h }
import Application from "./Application.vue";

class ApplicationNodeModel extends HtmlNodeModel {
  vueInstanceList = [];
  constructor(data, graphModel) {
    super(data, graphModel);
    graphModel.eventCenter.on("change-node-height", ({ id, height }) => {
      if (id === this.id) {
        this.height = height;
      }
    });
  }
  getDefaultAnchor() {
    const { x, y, id, width } = this;
    const anchors = [
      {
        x: x + width / 2,
        y: y,
        id: `${id}_right`,
        type: "right",
      },
      {
        x: x - width / 2,
        y: y,
        id: `${id}_left`,
        type: "left",
      },
    ];
    return anchors;
  }
}

class ApplicationNode extends HtmlNode {
  vueItem;
  isMounted = false;
  customComponent;
  shouldUpdate() {
    // 【model属性一变化触发视图更新】首先改这里
    return true;
  }
  setHtml(rootEl) {
    const { properties, graphModel } = this.props.model;
    const { isSilentMode } = graphModel.editConfigModel;
    console.log("isSilentMode in setHtml", isSilentMode, !this.isMounted);
    // 写法1：通过Vue.extend创建中间组件挂载实际组件
    // if (!this.isMounted) {
    //   const el = document.createElement("div");
    //   rootEl.innerHTML = "";
    //   rootEl.appendChild(el);
    //   const Profile = Vue.extend({
    //     render: (h) => {
    //       return h(Application, {
    //         props: {
    //           properties,
    //           model: this.props.model,
    //           isSilentMode,
    //         },
    //       });
    //     },
    //   });
    //   this.customComponent = new Profile();
    //   this.customComponent.$mount(el);
    //   this.isMounted = true;
    //   return;
    // }
    // // 因为使用Propfile创建的是中间组件，所以需要通过$children[0]获取实际组件
    // console.log("isSilentMode in setHtml", this.customComponent.$children[0]);
    // this.customComponent.$children[0].isSilentMode = isSilentMode;

    // 写法2：通过Vue.extend创建实际组件
    if (!this.isMounted) {
      const el = document.createElement("div");
      rootEl.innerHTML = "";
      rootEl.appendChild(el);
      const ApplicationCon = Vue.extend(Application, {
        props: {
          properties,
          model: this.props.model,
          isSilentMode,
        },
      });
      this.customComponent = new ApplicationCon();
      this.customComponent.$mount(el);
      this.isMounted = true;
      return;
    }
    console.log("isSilentMode in setHtml", this.customComponent);
    this.customComponent.isSilentMode = isSilentMode;

    // 写法3：通过h函数创建组件
    // const { graphModel, properties, id, isHovered, isSelected } =
    //   this.props.model;
    // graphModel.eventCenter.emit("on-custom-html-node-change", {
    //   id,
    //   isHovered,
    //   isSelected,
    // });
    // if (!this.isMounted) {
    //   const node = document.createElement("div");
    //   node.className = "vue-container";
    //   rootEl.appendChild(node); // 主体
    //   this.customComponent = h(Application, {
    //     properties,
    //     model: this.props.model,
    //   });
    //   this.vueItem = createApp({
    //     render: () => this.customComponent,
    //   });
    //   this.vueItem.mount(node);
    //   this.props.model.vueInstanceList.push(this.vueItem);
    //   this.isMounted = true;
    //   return;
    // }
    // this.customComponent.component!.props.properties =
    //   this.props.model.getProperties();
    // // 【model属性一变化触发视图更新】其次还需要加上这行，手动更新依赖项
    // this.customComponent.component!.props.model = this.props.model;
    // // 效果可以看右侧的node-4
  }
  componentWillUnmount() {
    this.vueItem.unmount();
    this.isMounted = false;
    this.vueItem = null;
    this.rootEl.innerHTML = "";
  }
}

export default {
  type: "applicationNode",
  model: ApplicationNodeModel,
  view: ApplicationNode,
};
