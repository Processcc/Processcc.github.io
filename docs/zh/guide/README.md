## 面经
### Vue2.x 生命周期
```js
1. 有哪些生命周期
系统自带：
  beforeCreate
  created
  beforeMount
  mounted
  beforeUpdate
  updated
  beforeDestroy
  destroyed
2. 一旦进入到页面或者组件，会执行哪些生命周期，顺序。
 beforeCreate
 created
 beforeMount
 mounted
3. 在哪个阶段有$el，在哪个阶段有$data
	beforeCreate 啥也没有
	created  有data没有el
	beforeMount 有data没有el
	mounted 都有
4. 如果加入了keep-alive会多俩个生命周期
	activated、deactivated
5. 如果加入了keep-alive，第一次进入组件会执行哪些生命？
 beforeCreate
 created
 beforeMount
 mounted
 activated
6. 如果加入了keep-alive，第二次或者第N次进入组件会执行哪些生命周期？
只执行一个生命周期：activated。
```