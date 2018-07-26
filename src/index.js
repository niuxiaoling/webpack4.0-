
// import './css/style.css';
// import './css/style.less';
import vueJquery from 'vue-jquery'
 
Vue.use(vueJquery)
//热更新需要 配置webpack插件和开启热更新,热更新不是刷新，会在页面不刷新的情况下直接修改掉
console.log("这是webpack打包的入口文件");

//需要在主要的文件写入启动热更新
if(module.hot){
  module.hot.accept();
}