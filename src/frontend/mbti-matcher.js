// MBTI匹配算法模块
class MBTIMatcher {
  // MBTI兼容性评分矩阵
  static compatibilityMatrix = {
    // 与自己的类型完全兼容 (10分)
    'ENFJ': {'ENFJ': 10, 'ESFJ': 9, 'INFJ': 9, 'ISFJ': 8, 'ENTJ': 8, 'ESTJ': 7, 'INTJ': 9, 'ISTJ': 7, 'ENFP': 8, 'ESFP': 7, 'INFP': 9, 'ISFP': 8, 'ENTP': 7, 'ESTP': 6, 'INTP': 7, 'ISTP': 6},
    'ESFJ': {'ENFJ': 9, 'ESFJ': 10, 'INFJ': 8, 'ISFJ': 9, 'ENTJ': 7, 'ESTJ': 8, 'INTJ': 7, 'ISTJ': 8, 'ENFP': 7, 'ESFP': 8, 'INFP': 8, 'ISFP': 9, 'ENTP': 6, 'ESTP': 7, 'INTP': 6, 'ISTP': 7},
    'INFJ': {'ENFJ': 9, 'ESFJ': 8, 'INFJ': 10, 'ISFJ': 9, 'ENTJ': 7, 'ESTJ': 6, 'INTJ': 9, 'ISTJ': 6, 'ENFP': 8, 'ESFP': 6, 'INFP': 9, 'ISFP': 7, 'ENTP': 7, 'ESTP': 5, 'INTP': 8, 'ISTP': 5},
    'ISFJ': {'ENFJ': 8, 'ESFJ': 9, 'INFJ': 9, 'ISFJ': 10, 'ENTJ': 6, 'ESTJ': 7, 'INTJ': 8, 'ISTJ': 7, 'ENFP': 6, 'ESFP': 7, 'INFP': 8, 'ISFP': 9, 'ENTP': 5, 'ESTP': 6, 'INTP': 6, 'ISTP': 6},
    'ENTJ': {'ENFJ': 8, 'ESFJ': 7, 'INFJ': 7, 'ISFJ': 6, 'ENTJ': 10, 'ESTJ': 9, 'INTJ': 9, 'ISTJ': 8, 'ENFP': 7, 'ESFP': 6, 'INFP': 6, 'ISFP': 5, 'ENTP': 9, 'ESTP': 8, 'INTP': 8, 'ISTP': 7},
    'ESTJ': {'ENFJ': 7, 'ESFJ': 8, 'INFJ': 6, 'ISFJ': 7, 'ENTJ': 9, 'ESTJ': 10, 'INTJ': 8, 'ISTJ': 9, 'ENFP': 6, 'ESFP': 7, 'INFP': 5, 'ISFP': 6, 'ENTP': 8, 'ESTP': 9, 'INTP': 7, 'ISTP': 8},
    'INTJ': {'ENFJ': 9, 'ESFJ': 7, 'INFJ': 9, 'ISFJ': 8, 'ENTJ': 9, 'ESTJ': 8, 'INTJ': 10, 'ISTJ': 9, 'ENFP': 8, 'ESFP': 6, 'INFP': 9, 'ISFP': 6, 'ENTP': 9, 'ESTP': 7, 'INTP': 9, 'ISTP': 7},
    'ISTJ': {'ENFJ': 7, 'ESFJ': 8, 'INFJ': 6, 'ISFJ': 7, 'ENTJ': 8, 'ESTJ': 9, 'INTJ': 9, 'ISTJ': 10, 'ENFP': 6, 'ESFP': 7, 'INFP': 5, 'ISFP': 6, 'ENTP': 7, 'ESTP': 8, 'INTP': 8, 'ISTP': 9},
    'ENFP': {'ENFJ': 8, 'ESFJ': 7, 'INFJ': 8, 'ISFJ': 6, 'ENTJ': 7, 'ESTJ': 6, 'INTJ': 8, 'ISTJ': 6, 'ENFP': 10, 'ESFP': 9, 'INFP': 9, 'ISFP': 8, 'ENTP': 9, 'ESTP': 8, 'INTP': 9, 'ISTP': 7},
    'ESFP': {'ENFJ': 7, 'ESFJ': 8, 'INFJ': 6, 'ISFJ': 7, 'ENTJ': 6, 'ESTJ': 7, 'INTJ': 6, 'ISTJ': 7, 'ENFP': 9, 'ESFP': 10, 'INFP': 8, 'ISFP': 9, 'ENTP': 8, 'ESTP': 9, 'INTP': 7, 'ISTP': 8},
    'INFP': {'ENFJ': 9, 'ESFJ': 8, 'INFJ': 9, 'ISFJ': 8, 'ENTJ': 6, 'ESTJ': 5, 'INTJ': 9, 'ISTJ': 5, 'ENFP': 9, 'ESFP': 8, 'INFP': 10, 'ISFP': 9, 'ENTP': 8, 'ESTP': 7, 'INTP': 9, 'ISTP': 7},
    'ISFP': {'ENFJ': 8, 'ESFJ': 9, 'INFJ': 7, 'ISFJ': 9, 'ENTJ': 5, 'ESTJ': 6, 'INTJ': 6, 'ISTJ': 6, 'ENFP': 8, 'ESFP': 9, 'INFP': 9, 'ISFP': 10, 'ENTP': 7, 'ESTP': 8, 'INTP': 8, 'ISTP': 8},
    'ENTP': {'ENFJ': 7, 'ESFJ': 6, 'INFJ': 7, 'ISFJ': 5, 'ENTJ': 9, 'ESTJ': 8, 'INTJ': 9, 'ISTJ': 7, 'ENFP': 9, 'ESFP': 8, 'INFP': 8, 'ISFP': 7, 'ENTP': 10, 'ESTP': 9, 'INTP': 9, 'ISTP': 8},
    'ESTP': {'ENFJ': 6, 'ESFJ': 7, 'INFJ': 5, 'ISFJ': 6, 'ENTJ': 8, 'ESTJ': 9, 'INTJ': 7, 'ISTJ': 8, 'ENFP': 8, 'ESFP': 9, 'INFP': 7, 'ISFP': 8, 'ENTP': 9, 'ESTP': 10, 'INTP': 8, 'ISTP': 9},
    'INTP': {'ENFJ': 7, 'ESFJ': 6, 'INFJ': 8, 'ISFJ': 6, 'ENTJ': 8, 'ESTJ': 7, 'INTJ': 9, 'ISTJ': 8, 'ENFP': 9, 'ESFP': 7, 'INFP': 9, 'ISFP': 8, 'ENTP': 9, 'ESTP': 8, 'INTP': 10, 'ISTP': 9},
    'ISTP': {'ENFJ': 6, 'ESFJ': 7, 'INFJ': 5, 'ISFJ': 6, 'ENTJ': 7, 'ESTJ': 8, 'INTJ': 7, 'ISTJ': 9, 'ENFP': 7, 'ESFP': 8, 'INFP': 7, 'ISFP': 8, 'ENTP': 8, 'ESTP': 9, 'INTP': 9, 'ISTP': 10}
  };

  /**
   * 计算两个MBTI类型的兼容性分数
   * @param {string} type1 - 第一个MBTI类型
   * @param {string} type2 - 第二个MBTI类型
   * @returns {number} 兼容性分数 (0-10)
   */
  static getCompatibilityScore(type1, type2) {
    if (!type1 || !type2) return 0;
    
    // 统一转换为大写
    type1 = type1.toUpperCase();
    type2 = type2.toUpperCase();
    
    // 检查是否为有效的MBTI类型
    if (!this.isValidMBTI(type1) || !this.isValidMBTI(type2)) {
      return 0;
    }
    
    // 从兼容性矩阵获取分数
    const row = this.compatibilityMatrix[type1];
    if (row && row[type2] !== undefined) {
      return row[type2];
    }
    
    // 如果找不到特定匹配，使用通用算法
    return this.calculateGenericCompatibility(type1, type2);
  }

  /**
   * 验证MBTI类型是否有效
   * @param {string} type - MBTI类型
   * @returns {boolean} 是否有效
   */
  static isValidMBTI(type) {
    return /^[EIJ][NSFP][TFJP][PJ]$/.test(type.toUpperCase());
  }

  /**
   * 通用兼容性计算算法
   * @param {string} type1 - 第一个MBTI类型
   * @param {string} type2 - 第二个MBTI类型
   * @returns {number} 兼容性分数
   */
  static calculateGenericCompatibility(type1, type2) {
    type1 = type1.toUpperCase();
    type2 = type2.toUpperCase();
    
    let score = 10; // 基础分数
    
    // 比较每个维度
    // E/I 维度
    if (type1[0] !== type2[0]) score -= 2; // 内外向差异扣2分
    
    // S/N 维度
    if (type1[1] !== type2[1]) score -= 1; // 感觉直觉差异扣1分
    
    // T/F 维度
    if (type1[2] !== type2[2]) score -= 2; // 思维情感差异扣2分
    
    // J/P 维度
    if (type1[3] !== type2[3]) score -= 1; // 判断知觉差异扣1分
    
    // 确保分数在0-10范围内
    return Math.max(0, Math.min(10, score));
  }

  /**
   * 根据多个因素计算综合匹配度
   * @param {Object} user1 - 用户1的档案
   * @param {Object} user2 - 用户2的档案
   * @returns {number} 综合匹配度 (0-100)
   */
  static calculateComprehensiveMatch(user1, user2) {
    if (!user1 || !user2) return 0;
    
    // 权重分配
    const weights = {
      mbti: 0.3,           // MBTI兼容性 30%
      travelStyle: 0.15,   // 旅行风格 15%
      budget: 0.15,        // 预算敏感度 15%
      pace: 0.15,          // 旅行节奏 15%
      risk: 0.1,           // 风险承受能力 10%
      experience: 0.15     // 出行经验差异 15%
    };
    
    let totalScore = 0;
    
    // 计算MBTI兼容性
    const mbtiScore = this.getCompatibilityScore(user1.mbtiType, user2.mbtiType) * 10; // 转换为0-100分制
    totalScore += mbtiScore * weights.mbti;
    
    // 计算旅行风格匹配度
    const travelStyleScore = user1.travelStyle === user2.travelStyle ? 100 : 50;
    totalScore += travelStyleScore * weights.travelStyle;
    
    // 计算预算敏感度匹配度
    const budgetScore = this.calculateBudgetCompatibility(user1.budgetSensitivity, user2.budgetSensitivity) * 100;
    totalScore += budgetScore * weights.budget;
    
    // 计算旅行节奏匹配度
    const paceScore = user1.pacePreference === user2.pacePreference ? 100 : 60;
    totalScore += paceScore * weights.pace;
    
    // 计算风险承受能力匹配度
    const riskScore = user1.riskTolerance === user2.riskTolerance ? 100 : 70;
    totalScore += riskScore * weights.risk;
    
    // 计算经验匹配度（经验差距越小越好）
    const expDiff = Math.abs((user1.soloExperience || 0) - (user2.soloExperience || 0));
    const expScore = Math.max(0, 100 - expDiff * 10); // 每年差距扣10分
    totalScore += expScore * weights.experience;
    
    return Math.round(totalScore);
  }
  
  /**
   * 计算预算敏感度兼容性
   * @param {string} budget1 - 预算敏感度1
   * @param {string} budget2 - 预算敏感度2
   * @returns {number} 兼容性分数 (0-1)
   */
  static calculateBudgetCompatibility(budget1, budget2) {
    if (!budget1 || !budget2) return 0.5; // 默认中等兼容性
    
    if (budget1 === budget2) return 1.0; // 完全相同最高兼容性
    
    // 预算敏感度相近程度
    const budgetLevels = { 'high': 0, 'medium': 1, 'low': 2 }; // 敏感度越高数值越小
    const level1 = budgetLevels[budget1];
    const level2 = budgetLevels[budget2];
    
    if (level1 === undefined || level2 === undefined) return 0.5;
    
    // 差距越大兼容性越低
    const diff = Math.abs(level1 - level2);
    return Math.max(0, 1 - diff * 0.3); // 每级差扣30%
  }
  
  /**
   * 根据匹配度推荐合适的旅行活动
   * @param {Object} user1 - 用户1
   * @param {Object} user2 - 用户2
   * @returns {Array} 推荐活动列表
   */
  static recommendActivities(user1, user2) {
    if (!user1 || !user2) return [];
    
    const recommendations = [];
    
    // 根据MBTI类型推荐活动
    const combinedTypes = [user1.mbtiType, user2.mbtiType].filter(Boolean);
    for (const type of combinedTypes) {
      if (this.isIntrovertedType(type)) {
        recommendations.push('安静的咖啡馆', '艺术画廊', '图书馆');
      }
      if (this.isExtravertedType(type)) {
        recommendations.push('热闹的夜市', '社交聚会', '团队活动');
      }
      if (this.isIntuitiveType(type)) {
        recommendations.push('创意工坊', '哲学讨论', '未来规划');
      }
      if (this.isSensingType(type)) {
        recommendations.push('实地参观', '感官体验', '具体活动');
      }
      if (this.isThinkingType(type)) {
        recommendations.push('策略游戏', '辩论讨论', '理性分析');
      }
      if (this.isFeelingType(type)) {
        recommendations.push('情感分享', '志愿服务', '共情活动');
      }
      if (this.isJudgingType(type)) {
        recommendations.push('有序行程', '计划活动', '时间管理');
      }
      if (this.isPerceivingType(type)) {
        recommendations.push('灵活安排', '即兴活动', '开放探索');
      }
    }
    
    // 根据旅行风格推荐
    if (user1.travelStyle === 'adventure' || user2.travelStyle === 'adventure') {
      recommendations.push('徒步旅行', '极限运动', '探险活动');
    }
    if (user1.travelStyle === 'relaxing' || user2.travelStyle === 'relaxing') {
      recommendations.push('温泉放松', '海滩日光浴', '冥想课程');
    }
    if (user1.travelStyle === 'cultural' || user2.travelStyle === 'cultural') {
      recommendations.push('博物馆参观', '历史遗迹', '文化表演');
    }
    
    // 根据节奏偏好推荐
    if (user1.pacePreference === 'slow' || user2.pacePreference === 'slow') {
      recommendations.push('悠闲漫步', '深度体验', '慢慢品味');
    }
    if (user1.pacePreference === 'fast' || user2.pacePreference === 'fast') {
      recommendations.push('紧凑行程', '高效游览', '快速体验');
    }
    
    // 去重并返回
    return [...new Set(recommendations)];
  }
  
  // 辅助方法：判断MBTI类型的各个维度
  static isIntrovertedType(type) { return type && type[0] === 'I'; }
  static isExtravertedType(type) { return type && type[0] === 'E'; }
  static isIntuitiveType(type) { return type && type[1] === 'N'; }
  static isSensingType(type) { return type && type[1] === 'S'; }
  static isThinkingType(type) { return type && type[2] === 'T'; }
  static isFeelingType(type) { return type && type[2] === 'F'; }
  static isJudgingType(type) { return type && type[3] === 'J'; }
  static isPerceivingType(type) { return type && type[3] === 'P'; }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MBTIMatcher;
}