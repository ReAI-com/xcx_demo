<template>
  <view class="nav-menu" :class="{ 'nav-menu--open': isOpen }">
    <!-- Logo -->
    <view class="nav-menu__header">
      <view class="nav-menu__logo">(./?)</view>
      <view class="nav-menu__close" @tap="closeMenu">×</view>
    </view>

    <!-- Navigation Items -->
    <view class="nav-menu__items">
      <view
        v-for="item in menuItems"
        :key="item.path"
        class="nav-menu__item"
        @tap="handleNavigation(item)"
      >
        {{ item.name }}
      </view>
    </view>

    <!-- Footer -->
    <view class="nav-menu__footer">
      <text>Copyright © 2024 点一几科技. 保留所有权利</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      menuItems: [
        { name: '首页', path: '/' },
        { name: '商店', path: '/mall' },
        { name: '关于我们', path: '/about' },
        { name: '技术支持', path: '/support' }
      ]
    }
  },
  methods: {
    open() {
      this.isOpen = true
    },
    closeMenu() {
      this.isOpen = false
    },
    handleNavigation(item) {
      uni.navigateTo({
        url: item.path,
        success: () => {
          this.closeMenu()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #000;
  color: #fff;
  padding: 60rpx;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;

  &--open {
    transform: translateX(0);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 160rpx;
  }

  &__logo {
    font-size: 72rpx;
    font-weight: bold;
    font-family: system-ui, -apple-system, sans-serif;
  }

  &__close {
    font-size: 80rpx;
    padding: 20rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 80rpx;
    padding: 40rpx 0;
  }

  &__item {
    color: #fff;
    font-size: 64rpx;
    font-weight: 500;
  }

  &__footer {
    margin-top: auto;
    text-align: center;
    font-size: 24rpx;
    opacity: 0.6;
    padding: 40rpx 0;
  }
}
</style>
