const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:
    process.env.NODE_ENV === "production" ? "/logicflow-vue2-demo/" : "/",
  devServer: {
    proxy: {
      "/ali": {
        // 匹配所有以 /api 开头的请求路径
        target: "https://dashscope.aliyuncs.com", // 代理目标服务器
        changeOrigin: true, // 是否更改请求的源头
        pathRewrite: { "^/ali": "" }, // 重写路径，将 /api 去掉
        secure: false, // 如果是 https 接口，需要配置此参数
      },
    },
  },
});
