# 组合API
## setup()
### 访问 Props#
<code>setup</code> 函数的第一个参数是组件的 <code>props</code>。和标准的组件一致，一个 <code>setup</code> 函数的 <code>props</code> 是响应式的，并且会在传入新的 <code>props</code> 时同步更新。
```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```
请注意如果你解构了 props 对象，解构出的变量将会丢失响应性。因此我们推荐通过 <code>props.xxx</code> 的形式来使用其中的 props。

如果你确实需要解构 props 对象，或者需要将某个 prop 传到一个外部函数中并保持响应性，那么你可以使用 <code>toRefs()</code> 和 <code>toRef()</code> 这两个工具函数：
```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // 将 `props` 转为一个其中全是 ref 的对象，然后解构
    const { title } = toRefs(props)
    // `title` 是一个追踪着 `props.title` 的 ref
    console.log(title.value)

    // 或者，将 `props` 的单个属性转为一个 ref
    const title = toRef(props, 'title')
  }
}
```
### Setup 上下文
传入 setup 函数的第二个参数是一个<code>Setup</code> 上下文对象。上下文对象暴露了其他一些在 setup 中可能会用到的值：
```js
export default {
  setup(props, context) {
    // 透传 Attributes（非响应式的对象，等价于 $attrs）
    console.log(context.attrs)

    // 插槽（非响应式的对象，等价于 $slots）
    console.log(context.slots)

    // 触发事件（函数，等价于 $emit）
    console.log(context.emit)

    // 暴露公共属性（函数）
    console.log(context.expose)
  }
}
```
#### 该上下文对象是非响应式的，可以安全地解构：
```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```
<code>attrs</code> 和 <code>slots</code> 都是有状态的对象，它们总是会随着组件自身的更新而更新。这意味着你应当避免解构它们，并始终通过 <code>attrs.x</code> 或 <code>slots.x</code> 的形式使用其中的属性。此外还需注意，和 <code>props</code> 不同，<code>attrs</code> 和 <code>slots</code> 的属性都不是响应式的。如果你想要基于 <code>attrs</code> 或 <code>slots</code> 的改变来执行副作用，那么你应该在 <code>onBeforeUpdate</code> 生命周期钩子中编写相关逻辑。










## 1-组合API-父子通讯

::: tip
目标：掌握使用props选项和emits选项完成父子组件通讯
:::
### 父传子

``` vue
<template>
  <div class="container">
    <h1>父组件</h1>
    <p>{{money}}</p>
    <hr>
    <Son :money="money" />
  </div>
</template>
<script>
import { ref } from 'vue'
import Son from './Son.vue'
export default {
  name: 'App',
  components: {
    Son
  },
  // 父组件的数据传递给子组件
  setup () {
    const money = ref(100)
    return { money }
  }
}
</script>

```
```vue
<template>
  <div class="container">
    <h1>子组件</h1>
    <p>{{money}}</p>
  </div>
</template>
<script>
import { onMounted } from 'vue'
export default {
  name: 'Son',
  // 子组件接收父组件数据使用props即可
  props: {
    money: {
      type: Number,
      default: 0
    }
  },
  setup (props) {
    // 获取父组件数据money
    console.log(props.money)
  }
}
</script>
```
### 子传父
``` vue
<template>
  <div class="container">
    <h1>父组件</h1>
    <p>{{money}}</p>
    <hr>
+    <Son :money="money" @change-money="updateMoney" />
  </div>
</template>
<script>
import { ref } from 'vue'
import Son from './Son.vue'
export default {
  name: 'App',
  components: {
    Son
  },
  // 父组件的数据传递给子组件
  setup () {
    const money = ref(100)
+    const updateMoney = (newMoney) => {
+      money.value = newMoney
+    }
+    return { money , updateMoney}
  }
}
</script>
```
```vue
<template>
  <div class="container">
    <h1>子组件</h1>
    <p>{{money}}</p>
+    <button @click="changeMoney">花50元</button>
  </div>
</template>
<script>
import { onMounted } from 'vue'
export default {
  name: 'Son',
  // 子组件接收父组件数据使用props即可
  props: {
    money: {
      type: Number,
      default: 0
    }
  },
  // props 父组件数据
  // emit 触发自定义事件的函数
+  setup (props, {emit}) {
    // 获取父组件数据money
    console.log(props.money)
    // 向父组件传值
+    const changeMoney = () => {
      // 消费50元
      // 通知父组件，money需要变成50
+      emit('change-money', 50)
+    }
+    return {changeMoney}
  }
}
</script>
```
拓展：
 * 在vue2.x的时候 .sync除去v-model实现双向数据绑定的另一种方式
```vue
<!-- <Son :money='money' @update:money="fn"  /> -->
<Son :money.sync='money'  />
```
* 在vue3.0的时候，使用 v-model:money="money" 即可
```vue
<!-- <Son :money="money" @update:money="updateMoney" /> -->
<Son v-model:money="money" />
```
### 总结
* 父传子：在setup种使用props数据 setup(props){ // props就是父组件数据 }
* 子传父：触发自定义事件的时候emit来自 setup(props,{emit}){ // emit 就是触发事件函数 }
* 在vue3.0中 v-model 和 .sync 已经合并成 v-model 指令

## 2-组合API-依赖注入
::: tip
目标：掌握使用provide函数和inject函数完成后代组件数据通讯
:::
#### 使用场景：有一个父组件，里头有子组件，有孙组件，有很多后代组件，共享父组件数据。
#### 演示代码：
```vue
<template>
  <div class="container">
    <h1>父组件 {{money}} <button @click="money=1000">发钱</button></h1>
    <hr>
    <Son />
  </div>
</template>
<script>
import { provide, ref } from 'vue'
import Son from './Son.vue'
export default {
  name: 'App',
  components: {
    Son
  },
  setup () {
    const money = ref(100)
    const changeMoney = (saleMoney) => {
      console.log('changeMoney',saleMoney)
      money.value = money.value - saleMoney
    }
    // 将数据提供给后代组件 provide
    provide('money', money)
    // 将函数提供给后代组件 provide
    provide('changeMoney', changeMoney)

    return { money }
  }
}
</script>
<style scoped lang="less"></style>
```
```vue
<template>
  <div class="container">
    <h2>子组件 {{money}}</h2>
    <hr>
    <GrandSon />
  </div>
</template>
<script>
import { inject } from 'vue'
import GrandSon from './GrandSon.vue'
export default {
  name: 'Son',
  components: {
    GrandSon
  },
  setup () {
    // 接收祖先组件提供的数据
    const money = inject('money')
    return { money }
  }
}
</script>
<style scoped lang="less"></style>
```
```vue
<template>
  <div class="container">
    <h3>孙组件 {{money}} <button @click="fn">消费20</button></h3>
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'GrandSon',
  setup () {
    const money = inject('money')
    // 孙组件，消费50，通知父组件App.vue组件，进行修改
    // 不能自己修改数据，遵循单选数据流原则，大白话：数据谁定义谁修改
    const changeMoney = inject('changeMoney')
    const fn = () => {
      changeMoney(20)
    }
    return {money, fn}
  }
}
</script>
<style scoped lang="less"></style>
```
 ### 总结： 
 * vue3.0封装组件支持v-model的时候，父传子:modelValue 子传父 @update:modelValue

 ### 补充： 
 * vue2.0的 xxx.sync 语法糖解析 父传子 :xxx 子传父 @update:xxx 在vue3.0 使用 v-model:xxx 代替。
 
## 3-补充-v-model语法糖
::: tip
目标：掌握vue3.0的v-model语法糖原理
:::
在vue2.0中v-mode语法糖简写的代码<code></code> <Son :value="msg" @input="msg=$event" />

在vue3.0中v-model语法糖有所调整：<Son :modelValue="msg" @update:modelValue="msg=$event" />
演示代码:
```vue
<template>
  <div class="container">
    <!-- 如果你想获取原生事件事件对象 -->
    <!-- 如果绑定事函数 fn fn(e){ // e 就是事件对象 } -->
    <!-- 如果绑定的是js表达式  此时提供一个默认的变量 $event -->
    <h1 @click="$event.target.style.color='red'">父组件 {{count}}</h1>
    <hr>
    <!-- 如果你想获取自定义事件  -->
    <!-- 如果绑定事函数 fn fn(data){ // data 触发自定义事件的传参 } -->
    <!-- 如果绑定的是js表达式  此时 $event代表触发自定义事件的传参 -->
    <!-- <Son :modelValue="count" @update:modelValue="count=$event" /> -->
    <Son v-model="count" />
  </div>
</template>
<script>
import { ref } from 'vue'
import Son from './Son.vue'
export default {
  name: 'App',
  components: {
    Son
  },
  setup () {
    const count = ref(10)
    return { count }
  }
}
</script>
```
```vue
<template>
  <div class="container">
    <h2>子组件 {{modelValue}} <button @click="fn">改变数据</button></h2>
  </div>
</template>
<script>
export default {
  name: 'Son',
  props: {
    modelValue: {
      type: Number,
      default: 0
    }
  },
  setup (props, {emit}) {
    const fn = () => {
      // 改变数据
      emit('update:modelValue', 100)
    }
    return { fn }
  }
}
</script>
```
### 总结： 
* 　vue3.0封装组件支持v-model的时候，父传子:modelValue 子传父 @update:modelValue

### 补充： 
* vue2.0的 xxx.sync 语法糖解析 父传子 :xxx 子传父 @update:xxx 在vue3.0 使用 v-model:xxx 代替。
## 4-补充-mixins语法
::: tip
目标：掌握mixins语法的基本使用，vue2.x封装逻辑的方式，vue3.0建议使用组合API
:::
官方话术：

* 混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

理解局部混入：通过mixins选项进行混入
```js
// 配置对象
export const followMixin =  {
  data () {
    return {
      loading: false
    }
  },
  methods: {
    followFn () {
      this.loading = true
      // 模拟请求
      setTimeout(()=>{
        // 省略请求代码
        this.loading = false
      },2000)
    }
  }
}
```
```vue
<template>
  <div class="container1">
    <h1> 作者：周杰伦  <a href="javascript:;" @click="followFn">{{loading?'请求中...':'关注'}}</a> </h1>
    <hr>
    <Son />
  </div>
</template>
<script>
import Son from './Son.vue'
import {followMixin} from './mixins'
export default {
  name: 'App',
  components: {
    Son
  },
  mixins: [followMixin]
}
</script>

```
```vue
<template>
  <div class="container2">
    <h2> 作者：周杰伦  <button @click="followFn">{{loading?'loading...':'关注'}}</button> </h2>
  </div>
</template>
<script>
import {followMixin} from './mixins'
export default {
  name: 'Son',
  mixins: [followMixin]
}
</script>
<style scoped lang="less"></style>
```
### 总结： 
在vue2.0中一些可复用的逻辑可以使用mixins来封装，当是需要考虑逻辑代码冲突问题。vue3.0的组合API很好的解决了这个问题，就不在推荐使用mixins了。