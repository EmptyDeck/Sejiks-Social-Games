#!/usr/bin/env bash
# SIGNAL 빌드 — 두 가지를 만든다.
#
# 1) 99shared/signal.app.js
#    src/signal.app.jsx (JSX) 를 평범한 JS 로 미리 컴파일한다.
#    예전에는 페이지가 React 개발 빌드 + Babel standalone 을 CDN 에서 받아
#    약 3.7 MB 를 내려받고 브라우저에서 JSX 를 컴파일했다. 지금은 저장소에
#    넣어 둔 React 프로덕션 빌드만 읽고 컴파일은 아예 하지 않는다.
#
# 2) 03Signal_en/standalone.html, 03Signal_ko/standalone.html
#    CSS·React·데이터·로직을 전부 한 파일에 밀어 넣은 판. 서버 없이 파일을
#    더블클릭해서 바로 되고, 파일 하나만 보내면 그대로 남에게 줄 수 있다.
#    (웹폰트만 인터넷을 쓴다. 끊겨 있으면 기본 폰트로 떨어질 뿐 게임은 된다.)
#
# 쓰는 법:  deploy/build.sh
# 필요한 것: node + npx
set -euo pipefail
cd "$(dirname "$0")/.."

npx --yes --package @babel/core@^7 --package @babel/preset-react@^7 -- node -e '
const babel=require("@babel/core"), fs=require("fs");
const out=babel.transformFileSync("src/signal.app.jsx",{
  presets:[["@babel/preset-react",{runtime:"classic"}]],
  compact:false, comments:true,
});
fs.writeFileSync("99shared/signal.app.js", out.code + "\n");
console.log("99shared/signal.app.js  ", out.code.length, "바이트");
'
node --check 99shared/signal.app.js

node -e '
const fs=require("fs");
const css=fs.readFileSync("99shared/signal.css","utf8");
const react=fs.readFileSync("99shared/react.production.min.js","utf8");
const reactDom=fs.readFileSync("99shared/react-dom.production.min.js","utf8");
const app=fs.readFileSync("99shared/signal.app.js","utf8");

for (const dir of ["03Signal_en","03Signal_ko"]) {
  const shell=fs.readFileSync(dir+"/index.html","utf8");
  const data=fs.readFileSync(dir+"/data.js","utf8");
  // 껍데기 <head> 의 제목·설명·폰트 링크를 그대로 물려받는다.
  const head=shell.slice(shell.indexOf("<head>")+6, shell.indexOf("</head>"))
    .split("\n")
    .filter(l => !l.includes("99shared/signal.css"))
    .join("\n").trim();
  const lang=shell.match(/<html lang="([a-z]+)"/)[1];
  const banner="<!-- SIGNAL — 단일 파일 판. 서버 없이 이 파일만 열면 된다.\n"+
    "     deploy/build.sh 가 만든 결과물이니 직접 고치지 마라.\n"+
    "     고칠 곳: src/signal.app.jsx (로직) 또는 "+dir+"/data.js (문장·문항) -->";
  const html=`<!DOCTYPE html>
<html lang="${lang}">
<head>
${head}
<style>
${css}
</style>
</head>
<body>
${banner}
<div id="root"></div>
<script>${react}</script>
<script>${reactDom}</script>
<script>${data}</script>
<script>${app}</script>
</body>
</html>
`;
  fs.writeFileSync(dir+"/standalone.html", html);
  console.log(dir+"/standalone.html", (html.length/1024).toFixed(0)+" KB");
}
'
echo "빌드 완료"
