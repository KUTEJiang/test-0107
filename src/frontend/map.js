// 地图功能模块
class TravelMap {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.markers = [];
    this.loaded = false;
    
    // 加载地图脚本
    this.loadMapScript();
  }
  
  loadMapScript() {
    // 检查是否已加载过
    if (window.google && window.google.maps) {
      this.initMap();
      return;
    }
    
    // 创建脚本标签加载Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.getApiKey()}&callback=initMapForTravelApp`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    // 设置全局回调函数
    window.initMapForTravelApp = () => {
      this.initMap();
    };
  }
  
  getApiKey() {
    // 在实际应用中，这应该从安全的地方获取
    return localStorage.getItem('mapApiKey') || 'YOUR_GOOGLE_MAPS_API_KEY';
  }
  
  initMap() {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    
    // 初始化地图
    this.map = new google.maps.Map(container, {
      zoom: 2,
      center: { lat: 20, lng: 0 }, // 全球中心
      mapTypeId: 'roadmap'
    });
    
    this.loaded = true;
    console.log('地图初始化完成');
  }
  
  // 添加行程到地图
  addTripToMap(trip) {
    if (!this.map || !this.loaded) {
      console.warn('地图尚未加载完成');
      return;
    }
    
    // 清除现有标记
    this.clearMarkers();
    
    // 如果行程有位置信息，则在地图上标出
    if (trip.locations && trip.locations.length > 0) {
      trip.locations.forEach((location, index) => {
        if (location.lat && location.lng) {
          const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: this.map,
            title: `${trip.title} - ${location.name || `位置${index + 1}`}`
          });
          
          // 添加信息窗口
          const infowindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3>${trip.title}</h3>
                <p>${location.name || `位置${index + 1}`}</p>
                <p>行程: ${trip.description || '无描述'}</p>
              </div>
            `
          });
          
          marker.addListener('click', () => {
            infowindow.open(this.map, marker);
          });
          
          this.markers.push(marker);
        }
      });
      
      // 调整地图视图以适应所有标记
      if (this.markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        this.markers.forEach(marker => {
          bounds.extend(marker.getPosition());
        });
        this.map.fitBounds(bounds);
      }
    }
  }
  
  // 添加临时邀约到地图
  addInviteToMap(invite) {
    if (!this.map || !this.loaded) {
      console.warn('地图尚未加载完成');
      return;
    }
    
    // 清除现有标记
    this.clearMarkers();
    
    // 如果邀约有位置信息，则在地图上标出
    if (invite.location && invite.location.lat && invite.location.lng) {
      const marker = new google.maps.Marker({
        position: { lat: invite.location.lat, lng: invite.location.lng },
        map: this.map,
        title: invite.title
      });
      
      // 添加信息窗口
      const infowindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3>${invite.title}</h3>
            <p>${invite.location.name || '未知位置'}</p>
            <p>类型: ${this.getInviteTypeName(invite.inviteType)}</p>
            <p>描述: ${invite.description || '无描述'}</p>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infowindow.open(this.map, marker);
      });
      
      this.markers.push(marker);
      
      // 移动地图到标记位置
      this.map.setCenter({ lat: invite.location.lat, lng: invite.location.lng });
      this.map.setZoom(12);
    }
  }
  
  // 显示附近可能的旅行搭子
  showNearbyTravelBuddies(position, radius = 50) {
    if (!this.map || !this.loaded) {
      console.warn('地图尚未加载完成');
      return;
    }
    
    // 清除现有标记
    this.clearMarkers();
    
    // 这里应该调用后端API获取附近的活跃用户
    // 模拟数据
    const mockBuddies = [
      { id: 1, name: '张三', position: { lat: position.lat + 0.01, lng: position.lng + 0.01 }, activity: '寻找用餐伙伴' },
      { id: 2, name: '李四', position: { lat: position.lat - 0.02, lng: position.lng - 0.02 }, activity: '寻找游览伙伴' }
    ];
    
    mockBuddies.forEach(buddy => {
      const marker = new google.maps.Marker({
        position: buddy.position,
        map: this.map,
        title: `${buddy.name} - ${buddy.activity}`,
        icon: {
          url: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234361ee"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
          scaledSize: new google.maps.Size(32, 32)
        }
      });
      
      const infowindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3>${buddy.name}</h3>
            <p>${buddy.activity}</p>
            <button class="btn btn-primary" onclick="contactBuddy(${buddy.id})">联系</button>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infowindow.open(this.map, marker);
      });
      
      this.markers.push(marker);
    });
  }
  
  // 清除所有标记
  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }
  
  getInviteTypeName(type) {
    const types = {
      'dining': '用餐',
      'sightseeing': '观光',
      'activity': '活动',
      'other': '其他'
    };
    return types[type] || type;
  }
  
  // 获取当前位置
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }
}

// 导出地图类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TravelMap;
}