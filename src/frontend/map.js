// 地图功能模块 - 增强版
class TravelMap {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.markers = [];
    this.infoWindows = [];
    this.routes = [];
    this.loaded = false;
    this.currentUserPosition = null;
    this.nearbyBuddies = [];
    this.activeFilters = {
      maxDistance: 50, // 公里
      minMatchScore: 60, // 最低匹配度
      buddyTypes: ['dining', 'sightseeing', 'activity', 'other'] // 搭子类型
    };
    
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.getApiKey()}&callback=initMapForTravelApp&libraries=places`;
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
    
    // 初始化地图 - 使用更丰富的选项
    this.map = new google.maps.Map(container, {
      zoom: 12,
      center: { lat: 39.9042, lng: 116.4074 }, // 北京坐标作为默认
      mapTypeId: 'roadmap',
      fullscreenControl: true,
      streetViewControl: true,
      mapTypeControl: true,
      zoomControl: true,
      gestureHandling: 'auto'
    });
    
    // 添加地图事件监听器
    this.setupMapEvents();
    
    this.loaded = true;
    console.log('地图初始化完成');
  }
  
  // 设置地图事件
  setupMapEvents() {
    if (!this.map) return;
    
    // 地图空闲事件（移动或缩放后触发）
    this.map.addListener('idle', () => {
      this.handleMapIdle();
    });
  }
  
  // 处理地图空闲事件
  handleMapIdle() {
    // 当地图视图改变后，可以在这里更新附近的搭子
    if (this.currentUserPosition) {
      this.updateNearbyBuddiesInView();
    }
  }
  
  // 添加行程到地图
  addTripToMap(trip) {
    if (!this.map || !this.loaded) {
      console.warn('地图尚未加载完成');
      return;
    }
    
    // 清除现有标记和路线
    this.clearAll();
    
    // 如果行程有位置信息，则在地图上标出
    if (trip.locations && trip.locations.length > 0) {
      // 绘制路线
      if (trip.locations.length > 1) {
        this.drawTripRoute(trip.locations);
      }
      
      trip.locations.forEach((location, index) => {
        if (location.lat && location.lng) {
          const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: this.map,
            title: `${trip.title} - ${location.name || `位置${index + 1}`}`,
            icon: this.getTripMarkerIcon(index, trip.locations.length)
          });
          
          // 添加信息窗口
          const infowindow = new google.maps.InfoWindow({
            content: this.getTripInfoContent(trip, location, index)
          });
          
          marker.addListener('click', () => {
            this.closeAllInfoWindows();
            infowindow.open(this.map, marker);
          });
          
          this.markers.push(marker);
          this.infoWindows.push(infowindow);
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
  
  // 绘制行程路线
  drawTripRoute(locations) {
    if (locations.length < 2) return;
    
    const path = locations.map(loc => new google.maps.LatLng(loc.lat, loc.lng));
    
    const route = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#4361ee',
      strokeOpacity: 1.0,
      strokeWeight: 4
    });
    
    route.setMap(this.map);
    this.routes.push(route);
  }
  
  // 获取行程标记图标
  getTripMarkerIcon(index, total) {
    let iconUrl;
    if (index === 0) {
      // 开始点
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    } else if (index === total - 1) {
      // 结束点
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    } else {
      // 中间点
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }
    
    return {
      url: iconUrl,
      scaledSize: new google.maps.Size(40, 40)
    };
  }
  
  // 获取行程信息内容
  getTripInfoContent(trip, location, index) {
    return `
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">${trip.title}</h3>
        <p style="margin: 5px 0;"><strong>位置:</strong> ${location.name || `地点 ${index + 1}`}</p>
        <p style="margin: 5px 0;"><strong>时间:</strong> ${trip.startDate} 到 ${trip.endDate}</p>
        <p style="margin: 5px 0;"><strong>描述:</strong> ${trip.description}</p>
        <p style="margin: 5px 0;"><strong>状态:</strong> ${trip.status}</p>
        <div style="margin-top: 10px; text-align: center;">
          <button class="btn btn-primary" style="padding: 5px 10px; font-size: 12px;" onclick="joinTrip(${trip.id})">加入行程</button>
        </div>
      </div>
    `;
  }
  
  // 添加临时邀约到地图
  addInviteToMap(invite) {
    if (!this.map || !this.loaded) {
      console.warn('地图尚未加载完成');
      return;
    }
    
    // 清除现有标记
    this.clearAll();
    
    // 如果邀约有位置信息，则在地图上标出
    if (invite.location && invite.location.lat && invite.location.lng) {
      const marker = new google.maps.Marker({
        position: { lat: invite.location.lat, lng: invite.location.lng },
        map: this.map,
        title: invite.title,
        icon: this.getInviteMarkerIcon(invite.inviteType)
      });
      
      // 添加信息窗口
      const infowindow = new google.maps.InfoWindow({
        content: this.getInviteInfoContent(invite)
      });
      
      marker.addListener('click', () => {
        this.closeAllInfoWindows();
        infowindow.open(this.map, marker);
      });
      
      this.markers.push(marker);
      this.infoWindows.push(infowindow);
      
      // 移动地图到标记位置
      this.map.setCenter({ lat: invite.location.lat, lng: invite.location.lng });
      this.map.setZoom(14);
    }
  }
  
  // 获取邀请标记图标
  getInviteMarkerIcon(inviteType) {
    let iconUrl;
    switch (inviteType) {
      case 'dining':
        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
        break;
      case 'sightseeing':
        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        break;
      case 'activity':
        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
        break;
      default:
        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }
    
    return {
      url: iconUrl,
      scaledSize: new google.maps.Size(35, 35)
    };
  }
  
  // 获取邀请信息内容
  getInviteInfoContent(invite) {
    const typeLabels = {
      'dining': '用餐',
      'sightseeing': '观光',
      'activity': '活动',
      'other': '其他'
    };
    
    return `
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">${invite.title}</h3>
        <p style="margin: 5px 0;"><strong>类型:</strong> ${typeLabels[invite.inviteType] || invite.inviteType}</p>
        <p style="margin: 5px 0;"><strong>位置:</strong> ${invite.location.name}</p>
        <p style="margin: 5px 0;"><strong>描述:</strong> ${invite.description}</p>
        <p style="margin: 5px 0;"><strong>最大人数:</strong> ${invite.maxParticipants}</p>
        <p style="margin: 5px 0;"><strong>状态:</strong> ${invite.status}</p>
        <div style="margin-top: 10px; text-align: center;">
          <button class="btn btn-primary" style="padding: 5px 10px; font-size: 12px;" onclick="joinInvite(${invite.id})">加入邀请</button>
        </div>
      </div>
    `;
  }
  
  // 显示附近可能的旅行搭子 - 增强版
  showNearbyTravelBuddies(position, radius = 50) {
    if (!this.map || !this.loaded) {
      console.warn('地图尚未加载完成');
      return;
    }
    
    // 保存用户位置
    this.currentUserPosition = position;
    
    // 清除之前的所有内容
    this.clearAll();
    
    // 添加用户位置标记
    const userMarker = new google.maps.Marker({
      position: { lat: position.lat, lng: position.lng },
      map: this.map,
      title: '您的位置',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    });
    
    this.markers.push(userMarker);
    
    // 模拟附近的旅行搭子（在实际应用中，这将从后端API获取）
    const mockBuddies = [
      { id: 1, name: '张小明', position: { lat: position.lat + 0.01, lng: position.lng + 0.01 }, activity: '寻找用餐伙伴', matchScore: 85, mbti: 'ENFJ', travelStyle: 'cultural' },
      { id: 2, name: '李美美', position: { lat: position.lat - 0.02, lng: position.lng - 0.02 }, activity: '寻找游览伙伴', matchScore: 92, mbti: 'ISFP', travelStyle: 'relaxing' },
      { id: 3, name: '王大力', position: { lat: position.lat + 0.015, lng: position.lng - 0.015 }, activity: '寻找活动伙伴', matchScore: 78, mbti: 'ENTP', travelStyle: 'adventure' },
      { id: 4, name: '赵静静', position: { lat: position.lat - 0.01, lng: position.lng + 0.02 }, activity: '寻找同行伙伴', matchScore: 88, mbti: 'ESFJ', travelStyle: 'cultural' }
    ];
    
    this.nearbyBuddies = mockBuddies;
    
    // 根据过滤器筛选搭子
    const filteredBuddies = this.filterBuddies(mockBuddies, position);
    
    filteredBuddies.forEach(buddy => {
      const marker = new google.maps.Marker({
        position: buddy.position,
        map: this.map,
        title: `${buddy.name} - 匹配度: ${buddy.matchScore}%`,
        icon: this.getBuddyMarkerIcon(buddy.matchScore)
      });
      
      const infowindow = new google.maps.InfoWindow({
        content: this.getBuddyInfoContent(buddy)
      });
      
      marker.addListener('click', () => {
        this.closeAllInfoWindows();
        infowindow.open(this.map, marker);
      });
      
      this.markers.push(marker);
      this.infoWindows.push(infowindow);
    });
    
    // 调整地图视图以适应所有标记
    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach(marker => {
      bounds.extend(marker.getPosition());
    });
    this.map.fitBounds(bounds);
  }
  
  // 过滤搭子
  filterBuddies(buddies, userPosition) {
    return buddies.filter(buddy => {
      // 检查距离
      const distance = this.calculateDistance(userPosition, buddy.position);
      if (distance > this.activeFilters.maxDistance) {
        return false;
      }
      
      // 检查匹配度
      if (buddy.matchScore < this.activeFilters.minMatchScore) {
        return false;
      }
      
      return true;
    });
  }
  
  // 计算两点间距离（公里）
  calculateDistance(pos1, pos2) {
    const R = 6371; // 地球半径（公里）
    const dLat = this.toRadians(pos2.lat - pos1.lat);
    const dLon = this.toRadians(pos2.lng - pos1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(pos1.lat)) *
      Math.cos(this.toRadians(pos2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  // 角度转弧度
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  // 获取搭子标记图标（基于匹配度）
  getBuddyMarkerIcon(matchScore) {
    let iconUrl;
    if (matchScore >= 90) {
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'; // 高匹配度
    } else if (matchScore >= 75) {
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/lime-dot.png'; // 中高匹配度
    } else if (matchScore >= 60) {
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'; // 中等匹配度
    } else {
      iconUrl = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'; // 低匹配度
    }
    
    return {
      url: iconUrl,
      scaledSize: new google.maps.Size(30, 30)
    };
  }
  
  // 获取搭子信息内容
  getBuddyInfoContent(buddy) {
    // 根据匹配度设置颜色
    let scoreColor = '#ff0000'; // 红色
    if (buddy.matchScore >= 90) scoreColor = '#00ff00'; // 绿色
    else if (buddy.matchScore >= 75) scoreColor = '#33cc33'; // 浅绿
    else if (buddy.matchScore >= 60) scoreColor = '#ffcc00'; // 黄色
    
    return `
      <div style="min-width: 220px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">${buddy.name}</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span><strong>匹配度:</strong></span>
          <span style="color: ${scoreColor}; font-weight: bold;">${buddy.matchScore}%</span>
        </div>
        <div style="margin-bottom: 8px;">
          <strong>MBTI:</strong> <span style="font-family: monospace;">${buddy.mbti}</span>
        </div>
        <div style="margin-bottom: 8px;">
          <strong>旅行风格:</strong> ${buddy.travelStyle}
        </div>
        <div style="margin-bottom: 15px; font-size: 0.9em; color: #666;">
          <p>${buddy.activity}</p>
        </div>
        <div style="text-align: center;">
          <button class="btn btn-primary" style="padding: 6px 12px; margin-right: 8px;" onclick="contactBuddy(${buddy.id})">联系</button>
          <button class="btn btn-outline" style="padding: 6px 12px;" onclick="viewUserDetails(${buddy.id})">详情</button>
        </div>
      </div>
    `;
  }
  
  // 更新视野内的附近搭子
  updateNearbyBuddiesInView() {
    // 在实际应用中，这里可以根据地图当前视图范围重新查询附近的搭子
    console.log('更新视野内的附近搭子');
    if (this.currentUserPosition) {
      // 这里可以触发重新获取附近搭子的逻辑
    }
  }
  
  // 设置过滤器
  setFilter(filterName, value) {
    this.activeFilters[filterName] = value;
    // 如果当前显示了搭子，重新应用过滤器
    if (this.currentUserPosition && this.nearbyBuddies.length > 0) {
      this.showNearbyTravelBuddies(this.currentUserPosition, this.activeFilters.maxDistance);
    }
  }
  
  // 获取推荐地点
  async getRecommendedPlaces(position, category = 'tourist_attraction') {
    if (!this.map || !this.loaded) {
      return Promise.reject('地图尚未加载完成');
    }
    
    // 使用Google Places API搜索附近的推荐地点
    const service = new google.maps.places.PlacesService(this.map);
    
    return new Promise((resolve, reject) => {
      const request = {
        location: new google.maps.LatLng(position.lat, position.lng),
        radius: 5000, // 5公里范围
        type: [category]
      };
      
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results.map(place => ({
            name: place.name,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            rating: place.rating || 0,
            vicinity: place.vicinity
          })));
        } else {
          reject(status);
        }
      });
    });
  }
  
  // 在地图上标记推荐地点
  showRecommendedPlaces(places) {
    if (!this.map || !this.loaded) {
      console.warn('地图尚未加载完成');
      return;
    }
    
    // 清除现有推荐标记
    this.clearMarkers();
    
    places.forEach((place, index) => {
      const marker = new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: this.map,
        title: place.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
          scaledSize: new google.maps.Size(30, 30)
        }
      });
      
      const infowindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3>${place.name}</h3>
            <p>评分: ${place.rating || 'N/A'}</p>
            <p>位置: ${place.vicinity}</p>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        this.closeAllInfoWindows();
        infowindow.open(this.map, marker);
      });
      
      this.markers.push(marker);
      this.infoWindows.push(infowindow);
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
  
  // 清除所有标记
  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }
  
  // 关闭所有信息窗口
  closeAllInfoWindows() {
    this.infoWindows.forEach(iw => iw.close());
  }
  
  // 清除所有路线
  clearRoutes() {
    this.routes.forEach(route => route.setMap(null));
    this.routes = [];
  }
  
  // 清除全部内容
  clearAll() {
    this.clearMarkers();
    this.closeAllInfoWindows();
    this.clearRoutes();
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