import BasePool from "./BasePool";

export default function registerLog(lf) {
  lf.register("POOL", () => {
    class PoolNode extends BasePool.view {}
    class PoolModel extends BasePool.model {
      // 自定义节点形状属性
      initNodeData(data) {
        let allFlowData = lf.getGraphData();
        let t = allFlowData.nodes?.filter((fl) => fl.type === "POOL");
        data.text = {
          value:
            (data.text && data.text.value) ||
            data?.properties?.textFixed ||
            data?.properties?.innerText ||
            `泳道${t?.length + 1}`,
          x: data.x,
          y: data.y,
        };
        super.initNodeData(data);
        this.radius = 8;
      }
    }
    return {
      view: PoolNode,
      model: PoolModel,
    };
  });
}
