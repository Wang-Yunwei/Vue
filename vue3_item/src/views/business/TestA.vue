<template>
	<div>
		<div class="triangle">
			2D漂移
		</div>

		<div>
			<h1>这是TestA页面</h1>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const num = ref(0)
onMounted(() => {
	console.log('111', num);
})
</script>

<style lang="scss" scoped>
.triangle {
	/* div三角样式 */
	display: inline-block;
	border: solid 6rem transparent;
	border-top-color: #0097a7;
	border-bottom-color: #b2ebf2;
	border-right-color: #00bcd4;
	border-left-color: #00bcd4;
	transform: translate(50px, 50px); // transform 属性向元素应用 2D 或 3D 转换; 该属性允许我们对元素进行旋转、缩放、移动或倾斜
}
</style>