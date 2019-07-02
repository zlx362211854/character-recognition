
<template>
  <div id="app">
    <div class="uploadContainer">
      <Row>
        <Select v-model="language" style="width:120px;">
          <Option v-for="item in lanList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Row>
      <br />
      <Row>
        <Button
          icon="md-bulb"
          type="primary"
          shape="circle"
          style="width: 150px;position: relative;"
        >
          <input
            type="file"
            @change="change"
            style="opacity: 0;position: absolute; width: 150px; left: 0"
          />
          <span>{{file.name || '选择本地文件'}}</span>
        </Button>
      </Row>
      <br />
      <Row>
        <Button
          icon="md-bulb"
          type="success"
          shape="circle"
          style="width: 150px;position: relative;"
          @click="start"
        >开始识别</Button>
      </Row>
    </div>
    <div class="loadingContainer">
      <i-circle :percent="percent" :stroke-color="color" v-if="showCricle">
        <Icon v-if="percent == 100" type="ios-checkmark" size="60" style="color:#5cb85c"></Icon>
        <span v-else style="font-size:12px">{{statusText || '识别进度'}}</span>
      </i-circle>
      <p v-if="showlogs">{{logs + ':' + percent + '%'}}</p>
    </div>
    <p style="font-size: 16px; text-align: left;">{{text}}</p>
    <p style="width: 100%; text-align: center; position: fixed; bottom: 20px; font-weight: 600;">created by zlx</p>
  </div>
</template>

<script>
import Tesseract from "tesseract.js";
import { Upload, Button, Circle } from "iview";
export default {
  name: "app",
  data() {
    return {
      file: {},
      lanList: [
        {
          label: "中文",
          value: "chi_sim"
        },
        {
          label: "英语",
          value: "eng"
        }
      ],
      language: "chi_sim",
      text: "",
      percent: 0,
      color: "#2db7f5",
      statusText: "",
      showCricle: false,
      showlogs: false,
      logs: ""
    };
  },
  methods: {
    change(e) {
      this.file = e.target.files[0];
      this.showCricle = false;
      this.showlogs = false;
      this.text = "";
    },
    start() {
      this.recognize(this.file);
    },
    recognize(img) {
      const { language } = this;
      if (img) {
        Tesseract.recognize(img, language)
          .progress(message => {
            console.log("progress is: ", message);
            const { progress, status } = message;
            if (status == "recognizing text") {
              if (!this.showCricle) {
                this.showCricle = true;
              }
              if (progress == 1) {
                this.color = "#59bb73";
              }
              this.percent = (progress * 100).toFixed(2);
              this.statusText = "识别中...";
            } else {
              this.showlogs = true;
              this.logs = status;
              this.percent = (progress * 100).toFixed(2);
            }
          })
          .then(result => {
            const { text = "" } = result;
            this.text = text;
          });
      }
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
}
#app {
  padding-top: 40px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100%;
}
.uploadContainer {
  width: 30%;
  margin: 20px auto;
  text-align: center;
}
.loadingContainer {
  width: 30%;
  height: 160px;
  margin: 0 auto;
  text-align: center;
}
</style>
