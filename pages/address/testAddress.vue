<template>
  <p>에디터</p>
  <button @click="selectOverlay('MARKER')">마커</button>
  <button @click="selectOverlay('POLYLINE')">라인</button>
  <div id="drawingMap"></div>
</template>

<script>
import { toRefs } from 'vue'
export default {
  setup() {
    const drawingMap = toRefs(null);
    const drawingManager = toRefs(null);
    return {
      drawingMap,
      drawingManager
    }
  },
  methods: {
    initMap() {
      console.log('initMap')
      const drawingMapContainer = document.getElementById('drawingMap')
      const drawingMapOptions = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
      };
      this.drawingMap.value = new kakao.maps.Map(drawingMapContainer, drawingMapOptions);
      this.initDrawManager();
    },

    initDrawManager() {
      console.log('initDrawManager')
      if (this.drawingMap !== null) {
        let options = {
          map: this.drawingMap.value,
          drwaingMode: [
            kakao.maps.drawing.OverlayType.MARKER,
            kakao.maps.drawing.OverlayType.POLYLINE,
          ],
          guideTooltip: ['draw', 'drag', 'edit'],
          markerOptions: {
            draggable: true,
            removable: true
          },
          polylineOptions: {
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: '#39f',
            hintStrokeStyle: 'dash',
            hintStrokeOpacity: 0.5,
            strokeWeight:5,
            strokeOpacity: 0.5
          },
        }
        this.drawingManager.value = new kakao.maps.drawing.DrawingManager(options);
      }
    },

    selectOverlay(type) {
      console.log(`selectOverlay(${type})`)
      if (this.drawingManager.value !== null) {
        this.drawingManager.value.cancel();
        this.drawingManager.value.select(kakao.maps.drawing.OverlayType[type]);
      }
    },

  },
  mounted() {
    console.log('mounted')
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement("script");
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=7ab35a2ef3b2ad6d27aa8a80bfc99a3a&libraries=drawing&autoload=false";
      /*global kakao*/
      script.addEventListener('load', () => {
        kakao.maps.load(this.initMap)
      });
      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  }
}
</script>


<style scoped>

#drawingMap {
  width: 60%;
  height: 400px;
}
</style>