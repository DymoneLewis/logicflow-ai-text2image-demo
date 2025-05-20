import { h } from "@logicflow/core";
import BaseGroup from "./BaseGroupNode";

export default function registerTryCatch(lf) {
  lf.register("VOID", () => {
    class ConditionGroupNodeView extends BaseGroup.view {
      getLogoIcon() {
        const { model } = this.props;
        const { x, y, width, height, properties } = model;
        if (properties.isFolded) return null;
        return h("foreignObject", {
          x: x - width / 2 + 10,
          y: y - height / 2,
          style: `height:28px;line-height:28px;`,
        });
      }
    }

    class ConditionGroupNodeModel extends BaseGroup.model {
      initNodeData(data) {
        data.text = {
          value: "虚",
        };
        super.initNodeData(data);
      }
    }
    return {
      view: ConditionGroupNodeView,
      model: ConditionGroupNodeModel,
    };
  });
}
