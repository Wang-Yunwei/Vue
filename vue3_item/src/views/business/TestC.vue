<template>
    <div ref="mapContainer" style="width: 100%; height: calc(100vh - 300px)"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElLoading } from 'element-plus'

const mapContainer = ref(null);

onMounted(() => {
    initMap();
})

function initMap() {
    // 显示加载状态
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    // 初始化定位服务  
    const geolocation = new BMapGL.Geolocation();
    geolocation.getCurrentPosition(res => {
        const location = res.point; // 定位到的位置  
        // 坐标转化
        var convertor = new BMapGL.Convertor();
        convertor.translate([location], 1, 5, data => {
            const point = data.points[0] // 转换后的坐标
            loading.close() // 关闭加载状态
            const map = new BMapGL.Map(mapContainer.value) // 创建地图实例
            // const point = new BMapGL.Point(120.788108, 31.342317); // 设置地图中心点坐标{lng: 120.788108, lat: 31.342317}
            map.centerAndZoom(point, 19); // 初始化地图,设置中心点坐标和地图级别  
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            // map.setHeading(64.5);   //设置地图旋转角度
            map.setTilt(80);       //设置地图的倾斜角度
            map.addOverlay(new BMapGL.Marker(point)); // 在定位到的位置添加标注
            // map.panTo(new BMapGL.Marker(location)); // 将地图中心移动到定位到的位置 
        })
    }, {
        enableHighAccuracy: true, // 是否启用高精度定位，默认:true  
        timeout: 10000, // 超过10秒后停止定位，默认：5s  
        buttonPosition: 'RB' // 定位按钮的停靠位置  
    })
}

</script>

<style lang="scss" scoped></style>