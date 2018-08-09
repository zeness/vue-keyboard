import VueKeyboard from './VueKeyboard.vue' // 导入组件

const keyboard={
  install:function (Vue) {
    Vue.component('VueKeyboard',VueKeyboard)
  }
};
// 这里的判断很重要
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(keyboard)
}
export default keyboard