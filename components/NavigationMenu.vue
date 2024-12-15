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
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s ease;

  &--open {
    transform: translateX(0);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 120rpx;
  }

  &__logo {
    font-size: 48rpx;
    font-weight: bold;
  }

  &__close {
    font-size: 64rpx;
    padding: 20rpx;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 60rpx;
  }

  &__item {
    color: #fff;
    font-size: 48rpx;
  }

  &__footer {
    margin-top: auto;
    text-align: center;
    font-size: 28rpx;
    opacity: 0.7;
  }
}
</style>
