export default {
  namespaced: true,

  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  mutations: {
	  //find 会查找cart数组这里面的每一项元素为x 查找商品的id和cart里的每一项是否有相同
	   //的id 如果有就商品的数量加1 没有就将这件商品push到购物车里
    addToCart(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++
      }
       //将数据存储在storage
      this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
		//传进来的商品的id和当前的id是否相等
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (findResult) {
		  //让当前传进来的商品的状态等于购物车的商品的状态
        findResult.goods_state = goods.goods_state

        this.commit('m_cart/saveToStorage')
      }
    },
    // 更新商品的数量
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (findResult) {
		  //将数据保存在vuex再本地存储 数据持久化
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据 Id 删除对应的商品
    removeGoodsById(state, goods_id) {
		//过滤 传过来的id 不等于当前的id  将不等于的 放进cart数组 就将等于的删除
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage')
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(x => x.goods_state = newState)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  },
  // getters相当于vuex的计算属性
  getters: {
    total(state) {
      let c = 0
	  //将购物车里的商品数量 累加到c上面
      state.cart.forEach(x => c += x.goods_count)
      return c
    },
	// 勾选的商品的总数量
	checkedCount(state) {
	  // 先使用 filter 方法，从购物车中过滤器已勾选的商品
	  // 再使用 reduce 方法，将已勾选的商品总数量进行累加
	  // reduce() 的返回值就是已勾选的商品的总数量
	  return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
	},
	// 已勾选的商品的总价
	checkedGoodsAmount(state) {
	  // 先使用 filter 方法，从购物车中过滤器已勾选的商品
	  // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
	  // reduce() 的返回值就是已勾选的商品的总价
	  // 最后调用 toFixed(2) 方法，保留两位小数
	  return state.cart.filter(x => x.goods_state)
	                   .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
	                   .toFixed(2)
	}
  }
}
