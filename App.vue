<template>
  <view>
    <navigation-menu ref="navMenu" />
    <!-- #ifdef MP-WEIXIN -->
    <view class="menu-trigger" @tap="openMenu">
      <text class="menu-icon">☰</text>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  onLaunch: function() {
    console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  methods: {
    openMenu() {
      this.$refs.navMenu.open()
    }
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import '@/uni_modules/uni-scss/index.scss';
/* #ifndef APP-NVUE */
@import '@/static/customicons.css';
// 设置整个项目的背景色
page {
  background-color: #f5f5f5;
}

/* #endif */
.example-info {
  font-size: 14px;
  color: #333;
  padding: 10px;
}

.menu-trigger {
  position: fixed;
  top: 40rpx;
  left: 40rpx;
  z-index: 999;

  .menu-icon {
    font-size: 48rpx;
    color: #000;
  }
}
</style>
