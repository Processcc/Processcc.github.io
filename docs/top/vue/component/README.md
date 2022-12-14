# 组件传参
## 父传子
```vue

```
<code>1</code>

### 父组件
```vue
<template>
  <div>
    <Son :msg="msg" />
  </div>
</template>

<script>
import { ref } from 'vue'
import Son from '@/components/Son.vue'
export default {
  components: {
    Son
  },
  setup() {
    const msg = ref('我是父组件传过来的数据')
    return { msg }
  }
}
</script>
```
### 子组件
```vue
<template>
  <div>
    这里父组件数据
    <p>{{msg}}</p>
    <span>{{str}}</span>
  </div>
</template>
<script>
import { computed } from '@vue/runtime-core'
export default {
  props: {
    msg: String
  },
  setup(props) {
    const str = computed(() => {
      return '我是加工的' + props.msg
    })
    return { str }
  }
}

</script>
```
## 子传父
因为Vue3取消了this上下文，所以需要解构出emit，书写就变成了<code> this.xxx ====》context.xxx</code>
```vue
<template>
  <div>
    子组件: <button @click="childEmit">传值给父组件</button>
  </div>
</template>
<script>
export default {
    setup(props,{emit}){ //分解context对象取出emit
        function childEmit(){
            emit('my-emit','我是子组件值')
        }
        return{
            childEmit
        }
    }
};
</script>
```
```vue
<template>
  <div>
    父组件 <child @my-emit="parentEmit"></child>
  </div>
</template>

<script>
import Child from "./Child.vue";
import { ref } from "vue";
export default {
  components: {
    Child,
  },
  setup() {
    function parentEmit(val){
        alert(val)
    }
    return{
        parentEmit
    }
  },
};
</script>
```
## provide和inject
```vue
<template>
    <child ref="HelloWorld"></child>
</template>
<script>
import Child from './Child.vue'
import {reactive,provide} from 'vue'
export default {
    components:{
        Child
    },
    setup(){
        const state = reactive({msg:'1234'})
        provide('proMsg',state)
        return{
            state
        }
    }
}
</script>
```
```vue
<template>
    <div>
        <h1>{{ofMsg.msg}}</h1>
    </div>
</template>
<script>
import {inject,ref} from 'vue'
export default {
    setup(){
        const ofMsg = inject('proMsg',ref('none'))
        return{
            ofMsg
        }
    }
}
</script>
```