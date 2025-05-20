import { VueNodeModel } from "@logicflow/vue-node-registry";
import { assign } from "lodash-es";

export const nodeType = [
  // 节点类型
  "sceneNode",
  "subjectNode",
  "behaviorNode",
  "baseGroupNode",
  "subFlow",
];

export const nodeTypeZhMap = {
  // 节点类型转换中文
  sceneNode: "场景",
  subjectNode: "主体",
  behaviorNode: "行为",
  baseGroupNode: "分组",
  subFlow: "子流程",
};

export const nodeTypeIcon = {
  // 不同的节点类型在拖拽面板中的icon映射
  baseGroupNode:
    "data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzMxNDk3NjAwNTA1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQyOTQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPjxwYXRoIGQ9Ik0xMjguMjk5IDEyOEM5Mi43ODggMTI4IDY0IDE1Ni43ODggNjQgMTkyLjI5OXY2MzkuNEM2NCA4NjcuMjEyIDkyLjc4OCA4OTYgMTI4LjI5OSA4OTZIODk1LjdjMzUuNTEyIDAgNjQuMy0yOC43ODggNjQuMy02NC4yOTlWMTkyLjI5OUM5NjAgMTU2Ljc4OCA5MzEuMjEyIDEyOCA4OTUuNzAxIDEyOEgxMjguMjk5ek0xMjggNTg4LjMxM2wxNzguMTYyLTE3OC4xNjJjMjQuNzk1LTI0Ljc5NSA2NC45OTYtMjQuNzk1IDg5Ljc5MiAwTDgxNy44MDMgODMySDEyOFY1ODguMzEzeiBtNzY4IDIzMS4zNzVMNjY2LjM4NSA1OTAuMDczbDY0LjcxOC02NC43MThjMjUuMTUzLTI1LjE1MiA2NS45MzMtMjUuMTUyIDkxLjA4NSAwTDg5NiA1OTkuMTY3djIyMC41MjF6TTY5NC42NSA0NzEuMjk5bC03My41MTkgNzMuNTE5TDQzMi42NTMgMzU2LjM0Yy00NS4wNjQtNDUuMDY0LTExOC4xMjctNDUuMDY0LTE2My4xOSAwTDEyOCA0OTcuODAzVjE5Mmg3Njh2MzE2LjY1N2wtMzcuMzU4LTM3LjM1OGMtNDUuMjg2LTQ1LjI4NS0xMTguNzA3LTQ1LjI4NS0xNjMuOTkyIDB6IiBwLWlkPSI0Mjk1IiBmaWxsPSIjMmMyYzJjIj48L3BhdGg+PC9zdmc+",
  sceneNode:
    "data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzMxNDk3NjAwNTA1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQyOTQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPjxwYXRoIGQ9Ik0xMjguMjk5IDEyOEM5Mi43ODggMTI4IDY0IDE1Ni43ODggNjQgMTkyLjI5OXY2MzkuNEM2NCA4NjcuMjEyIDkyLjc4OCA4OTYgMTI4LjI5OSA4OTZIODk1LjdjMzUuNTEyIDAgNjQuMy0yOC43ODggNjQuMy02NC4yOTlWMTkyLjI5OUM5NjAgMTU2Ljc4OCA5MzEuMjEyIDEyOCA4OTUuNzAxIDEyOEgxMjguMjk5ek0xMjggNTg4LjMxM2wxNzguMTYyLTE3OC4xNjJjMjQuNzk1LTI0Ljc5NSA2NC45OTYtMjQuNzk1IDg5Ljc5MiAwTDgxNy44MDMgODMySDEyOFY1ODguMzEzeiBtNzY4IDIzMS4zNzVMNjY2LjM4NSA1OTAuMDczbDY0LjcxOC02NC43MThjMjUuMTUzLTI1LjE1MiA2NS45MzMtMjUuMTUyIDkxLjA4NSAwTDg5NiA1OTkuMTY3djIyMC41MjF6TTY5NC42NSA0NzEuMjk5bC03My41MTkgNzMuNTE5TDQzMi42NTMgMzU2LjM0Yy00NS4wNjQtNDUuMDY0LTExOC4xMjctNDUuMDY0LTE2My4xOSAwTDEyOCA0OTcuODAzVjE5Mmg3Njh2MzE2LjY1N2wtMzcuMzU4LTM3LjM1OGMtNDUuMjg2LTQ1LjI4NS0xMTguNzA3LTQ1LjI4NS0xNjMuOTkyIDB6IiBwLWlkPSI0Mjk1IiBmaWxsPSIjMmMyYzJjIj48L3BhdGg+PC9zdmc+",
  subjectNode:
    "data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzMxNDk3NjEyODUzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjU0NTUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPjxwYXRoIGQ9Ik04NDguNiAxNzAuOUgxNzUuMWMtNDkuNiAwLTkwIDQwLjQtOTAgOTB2NTAxLjhjMCA0OS42IDQwLjQgOTAgOTAgOTBoNjczLjVjNDkuNiAwIDkwLTQwLjQgOTAtOTBWMjYwLjljMC00OS42LTQwLjQtOTAtOTAtOTB6IG0zMCA1OTEuOGMwIDE2LjUtMTMuNSAzMC0zMCAzMEgxNzUuMWMtMTYuNSAwLTMwLTEzLjUtMzAtMzBWMjYwLjljMC0xNi41IDEzLjUtMzAgMzAtMzBoNjczLjVjMTYuNSAwIDMwIDEzLjUgMzAgMzB2NTAxLjh6IiBmaWxsPSIjMmMyYzJjIiBwLWlkPSI1NDU2Ij48L3BhdGg+PHBhdGggZD0iTTUwMCA1NzAuMmM0Mi40LTMwLjEgNzAuMi03OS43IDcwLjItMTM1LjUgMC05MS42LTc0LjUtMTY2LjEtMTY2LjEtMTY2LjFzLTE2Ni4yIDc0LjQtMTY2LjIgMTY2YzAgNTUuOSAyNy43IDEwNS40IDcwLjIgMTM1LjUtNjAuNiAyOS41LTEwNi4zIDg2LjItMTE5LjcgMTU1LjctMi44IDE0LjYgNi43IDI4LjcgMjEuMyAzMS41IDEuNyAwLjMgMy40IDAuNSA1LjEgMC41IDEyLjYgMCAyMy45LTkgMjYuNC0yMS44IDE1LTc3LjcgODMuNS0xMzQuMiAxNjIuOC0xMzQuMiA3OS4zIDAgMTQ3LjggNTYuNCAxNjIuOCAxMzQuMiAyLjggMTQuNiAxNi45IDI0LjIgMzEuNSAyMS4zIDE0LjYtMi44IDI0LjItMTYuOSAyMS4zLTMxLjUtMTMuMy02OS40LTU5LTEyNi4xLTExOS42LTE1NS42eiBtLTk2LTIzLjNjLTYxLjkgMC0xMTIuMy01MC40LTExMi4zLTExMi4zUzM0Mi4xIDMyMi40IDQwNCAzMjIuNHMxMTIuMyA1MC40IDExMi4zIDExMi4zUzQ2NS45IDU0Ni45IDQwNCA1NDYuOXogbTQwNi42LTIzMC44SDY0MC4xYy0xMy44IDAtMjUgMTEuMi0yNSAyNXMxMS4yIDI1IDI1IDI1aDE3MC40YzEzLjggMCAyNS0xMS4yIDI1LTI1IDAuMS0xMy44LTExLjEtMjUtMjQuOS0yNXogbTAgOTkuNkg2NDAuMWMtMTMuOCAwLTI1IDExLjItMjUgMjVzMTEuMiAyNSAyNSAyNWgxNzAuNGMxMy44IDAgMjUtMTEuMiAyNS0yNXMtMTEuMS0yNS0yNC45LTI1eiBtMCAxMDYuMkg2NDAuMWMtMTMuOCAwLTI1IDExLjItMjUgMjVzMTEuMiAyNSAyNSAyNWgxNzAuNGMxMy44IDAgMjUtMTEuMiAyNS0yNXMtMTEuMS0yNS0yNC45LTI1eiIgZmlsbD0iIzJjMmMyYyIgcC1pZD0iNTQ1NyI+PC9wYXRoPjwvc3ZnPg==",
  behaviorNode:
    "data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzMxNDk3NTM1ODgxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1MTMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPjxwYXRoIGQ9Ik0yMjAuNzQ4ODI0IDU4OC40MzI3MzhjMi44NTk4MzEgMCA1LjY1OTQ1NC0wLjM5MTM0NSA4LjM5ODg3MS0xLjExMzgyOWwxMzAuNDY4NDg2LTM0Ljk1MDE0MSAyMC41MzA1NzMgNDQuMjgyMjItMTA1LjcyMzQyNCA1OC44ODI0MDhhMzQuNjc5MjEgMzQuNjc5MjEgMCAwIDAtMTQuNzIwNjAyIDQzLjgwMDU2NGw2MS4xNzAyNzMgMTQ1Ljk0MTY3NWEzMi45MDMxMDQgMzIuOTAzMTA0IDAgMCAwIDQzLjkyMDk3OCAxNy45MTE1NzFjMTYuOTE4MTU2LTcuNTI1ODcgMjQuNzE0OTU4LTI3LjY5NTIwMiAxNy4zOTk4MTItNDUuMTI1MTE4bC00OS4xNTg5ODQtMTE3LjEwMjU0IDc5LjkyNDc0MS00NC41MjMwNDggNjEuMDE5NzU2IDk0LjEwMzQ4MWMzLjgyMzE0MiA1LjkwMDI4MiA5LjM2MjE4MyAxMC40NDU5MDggMTUuNzQ0MTIgMTMuMDM0ODA3bDE4MC44OTE4MTYgNzEuNDk1NzY3YzMuOTczNjU5IDEuNTY1MzgxIDguMDM3NjI5IDIuMjg3ODY1IDExLjk1MTA4MiAyLjI4Nzg2NWEzMy40MTQ4NjQgMzMuNDE0ODY0IDAgMCAwIDMxLjE4NzIwNi0yMS45NzU1NDEgMzQuNjc5MjEgMzQuNjc5MjEgMCAwIDAtMTkuMjA2MDIxLTQ0LjQzMjczOGwtMTcwLjk4Nzc3LTY3LjU1MjIxMS03MC42ODI5NzMtMTA4Ljk3NDYtMzIuMTUwNTE4LTY5LjUwODkzNyA3My4zOTIyODYtNTguMzQwNTQ1IDEwOC4zNDI0MjggMzcuMDg3NDg4YTMzLjIwNDEzOSAzMy4yMDQxMzkgMCAwIDAgNDIuMjM1MTgzLTIxLjczNDcxM2M1Ljc3OTg2OC0xOC4wMDE4ODEtMy42NDI1MjEtMzcuNDE4NjI3LTIxLjEwMjU0LTQzLjQwOTIxOWwtMTI1LjIzMDQ4LTQyLjkyNzU2NGEzMi41NDE4NjMgMzIuNTQxODYzIDAgMCAwLTMxLjAwNjU4NSA1LjQ0ODczbC03NS44OTA4NzUgNjAuNDE3Njg2LTIxLjU1NDA5Mi00Ni41NzAwODVhMTMxLjA3MDU1NSAxMzEuMDcwNTU1IDAgMCAwIDQyLjgzNzI1My05Ni44NzMwMDFjMC03MS43OTY4MDItNTYuODM1MzcyLTEzMC4xNjc0NTEtMTI2LjYxNTI0LTEzMC4xNjc0NS02OS44MDk5NzIgMC0xMjYuNjE1MjQgNTguMzcwNjQ5LTEyNi42MTUyNCAxMzAuMTY3NDUgMCA3MS44MjY5MDUgNTYuODA1MjY4IDEzMC4xOTc1NTQgMTI2LjYxNTI0IDEzMC4xOTc1NTQgOC4yMTgyNSAwIDE2LjI4NTk4My0wLjkzMzIwOCAyNC4xNDI5OTItMi40OTg1ODlsMjAuMTA5MTI1IDQzLjQ5OTUzLTEwMy43MDY0OTEgMjcuNzU1NDA5LTkzLjMyMDc5LTYzLjEyNjk5OWMtMTUuNDczMTg5LTEwLjQ3NjAxMS0zNi4xMjQxNzctNi4wNTA4LTQ2LjI2OTA1IDkuNzgzNjMxcy01Ljg0MDA3NSAzNy4xMTc1OTIgOS41NDI4MDMgNDcuNTMzMzk3bDEwNS43NTM1MjggNzEuNTU1OTczYzUuNTM5MDQgMy43OTMwMzkgMTEuOTIwOTc4IDUuNzE5NjYxIDE4LjM2MzEyMyA1LjcxOTY2MnogbTY1LjQ0NDk2Ny0yMDguODU3OTVjLTMzLjAyMzUxOCAwLTU5Ljg0NTcyLTI3LjYwNDg5Mi01OS44NDU3Mi02MS41MDE0MTEgMC0zMy45MjY2MjMgMjYuODgyNDA4LTYxLjUzMTUxNSA1OS44NDU3Mi02MS41MzE1MTRzNTkuNzg1NTEzIDI3LjYwNDg5MiA1OS43ODU1MTMgNjEuNTMxNTE0YzAgMzMuODk2NTE5LTI2Ljc5MjA5OCA2MS41MDE0MTEtNTkuNzg1NTEzIDYxLjUwMTQxMXogbTI3NC4wNjIwODktMTA4LjcwMzY2OWgxNzguMDYyMDg4YzE4LjQyMzMzIDAgMzMuMzg0NzYtMTUuNDEyOTgyIDMzLjM4NDc2LTM0LjQwODI3OCAwLTE4LjkzNTA4OS0xNC45NjE0My0zNC4zMTc5NjgtMzMuMzg0NzYtMzQuMzE3OTY4aC0xNzguMDYyMDg4Yy0xOC4zOTMyMjcgMC0zMy4zODQ3NiAxNS4zODI4NzktMzMuMzg0NzYxIDM0LjMxNzk2OC0wLjAzMDEwMyAxOS4wMjU0IDE0Ljk2MTQzIDM0LjQwODI3OCAzMy4zODQ3NjEgMzQuNDA4Mjc4eiBtNzcuOTA3ODA4IDEzMS41ODIzMTVjMCAxOC45NjUxOTMgMTQuOTMxMzI2IDM0LjM0ODA3MSAzMy4zODQ3NiAzNC4zNDgwNzFoMTc4LjA2MjA4OGMxOC40MjMzMyAwIDMzLjM4NDc2LTE1LjM1Mjc3NSAzMy4zODQ3Ni0zNC4zNDgwNzEgMC0xOC45NjUxOTMtMTQuOTYxNDMtMzQuMzQ4MDcxLTMzLjM4NDc2LTM0LjM0ODA3Mkg2NzEuNjA4NjU1Yy0xOC40ODM1MzcgMC4wMzAxMDMtMzMuNDQ0OTY3IDE1LjQxMjk4Mi0zMy40NDQ5NjcgMzQuMzQ4MDcyeiBtODkuMDQ2MDk2IDE1NC41MjExNjZjMCAxOC45NjUxOTMgMTQuOTMxMzI2IDM0LjMxNzk2OCAzMy4zNTQ2NTYgMzQuMzE3OTY4aDE3OC4wOTIxOTJjMTguNDIzMzMgMCAzMy4zODQ3Ni0xNS4zNTI3NzUgMzMuMzg0NzYtMzQuMzE3OTY4cy0xNC45NjE0My0zNC4zNzgxNzUtMzMuMzg0NzYtMzQuMzc4MTc1aC0xNzguMDkyMTkyYy0xOC4zOTMyMjcgMC4wMzAxMDMtMzMuMzU0NjU3IDE1LjQxMjk4Mi0zMy4zNTQ2NTYgMzQuMzc4MTc1eiIgcC1pZD0iMTUxNCIgZmlsbD0iIzJjMmMyYyI+PC9wYXRoPjwvc3ZnPg==",
  subFlow:
    "data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzMxNDk3NTIxNzk3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjUzNDQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPjxwYXRoIGQ9Ik05My44NjY2NjcgMjYzLjkwMTg2N2gxODYuOTM5NzMzQzI5My41NjM3MzMgMzA4LjUzMTIgMzM0LjYyNjEzMyAzNDEuMzMzMzMzIDM4My4yOTE3MzMgMzQxLjMzMzMzM2M0OC42NzQxMzMgMCA4OS43MzY1MzMtMzIuODAyMTMzIDEwMi40OTM4NjctNzcuNDMxNDY2SDkzMC4xMzMzMzNhMjEuMzMzMzMzIDIxLjMzMzMzMyAwIDEgMCAwLTQyLjY2NjY2N0g0ODkuMDI4MjY3QzQ4Mi4zOTc4NjcgMTY4Ljc0NjY2NyA0MzcuNTU1MiAxMjggMzgzLjI5MTczMyAxMjhzLTk5LjA5NzYgNDAuNzQ2NjY3LTEwNS43MjggOTMuMjM1Mkg5My44NjY2NjdhMjEuMzMzMzMzIDIxLjMzMzMzMyAwIDEgMCAwIDQyLjY2NjY2N3pNMzgzLjI5MTczMyAxNzAuNjY2NjY3YzM1LjI5Mzg2NyAwIDY0IDI4LjY5NzYgNjQgNjMuOTgyOTMzIDAgMzUuMzAyNC0yOC43MDYxMzMgNjQuMDE3MDY3LTY0IDY0LjAxNzA2N3MtNjQtMjguNzE0NjY3LTY0LTY0LjAxNzA2N2MwLTM1LjI4NTMzMyAyOC43MTQ2NjctNjMuOTgyOTMzIDY0LTYzLjk4MjkzM3pNOTMwLjEzMzMzMyA1MDIuODM1Mkg3MjMuMDM3ODY3QzcxNC41NzI4IDQ1Mi40MzczMzMgNjcwLjc1NDEzMyA0MTMuODY2NjY3IDYxNy45NjY5MzMgNDEzLjg2NjY2N3MtOTYuNjA1ODY3IDM4LjU3MDY2Ny0xMDUuMDcwOTMzIDg4Ljk2ODUzM0g5My44NjY2NjdhMjEuMzMzMzMzIDIxLjMzMzMzMyAwIDEgMCAwIDQyLjY2NjY2N2g0MjAuNTA1NmMxMS4yODk2IDQ2Ljc4ODI2NyA1My4zOTMwNjcgODEuNjk4MTMzIDEwMy41OTQ2NjYgODEuNjk4MTMzczkyLjI5NjUzMy0zNC45MDk4NjcgMTAzLjU5NDY2Ny04MS42OTgxMzNIOTMwLjEzMzMzM2EyMS4zMzMzMzMgMjEuMzMzMzMzIDAgMSAwIDAtNDIuNjY2NjY3ek02MTcuOTY2OTMzIDU4NC41MzMzMzNjLTM1LjI5Mzg2NyAwLTY0LTI4LjcxNDY2Ny02NC02NC4wMTcwNjYgMC0zNS4yODUzMzMgMjguNzA2MTMzLTYzLjk4MjkzMyA2NC02My45ODI5MzRzNjQgMjguNjk3NiA2NCA2My45ODI5MzRjMCAzNS4zMDI0LTI4LjcwNjEzMyA2NC4wMTcwNjctNjQgNjQuMDE3MDY2ek05MzAuMTMzMzMzIDc3NS45MDE4NjdINDg5LjAyODI2N0M0ODIuMzk3ODY3IDcyMy40MTMzMzMgNDM3LjU1NTIgNjgyLjY2NjY2NyAzODMuMjkxNzMzIDY4Mi42NjY2NjdzLTk5LjA5NzYgNDAuNzQ2NjY3LTEwNS43MjggOTMuMjM1Mkg5My44NjY2NjdhMjEuMzMzMzMzIDIxLjMzMzMzMyAwIDEgMCAwIDQyLjY2NjY2NmgxODYuOTM5NzMzYzEyLjc1NzMzMyA0NC42MjkzMzMgNTMuODI4MjY3IDc3LjQzMTQ2NyAxMDIuNDkzODY3IDc3LjQzMTQ2NyA0OC42NzQxMzMgMCA4OS43MzY1MzMtMzIuODAyMTMzIDEwMi40OTM4NjYtNzcuNDMxNDY3SDkzMC4xMzMzMzNhMjEuMzMzMzMzIDIxLjMzMzMzMyAwIDEgMCAwLTQyLjY2NjY2NnpNMzgzLjI5MTczMyA4NTMuMzMzMzMzYy0zNS4yOTM4NjcgMC02NC0yOC43MTQ2NjctNjQtNjQuMDE3MDY2IDAtMzUuMjg1MzMzIDI4LjcwNjEzMy02My45ODI5MzMgNjQtNjMuOTgyOTM0czY0IDI4LjY5NzYgNjQgNjMuOTgyOTM0YzAuMDA4NTMzIDM1LjMwMjQtMjguNjk3NiA2NC4wMTcwNjctNjQgNjQuMDE3MDY2eiIgZmlsbD0iIzJjMmMyYyIgcC1pZD0iNTM0NSI+PC9wYXRoPjwvc3ZnPg==",
};

export const nodeType2Model = (type) => {
  // 节点Model类型映射
  switch (type) {
    case "sceneNode":
      return SceneNodeModel;
    case "subjectNode":
      return SubjectNodeModel;
    case "behaviorNode":
      return BehaviorNodeModel;
  }
};

export const nodeTypeProperties = {
  // 节点默认样式映射
  sceneNode: {
    width: 240,
    height: 240,
    style: {
      background: "#fff",
      border: "3px solid #f57170",
    },
  },
  subjectNode: {
    width: 240,
    height: 400,
    style: {
      background: "#fff",
      border: "3px solid #15b7b9",
    },
  },
  behaviorNode: {
    width: 240,
    height: 140,
    style: {
      background: "#fff",
      border: "3px solid #ffde7d",
    },
  },
  // subFlow: {
  //   background: "#fff",
  //   border: "3px solid #a6acec",
  // },
};

export const sceneOptionConfig = {
  // 场景节点表单项下拉框取值
  time: [
    {
      label: "清晨",
    },
    {
      label: "上午",
    },
    {
      label: "中午",
    },
    {
      label: "下午",
    },
    {
      label: "傍晚",
    },
    {
      label: "深夜",
    },
  ],
  place: [
    {
      label: "房间",
    },
    {
      label: "公司",
    },
    {
      label: "公园",
    },
    {
      label: "海边",
    },
    {
      label: "山顶",
    },
    {
      label: "湖边",
    },
    {
      label: "森林",
    },
  ],
};

export const subjectOptionConfig = {
  somatotype: [
    {
      label: "高个子",
    },
    {
      label: "矮个子",
    },
    {
      label: "胖乎乎的",
    },
    {
      label: "瘦瘦的",
    },
  ],
  hair: [
    {
      label: "长发",
    },
    {
      label: "短发",
    },
    {
      label: "卷发",
    },
    {
      label: "直发",
    },
  ],
  emotion: [
    {
      label: "开心的",
    },
    {
      label: "生气的",
    },
    {
      label: "伤心的",
    },
    {
      label: "惊讶的",
    },
  ],
  type: [
    {
      label: "人物",
      options: [
        {
          label: "男孩",
        },
        {
          label: "女孩",
        },
        {
          label: "少年",
        },
        {
          label: "少女",
        },
        {
          label: "男青年",
        },
        {
          label: "女青年",
        },
        {
          label: "中年男人",
        },
        {
          label: "中年女人",
        },
        {
          label: "老爷爷",
        },
        {
          label: "老太太",
        },
      ],
    },
    {
      label: "动物",
      options: [
        {
          label: "猫",
        },
        {
          label: "老虎",
        },
        {
          label: "狗",
        },
        {
          label: "狼",
        },
        {
          label: "鹰",
        },
        {
          label: "鸽子",
        },
        {
          label: "鸭子",
        },
        {
          label: "天鹅",
        },
        {
          label: "鲤鱼",
        },
        {
          label: "金鱼",
        },
        {
          label: "金枪鱼",
        },
        {
          label: "鲨鱼",
        },
      ],
    },
    {
      label: "植物",
      options: [
        {
          label: "柳树",
        },
        {
          label: "松树",
        },
        {
          label: "橡树",
        },
        {
          label: "银杏树",
        },
        {
          label: "玫瑰",
        },
        {
          label: "向日葵",
        },
        {
          label: "牡丹",
        },
        {
          label: "茉莉",
        },
      ],
    },
  ],
};

export const behaviorOptionConfig = {
  // 行为节点表单项下拉框取值
  behavior: [
    {
      label: "吃饭",
    },
    {
      label: "睡觉",
    },
    {
      label: "工作",
    },
    {
      label: "旅行",
    },
    {
      label: "购物",
    },
    {
      label: "跑步",
    },
    {
      label: "看书",
    },
    {
      label: "唱歌",
    },
    {
      label: "画画",
    },
  ],
};
// 主体与量词的映射，如果主体是人，就返回个，如果主体是动物就返回只，如果主体是植物就反馈棵
export const subjectQuantifierMap = (type) => {
  if (
    ["动物", "猫", "老虎", "狗", "狼", "鹰", "鸽子", "鸭子", "天鹅"].includes(
      type
    )
  )
    return "只";
  if (["鲤鱼", "金鱼", "金枪鱼", "鲨鱼"].includes(type)) return "条";
  if (
    [
      "柳树",
      "松树",
      "橡树",
      "银杏树",
      "玫瑰",
      "向日葵",
      "牡丹",
      "茉莉",
    ].includes(type)
  )
    return "棵";
  return "个";
};

// export const adjectiveOptionConfig = {
//   adjective: [
//     {
//       label: "可爱的",
//     },
//     {
//       label: "优雅的",
//     },
//     {
//       label: "帅气的",
//     },
//     {
//       label: "开心地",
//     },
//     {
//       label: "生气地",
//     },
//     {
//       label: "伤心地",
//     },
//     {
//       label: "努力地",
//     },
//   ],
// };

export const imgStyleOptionConfig = [
  {
    label: "默认",
    value: "<auto>",
  },
  {
    label: "摄影",
    value: "<photography>",
  },
  {
    label: "人像写真",
    value: "<portrait>",
  },
  {
    label: "3D卡通",
    value: "<3d cartoon>",
  },
  {
    label: "动画",
    value: "<anime>",
  },
  {
    label: "油画风",
    value: "<oil painting>",
  },
  {
    label: "水彩风",
    value: "<watercolor>",
  },
  {
    label: "素描",
    value: "<sketch>",
  },
  {
    label: "中国画",
    value: "<chinese painting>",
  },
  {
    label: "扁平插画",
    value: "<flat illustration>",
  },
];

export const imgSizeOptionConfig = [
  {
    label: "1024*1024",
    value: "1024*1024",
  },
  {
    label: "720*1280",
    value: "720*1280",
  },
  {
    label: "1280*720",
    value: "1280*720",
  },
];

export class SceneNodeModel extends VueNodeModel {
  setAttributes() {
    super.setAttributes();
    const { width, height } = this.properties;
    if (width) this.width = width;
    if (height) this.height = height;
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
    ];
    return anchors;
  }
  getConnectedSourceRules() {
    const rules = super.getConnectedSourceRules();
    const subjectNodeOnlyAsTarget = {
      message: "场景节点的下一个节点只能是主体节点",
      validate: (source, target) => {
        let isValid = true;
        if (target.type !== "subjectNode") {
          isValid = false;
        }
        return isValid;
      },
    };
    const onlyCanAddTwoTarget = {
      message: "场景节点只能连接两个主体节点",
      validate: (source) => {
        let isValid = true;
        console.log(
          "source.outgoing.nodes.length",
          source,
          source.outgoing.nodes.length
        );
        if (source.outgoing.nodes.length >= 2) {
          isValid = false;
        }
        return isValid;
      },
    };
    assign(rules, [subjectNodeOnlyAsTarget, onlyCanAddTwoTarget]);
    return rules;
  }
}

export class SubjectNodeModel extends VueNodeModel {
  setAttributes() {
    super.setAttributes();
    const { width, height } = this.properties;
    if (width) this.width = width;
    if (height) this.height = height;
  }
  getDefaultAnchor() {
    const { x, y, id, width, height } = this;
    const anchors = [
      {
        x: x + width / 2,
        y: y + height / 4,
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
  getConnectedSourceRules() {
    const rules = super.getConnectedSourceRules();
    const behaviorNodeOnlyAsTarget = {
      message: "主体节点的下一个节点只能是行为节点",
      validate: (source, target) => {
        let isValid = true;
        if (target.type !== "behaviorNode") {
          isValid = false;
        }
        return isValid;
      },
    };
    const onlyCanAddOneTarget = {
      message: "一个主体节点只能连接一个行为节点",
      validate: (source) => {
        let isValid = true;
        if (source.outgoing.nodes.length >= 1) {
          isValid = false;
        }
        return isValid;
      },
    };
    assign(rules, [behaviorNodeOnlyAsTarget, onlyCanAddOneTarget]);
    return rules;
  }
}

export class BehaviorNodeModel extends VueNodeModel {
  setAttributes() {
    super.setAttributes();
    const { width, height } = this.properties;
    if (width) this.width = width;
    if (height) this.height = height;
  }
  getDefaultAnchor() {
    const { x, y, id, width } = this;
    const anchors = [
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

// export class subFlowModel extends VueNodeModel {
//   setAttributes() {
//     super.setAttributes();
//     const { width, height } = this.properties;
//     if (width) this.width = width;
//     if (height) this.height = height;
//     this.configOption = adjectiveOptionConfig;
//   }
//   getDefaultAnchor() {
//     const { x, y, id, width } = this;
//     const anchors = [
//       {
//         x: x + width / 2,
//         y: y,
//         id: `${id}_left`,
//         type: "left",
//       },
//     ];
//     return anchors;
//   }
// }

export const nodeFormConfig = {
  // 节点表单配置
  sceneNode: [
    {
      key: "time",
      label: "时间",
      type: "select",
      options: sceneOptionConfig.time,
      filterable: true,
      clearable: true,
      allowCreate: true,
    },
    {
      key: "place",
      label: "地点",
      type: "select",
      options: sceneOptionConfig.place,
      filterable: true,
      clearable: true,
      allowCreate: true,
    },
  ],
  subjectNode: [
    {
      key: "emotion",
      label: "情绪",
      type: "select",
      options: subjectOptionConfig.emotion,
      filterable: true,
      clearable: true,
      allowCreate: true,
    },
    {
      key: "somatotype",
      label: "体型",
      type: "select",
      options: subjectOptionConfig.somatotype,
      filterable: true,
      clearable: true,
      allowCreate: true,
    },
    {
      key: "hair",
      label: "发型",
      type: "select",
      options: subjectOptionConfig.hair,
      filterable: true,
      clearable: true,
      allowCreate: true,
    },
    {
      key: "type",
      label: "主体类型",
      type: "groupSelect",
      options: subjectOptionConfig.type,
      filterable: true,
      clearable: true,
      allowCreate: true,
    },
  ],
  behaviorNode: [
    {
      key: "behavior",
      label: "行为",
      type: "select",
      options: behaviorOptionConfig.behavior,
      filterable: true,
      clearable: true,
      allowCreate: true,
    },
  ],
  // subFlow: [
  //   {
  //     key: "adjective",
  //     label: "形容",
  //     type: "select",
  //   },
  // ],
};

export default null;
