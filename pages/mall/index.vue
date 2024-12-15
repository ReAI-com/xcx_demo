<template>
  <view class="mall-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <uni-search-bar placeholder="搜索商品" @confirm="onSearch" />
    </view>

    <!-- 分类导航 -->
    <view class="category-nav">
      <scroll-view scroll-x="true" class="category-scroll">
        <view
          v-for="category in categories"
          :key="category.id"
          class="category-item"
          @tap="selectCategory(category)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
    </view>

    <!-- 商品列表 -->
    <view class="product-grid">
      <view
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @tap="viewProduct(product)"
      >
        <image :src="product.image" mode="aspectFill" />
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-price">¥{{ product.price }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { apiGet } from '@/utils/request'

export default {
  data() {
    return {
      categories: [
        { id: 1, name: '全部' },
        { id: 2, name: '手机' },
        { id: 3, name: '电脑' },
        { id: 4, name: '服装' },
        { id: 5, name: '食品' }
      ],
      products: [
        {
          id: 1,
          name: '示例商品1',
          price: 99.99,
          image: '/static/c1.png'
        },
        {
          id: 2,
          name: '示例商品2',
          price: 199.99,
          image: '/static/c2.png'
        },
        {
          id: 3,
          name: '示例商品3',
          price: 299.99,
          image: '/static/c3.png'
        },
        {
          id: 4,
          name: '示例商品4',
          price: 399.99,
          image: '/static/c4.png'
        }
      ]
    }
  },
  methods: {
    onSearch(e) {
      console.log('搜索:', e)
    },
    selectCategory(category) {
      console.log('选择分类:', category)
    },
    viewProduct(product) {
      console.log('查看商品:', product)
    }
  }
}
</script>

<style lang="scss">
.mall-container {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.category-nav {
  margin: 20rpx 0;

  .category-scroll {
    white-space: nowrap;
  }

  .category-item {
    display: inline-block;
    padding: 10rpx 30rpx;
    margin: 0 10rpx;
    background: #fff;
    border-radius: 30rpx;
    font-size: 28rpx;

    &.active {
      background: #5677fc;
      color: #fff;
    }
  }
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .product-card {
    width: 48%;
    margin-bottom: 20rpx;
    background: #fff;
    border-radius: 12rpx;
    overflow: hidden;

    image {
      width: 100%;
      height: 200rpx;
    }

    .product-info {
      padding: 16rpx;

      .product-name {
        font-size: 28rpx;
        color: #333;
      }

      .product-price {
        font-size: 32rpx;
        color: #ff6b81;
        font-weight: bold;
      }
    }
  }
}
</style>
