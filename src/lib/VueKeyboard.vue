<template>
    <div class='key-container' :style="{'backgroundColor':numberBackgroundColor?numberBackgroundColor:'#fff'}">
        <div class='keyboard' >
          <div class="keyboard-num" @click.stop='_handleKeyPress'>
            <div class='key-row'>
                <div class='key-cell' data-num='1'>1</div>
                <div class='key-cell' data-num='2'>2</div>
                <div class='key-cell' data-num='3'>3</div>
            </div>
            <div class='key-row'>
                <div class='key-cell' data-num='4'>4</div>
                <div class='key-cell' data-num='5'>5</div>
                <div class='key-cell' data-num='6'>6</div>
            </div>
            <div class='key-row'>
                <div class='key-cell' data-num='7'>7</div>
                <div class='key-cell' data-num='8'>8</div>
                <div class='key-cell' data-num='9'>9</div>
            </div>
            <div class='key-row'>
                <div class='key-cell close-keyboard' data-num='-1'>
                  <img :src="coloseIcon?coloseIcon:keyboardClose" alt="" data-num='-1'>
                </div>
                <div class='key-cell' data-num='.'>.</div>
                <div class='key-cell' data-num='0'>0</div>
            </div>
          </div>
          <div class="keyboard-del-sure display-flex flex-direction-column" @click.stop='_handleKeyPress'>
            <div class='key-confirm delete' data-num='D'>
              <img :src="deleteIcon?deleteIcon:keyboardDelete" alt="" data-num='D'>
            </div>
            <div class='key-confirm' data-num='S' :style="{'backgroundColor':confirmBackgoundColor?confirmBackgoundColor:'#ff5100','color':confirmColo?confirmColo:'#fff'}">确认</div>
          </div>
        </div>
    </div>
</template>

<script>
import keyboardDelete from "../assets/keyboardDelete.png";
import keyboardClose from "../assets/keyboardClose.png";

export default {
  name: "VueKeyboard",
  data() {
    return {
      money: "",
      trueOrFalse: false,
      keyboardDelete:keyboardDelete,
      keyboardClose:keyboardClose,
      _delectIcon:'',
      _closeIcon:''
    };
  },
  props: ["payAmount","numberBackgroundColor","borderColor","fontColor","coloseIcon","deleteIcon","confirmBackgoundColor","confirmColo"],
  beforeMount(){
  
  },
  mounted() {
    let oCell = document.getElementsByClassName('key-cell');
    if(this.borderColor){
      Array.prototype.slice.call(oCell).map((val,index)=>{
          val.style.cssText="border-color:"+this.borderColor
      })
    }
    if(this.fontColor){
      Array.prototype.slice.call(oCell).map((val,index)=>{
          val.style.cssText="color:"+this.fontColor
      })
    }
    if(this.deleteIcon){
      this._delectIcon = this.deleteIcon
    }
    if(this.coloseIcon){
      this._coloseIcon = this.closeIcon
    }
    if (this.payAmount != 0) {
      this.money = this.payAmount + "";
    }
  },
  methods: {
    // 处理按键
    _handleKeyPress(e) {
      let num = e.target.dataset.num;
      // 不同按键处理逻辑
      // -1 代表无效按键，直接返回
      if (num === undefined) {
        return false;
      }
      switch (String(num)) {
        // 小数点
        case ".":
          this._handleDecimalPoint();
          break;
        // 删除键
        case "D":
          this._handleDeleteKey();
          break;
        // 清空键
        case "C":
          this._handleClearKey();
          break;
        // 确认键
        case "S":
          this._handleConfirmKey();
          break;
        // 小数点
        case "-1":
          this._handleConfirmKey();
          break;
        default:
          this._handleNumberKey(num);
          break;
      }
    },
    // 处理小数点函数
    _handleDecimalPoint() {
      // 如果包含小数点，直接返回
      if (this.money.indexOf(".") >= 0) {
        return;
      }
      // 如果小数点是第一位，补0
      if (!this.money.length) {
        this.money = "0.";
        this.$emit("toParent", this.money);
      } else {
        // 如果不是，添加一个小数点
        this.money = this.money + ".";
        this.$emit("toParent", this.money);
      }
    },
    // 处理删除键
    _handleDeleteKey() {
      let s = String(this.money);
      // 如果没有输入，直接返回
      if (!s.length) {
        return false;
      }
      // 否则删除最后一个
      this.money = s.substring(0, s.length - 1);
      s = this.money;
      if (s.lastIndexOf(".") === s.length - 1) {
        // 否则删除最后一个
        this.money = s.substring(0, s.length - 1);
      }
      this.$emit("toParent", this.money);
    },
    // 处理清空键
    _handleClearKey() {
      this.money = "";
      this.$emit("toParent", 0);
    },
    // 处理数字
    _handleNumberKey(num) {
      let S = String(this.money);
      // 如果有小数点且小数点位数不小于2
      if (S.indexOf(".") > -1 && S.substring(S.indexOf(".") + 1).length < 2) {
        this.money = S + String(num);
        this.$emit("toParent", this.money);
      }
      // 没有小数点
      if (!(S.indexOf(".") > -1)) {
        // 如果第一位是0，只能输入小数点
        if (num == 0 && S.length == 0) {
          this.money = "0.";
          this.$emit("toParent", this.money);
        } else {
          if (S.length && Number(S.charAt(0)) === 0) {
            return;
          }
          this.money = S + num;
          this.$emit("toParent", this.money);
        }
      }
    },
    // 提交
    _handleConfirmKey() {
      let S = String(this.money);
      // 未输入
      // if (!S.length) {
      //   alert("您目前未输入!");
      //   return false;
      // }
      // 将 8. 这种转换成 8.00
      if (S.indexOf(".") > -1 && S.indexOf(".") == S.length - 1) {
        S = Number(S.substring(0, S.length - 1)).toFixed(2);
        var childData = { money: S, trueOrFalse: this.trueOrFalse };
        this.$emit("toParent", childData);
      } else {
        // 保留两位
        S = Number(S).toFixed(2);
        var childData = { money: S, trueOrFalse: this.trueOrFalse };
        this.$emit("toParent", childData);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.key-container {
  width: 100%;
  font-size: 0.48rem;
  font-family: PingFangSC-Regular;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 6rem;
  z-index: 300;
}
.keyboard{
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: space-between;
  -webkit-justify-content: space-between;
  -moz-justify-content: space-between;
  -ms-justify-content: space-between;
  -o-justify-content: space-between;
  justify-content: space-between;
  .keyboard-num{
    flex: 1;
  }
}
.keyboard-del-sure {
  width: 2.08rem;
  text-align: center;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  -o-flex-direction: column;
  flex-direction: column;
}
.key-row {
  display: flex;
  display: -webkit-flex;
  position: relative;
  height: 1.5rem;
  line-height: 1.5rem;
  .close-keyboard {
    img {
      width: 0.4rem;
      height: auto;
    }
  }
}
.keyboard .key-cell {
  flex: 1;
  -webkit-box-flex: 1;
  text-align: center;
  position: relative;
  border-top: 1px solid #cccccc;
  border-right: 1px solid #cccccc;
}
.keyboard .key-cell:nth-last-child(1)::after {
  border-right: 0;
}
.keyboard .key-confirm {
  text-align: center;
  height: 3rem;
  width: 2.08rem;
  line-height: 3rem;
  background-color: #ff5100;
  color: #ffffff;
}
.keyboard .delete {
  background-color: #eaeaea;
  img {
    width: 0.6rem;
    height: auto;
  }
}
</style>
