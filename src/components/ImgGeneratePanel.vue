<template>
  <div class="img-generate-panel">
    <el-divider content-position="left">API-key</el-divider>
    <el-alert
      title="注意：这个key的用量已经过半了，随时可能没办法调用。如果想要生成图片，推荐各位看官用自己的key嗷  2024.11.15"
      type="warning"
    >
    </el-alert>
    <el-input
      v-model="apiKey"
      placeholder="请输入API-key"
      @focus="onGeneratePanelFocus"
      @blur="onGeneratePanelBlur"
    />
    <el-divider content-position="left">描述</el-divider>
    <div class="img-generate-panel-desc">{{ desc }}</div>
    <el-divider content-position="left">配置</el-divider>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-select size="small" v-model="imgStyle" placeholder="请选择图片风格">
          <el-option
            v-for="item in imgStyleOptionConfig"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-select
          size="small"
          v-model="composition"
          placeholder="请选择图片尺寸"
        >
          <el-option
            v-for="item in imgSizeOptionConfig"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button
          type="primary"
          icon="el-icon-video-play"
          round
          :disabled="generateDisabled"
          @click="$_generateImg"
        >
          生成
        </el-button>
      </el-col>
    </el-row>
    <el-divider content-position="left">图片生成</el-divider>
    <el-row :gutter="10">
      <el-col :span="24" v-loading="imgLoading">
        <el-image
          :key="index"
          v-for="(imgUrl, index) in imgList"
          class="img-generate-img"
          :src="imgUrl"
          :preview-src-list="imgList"
          @click="downloadImg(imgUrl)"
        >
          <div slot="error" class="image-slot">
            <i class="image-slot-icon el-icon-picture-outline"></i>
          </div>
        </el-image>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import axios from "axios";
import { isEmpty } from "lodash-es";
import { imgStyleOptionConfig, imgSizeOptionConfig } from "./config";

export default {
  name: "ImgGeneratePanel",
  props: {
    lf: LogicFlow,
    desc: {
      type: String,
      default: "暂无描述",
    },
  },
  data() {
    return {
      imgStyleOptionConfig,
      imgSizeOptionConfig,
      imgStyle: "",
      composition: "",
      taskId: "",
      taskStauts: "",
      imgList: ["", "", "", ""],
      intervalId: "",
      imgLoading: false,
      apiKey: "sk-ede6d92ca2024eaa8880b7c7b8541725",
    };
  },
  mounted() {
    this.$_getGenerateStatus();
  },
  computed: {
    generateDisabled() {
      return ["PENDING", "RUNNING"].includes(this.$data.taskStauts);
    },
  },
  methods: {
    onGeneratePanelFocus(e) {
      console.log("focus", e);
      this.$props.lf.graphModel.eventCenter.emit("img-generator-focus");
    },
    onGeneratePanelBlur() {
      console.log("blur");
      this.$props.lf.graphModel.eventCenter.emit("img-generator-blur");
    },
    async $_generateImg() {
      this.$props.lf.graphModel.eventCenter.emit("generate-start");
      const { desc } = this.$props;
      // "上午的花园里, 有1个幼年猫、1个幼年狗 和 1个青年女性, 其中1个幼年猫 和 1个幼年狗在玩耍,1个青年女性在看书";
      const { imgStyle, composition } = this.$data;
      this.$data.imgLoading = true;
      console.log("process.env.NODE_ENV", process.env.NODE_ENV);
      const {
        data: { code, message, output },
      } = await axios.post(
        process.env.NODE_ENV === "production"
          ? "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis"
          : "/ali/api/v1/services/aigc/text2image/image-synthesis",
        {
          model: "wanx-v1",
          input: {
            prompt: desc,
          },
          parameters: {
            style: imgStyle || "<auto>",
            size: composition || "1024*1024",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.$data.apiKey}`,
            "X-DashScope-Async": "enable",
          },
        }
      );
      if (code) {
        this.$message.error(message);
        this.$data.imgLoading = false;
        return;
      }
      const { task_id, task_status } = output;
      this.$data.taskId = task_id;
      this.$data.taskStauts = task_status;
      this.intervalId = setInterval(() => {
        if (
          this.$data.taskId &&
          ["PENDING", "RUNNING"].includes(this.$data.taskStauts)
        ) {
          this.$_getGenerateStatus();
        }
        if (
          this.$data.taskId &&
          ["SUCCEEDED", "FAILED", "UNKNOWN"].includes(this.$data.taskStauts)
        ) {
          this.$data.imgLoading = false;
          clearInterval(this.intervalId);
        }
      }, 5000);
    },
    async $_getGenerateStatus() {
      if (!this.$data.taskId) return;
      const {
        data: { code, message, output },
      } = await axios.get(
        process.env.NODE_ENV === "production"
          ? `https://dashscope.aliyuncs.com/api/v1/tasks/${this.$data.taskId}`
          : `/ali/api/v1/tasks/${this.$data.taskId}`,
        {
          headers: {
            Authorization: `Bearer ${this.$data.apiKey}`,
          },
        }
      );
      if (code) {
        this.$message.error(message);

        return;
      }
      if (!isEmpty(output.results)) {
        this.$data.imgList = output.results.map((item) => item.url);
      }
      this.$data.taskStauts = output.task_status;
    },
    downloadImg(url) {
      if (!url) return;
      const a = document.createElement("a"); // 创建 <a> 标签
      a.href = url; // 设置图片链接
      a.download = `${url}.jpg`; // 设置下载的文件名（可修改格式）
      document.body.appendChild(a); // 将 <a> 标签添加到 DOM
      a.click(); // 触发下载
      document.body.removeChild(a); // 下载后移除 <a> 标签
    },
  },
  beforeDestroy() {
    clearInterval(this.intervalId); // 组件销毁前清除定时器
  },
};
</script>

<style scoped>
.img-generate-panel {
  padding: 10px;
}
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
