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
    
    // 检查是否为有效的MBTI类型
    if (!this.isValidMBTI(type1) || !this.isValidMBTI(type2)) {
      return 0;
    }
    
    let score = 10; // 基础分数
    
    // 比较每个维度
    // E/I 维度 - 外向/内向
    if (type1[0] !== type2[0]) {
      score -= 2; // 外向-内向差异扣2分
    } else {
      // 相同倾向给予轻微加分
      score += 0.5;
    }
    
    // S/N 维度 - 感觉/直觉
    if (type1[1] !== type2[1]) {
      score -= 1; // 感觉-直觉差异扣1分
    } else {
      // 相同倾向给予轻微加分
      score += 0.5;
    }
    
    // T/F 维度 - 思维/情感
    if (type1[2] !== type2[2]) {
      score -= 2; // 思维-情感差异扣2分
    } else {
      // 相同倾向给予轻微加分
      score += 0.5;
    }
    
    // J/P 维度 - 判断/知觉
    if (type1[3] !== type2[3]) {
      score -= 1; // 判断-知觉差异扣1分
    } else {
      // 相同倾向给予轻微加分
      score += 0.5;
    }
    
    // 额外考虑：认知功能兼容性
    // 根据类型的功能栈进行更细致的匹配
    const cognitiveFunctionScore = this.calculateCognitiveFunctionCompatibility(type1, type2);
    score = score * 0.7 + cognitiveFunctionScore * 0.3; // 平衡基础维度和认知功能
    
    // 确保分数在0-10范围内
    return Math.max(0, Math.min(10, score));
  }

  /**
   * 基于认知功能的兼容性计算
   * @param {string} type1 - 第一个MBTI类型
   * @param {string} type2 - 第二个MBTI类型
   * @returns {number} 认知功能兼容性分数 (0-10)
   */
  static calculateCognitiveFunctionCompatibility(type1, type2) {
    // 获取主导功能
    const dominant1 = this.getDominantFunction(type1);
    const dominant2 = this.getDominantFunction(type2);
    
    // 获取辅助功能
    const auxiliary1 = this.getAuxiliaryFunction(type1);
    const auxiliary2 = this.getAuxiliaryFunction(type2);
    
    let score = 0;
    
    // 主导功能匹配度
    if (dominant1 === dominant2) {
      score += 3; // 相同主导功能加3分
    } else if (this.areComplementaryFunctions(dominant1, dominant2)) {
      score += 5; // 互补功能加5分
    } else {
      score += 1; // 不匹配功能加1分
    }
    
    // 辅助功能匹配度
    if (auxiliary1 === auxiliary2) {
      score += 2; // 相同辅助功能加2分
    } else if (this.areComplementaryFunctions(auxiliary1, auxiliary2)) {
      score += 4; // 互补功能加4分
    } else {
      score += 0.5; // 不匹配功能加0.5分
    }
    
    // 主导-辅助交叉匹配
    if (dominant1 === auxiliary2 || dominant2 === auxiliary1) {
      score += 2; // 交叉匹配加2分
    }
    
    // 限制在0-10范围内
    return Math.min(10, score);
  }

  /**
   * 获取类型的主导认知功能
   * @param {string} type - MBTI类型
   * @returns {string} 主导认知功能
   */
  static getDominantFunction(type) {
    type = type.toUpperCase();
    if (!this.isValidMBTI(type)) return '';
    
    // 主导功能取决于E/I和N/S维度
    if (type.includes('E')) {
      // 外向类型：主导功能是外向功能
      if (type.includes('N')) {
        return 'Ne'; // ENTP/J, ESFP/J
      } else if (type.includes('S')) {
        return 'Se'; // ESTP/J, ESFJ
      } else if (type.includes('T')) {
        return 'Te'; // ENTJ, ESTJ
      } else if (type.includes('F')) {
        return 'Fe'; // ENFJ, ESFJ
      }
    } else {
      // 内向类型：主导功能是内向功能
      if (type.includes('N')) {
        return 'Ni'; // INTJ, INFP
      } else if (type.includes('S')) {
        return 'Si'; // ISFJ, ISTJ
      } else if (type.includes('T')) {
        return 'Ti'; // INTP, ISTP
      } else if (type.includes('F')) {
        return 'Fi'; // INFP, ISFP
      }
    }
    
    return '';
  }

  /**
   * 获取类型的辅助认知功能
   * @param {string} type - MBTI类型
   * @returns {string} 辅助认知功能
   */
  static getAuxiliaryFunction(type) {
    type = type.toUpperCase();
    if (!this.isValidMBTI(type)) return '';
    
    // 辅助功能是主导功能的对立面
    if (type.includes('E')) {
      // 外向类型：辅助功能是内向功能
      if (type.includes('N')) {
        return 'Ni'; // ENTP/J, ENFJ
      } else if (type.includes('S')) {
        return 'Si'; // ESFP/J, ESFJ
      } else if (type.includes('T')) {
        return 'Ti'; // ENTJ, ESTJ
      } else if (type.includes('F')) {
        return 'Fi'; // ENFJ, ESFJ
      }
    } else {
      // 内向类型：辅助功能是外向功能
      if (type.includes('N')) {
        return 'Ne'; // INTJ, INFP
      } else if (type.includes('S')) {
        return 'Se'; // ISFJ, ISTJ
      } else if (type.includes('T')) {
        return 'Te'; // INTP, ISTP
      } else if (type.includes('F')) {
        return 'Fe'; // INFP, ISFP
      }
    }
    
    return '';
  }

  /**
   * 判断两个认知功能是否互补
   * @param {string} func1 - 第一个认知功能
   * @param {string} func2 - 第二个认知功能
   * @returns {boolean} 是否互补
   */
  static areComplementaryFunctions(func1, func2) {
    const complementaryPairs = [
      ['Te', 'Fi'], ['Fi', 'Te'],
      ['Ti', 'Fe'], ['Fe', 'Ti'],
      ['Ne', 'Si'], ['Si', 'Ne'],
      ['Ni', 'Se'], ['Se', 'Ni']
    ];
    
    return complementaryPairs.some(pair => pair[0] === func1 && pair[1] === func2);
  }

  /**
   * 根据多个因素计算综合匹配度
   * @param {Object} user1 - 用户1的档案
   * @param {Object} user2 - 用户2的档案
   * @returns {number} 综合匹配度 (0-100)
   */
  static calculateComprehensiveMatch(user1, user2) {
    if (!user1 || !user2) return 0;
    
    // 权重分配 - 更加细致的权重分配
    const weights = {
      mbti: 0.25,           // MBTI兼容性 25%
      travelStyle: 0.15,    // 旅行风格 15%
      budget: 0.15,         // 预算敏感度 15%
      pace: 0.15,           // 旅行节奏 15%
      risk: 0.1,            // 风险承受能力 10%
      experience: 0.1,      // 出行经验差异 10%
      accommodation: 0.05,  // 住宿偏好 5%
      activity: 0.05        // 活动偏好 5%
    };
    
    let totalScore = 0;
    
    // 计算MBTI兼容性
    const mbtiScore = this.getCompatibilityScore(user1.mbtiType, user2.mbtiType) * 10; // 转换为0-100分制
    totalScore += mbtiScore * weights.mbti;
    
    // 计算旅行风格匹配度
    const travelStyleScore = this.calculateTravelStyleCompatibility(user1.travelStyle, user2.travelStyle) * 100;
    totalScore += travelStyleScore * weights.travelStyle;
    
    // 计算预算敏感度匹配度
    const budgetScore = this.calculateBudgetCompatibility(user1.budgetSensitivity, user2.budgetSensitivity) * 100;
    totalScore += budgetScore * weights.budget;
    
    // 计算旅行节奏匹配度
    const paceScore = this.calculatePaceCompatibility(user1.pacePreference, user2.pacePreference) * 100;
    totalScore += paceScore * weights.pace;
    
    // 计算风险承受能力匹配度
    const riskScore = this.calculateRiskCompatibility(user1.riskTolerance, user2.riskTolerance) * 100;
    totalScore += riskScore * weights.risk;
    
    // 计算经验匹配度（经验差距越小越好）
    const expDiff = Math.abs((user1.soloExperience || 0) - (user2.soloExperience || 0));
    const expScore = Math.max(0, 100 - expDiff * 5); // 每年差距扣5分（降低扣分幅度）
    totalScore += expScore * weights.experience;
    
    // 计算住宿偏好匹配度
    const accommodationScore = this.calculateAccommodationCompatibility(user1.accommodationPreference, user2.accommodationPreference) * 100;
    totalScore += accommodationScore * weights.accommodation;
    
    // 计算活动偏好匹配度
    const activityScore = this.calculateActivityCompatibility(user1.activityPreference, user2.activityPreference) * 100;
    totalScore += activityScore * weights.activity;
    
    return Math.round(totalScore);
  }

  /**
   * 计算旅行风格兼容性
   * @param {string} style1 - 旅行风格1
   * @param {string} style2 - 旅行风格2
   * @returns {number} 兼容性分数 (0-1)
   */
  static calculateTravelStyleCompatibility(style1, style2) {
    if (!style1 || !style2) return 0.5; // 默认中等兼容性
    
    if (style1 === style2) return 1.0; // 完全相同最高兼容性
    
    // 定义相似的旅行风格组合
    const similarStyles = [
      ['adventure', 'outdoor'],
      ['relaxing', 'indoor'],
      ['cultural', 'cultural'],
      ['luxury', 'luxury'],
      ['budget', 'budget'],
      ['backpacking', 'outdoor']
    ];
    
    // 检查是否在相似组合中
    for (const [s1, s2] of similarStyles) {
      if ((style1 === s1 && style2 === s2) || (style1 === s2 && style2 === s1)) {
        return 0.8; // 相似风格高兼容性
      }
    }
    
    // 一般兼容性
    return 0.4;
  }

  /**
   * 计算旅行节奏兼容性
   * @param {string} pace1 - 旅行节奏1
   * @param {string} pace2 - 旅行节奏2
   * @returns {number} 兼容性分数 (0-1)
   */
  static calculatePaceCompatibility(pace1, pace2) {
    if (!pace1 || !pace2) return 0.5; // 默认中等兼容性
    
    if (pace1 === pace2) return 1.0; // 相同节奏最高兼容性
    
    // 快节奏和中等节奏有一定兼容性
    if ((pace1 === 'fast' && pace2 === 'moderate') || (pace1 === 'moderate' && pace2 === 'fast')) {
      return 0.7;
    }
    
    // 慢节奏和中等节奏有一定兼容性
    if ((pace1 === 'slow' && pace2 === 'moderate') || (pace1 === 'moderate' && pace2 === 'slow')) {
      return 0.7;
    }
    
    // 快节奏和慢节奏兼容性最低
    if ((pace1 === 'fast' && pace2 === 'slow') || (pace1 === 'slow' && pace2 === 'fast')) {
      return 0.2;
    }
    
    return 0.5; // 其他情况中等兼容性
  }

  /**
   * 计算风险承受能力兼容性
   * @param {string} risk1 - 风险承受能力1
   * @param {string} risk2 - 风险承受能力2
   * @returns {number} 兼容性分数 (0-1)
   */
  static calculateRiskCompatibility(risk1, risk2) {
    if (!risk1 || !risk2) return 0.5; // 默认中等兼容性
    
    if (risk1 === risk2) return 1.0; // 相同风险承受能力最高兼容性
    
    // 中等风险承受能力与其他的兼容性
    if (risk1 === 'medium' || risk2 === 'medium') {
      return 0.8; // 中等风险承受能力兼容性较高
    }
    
    // 高低风险承受能力兼容性较低
    return 0.3;
  }

  /**
   * 计算住宿偏好兼容性
   * @param {string} acc1 - 住宿偏好1
   * @param {string} acc2 - 住宿偏好2
   * @returns {number} 兼容性分数 (0-1)
   */
  static calculateAccommodationCompatibility(acc1, acc2) {
    if (!acc1 || !acc2) return 0.5; // 默认中等兼容性
    
    if (acc1 === acc2) return 1.0; // 相同住宿偏好最高兼容性
    
    // 混合型与其他类型的兼容性
    if (acc1 === 'mixed' || acc2 === 'mixed') {
      return 0.9; // 混合型兼容性高
    }
    
    // 酒店和民宿兼容性较好
    if ((acc1 === 'hotel' && acc2 === 'airbnb') || (acc1 === 'airbnb' && acc2 === 'hotel')) {
      return 0.7;
    }
    
    // 青旅和背包客型兼容性较好
    if ((acc1 === 'hostel' && acc2 === 'backpacking') || (acc1 === 'backpacking' && acc2 === 'hostel')) {
      return 0.8;
    }
    
    // 奢华型与其他兼容性较低
    if (acc1 === 'luxury' || acc2 === 'luxury') {
      return 0.4; // 奢华型与其他兼容性较低
    }
    
    return 0.6; // 其他情况中等兼容性
  }

  /**
   * 计算活动偏好兼容性
   * @param {string} act1 - 活动偏好1
   * @param {string} act2 - 活动偏好2
   * @returns {number} 兼容性分数 (0-1)
   */
  static calculateActivityCompatibility(act1, act2) {
    if (!act1 || !act2) return 0.5; // 默认中等兼容性
    
    if (act1 === act2) return 1.0; // 相同活动偏好最高兼容性
    
    // 混合型与其他类型的兼容性
    if (act1 === 'mixed' || act2 === 'mixed') {
      return 0.9; // 混合型兼容性高
    }
    
    // 户外和冒险兼容性较好
    if ((act1 === 'outdoor' && act2 === 'adventure') || (act1 === 'adventure' && act2 === 'outdoor')) {
      return 0.8;
    }
    
    // 室内和文化兼容性较好
    if ((act1 === 'indoor' && act2 === 'cultural') || (act1 === 'cultural' && act2 === 'indoor')) {
      return 0.7;
    }
    
    // 美食与其他兼容性较好
    if (act1 === 'food' || act2 === 'food') {
      return 0.7; // 美食是共同兴趣点
    }
    
    return 0.6; // 其他情况中等兼容性
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
    
    // 根据MBTI类型推荐活动 - 更精确的推荐
    const combinedTypes = [user1.mbtiType, user2.mbtiType].filter(Boolean);
    for (const type of combinedTypes) {
      // 内向型偏好
      if (this.isIntrovertedType(type)) {
        recommendations.push('安静的咖啡馆', '艺术画廊', '图书馆', '冥想课程', '小型书店');
      }
      // 外向型偏好
      if (this.isExtravertedType(type)) {
        recommendations.push('热闹的夜市', '社交聚会', '团队活动', '音乐节', '大型商场');
      }
      // 直觉型偏好
      if (this.isIntuitiveType(type)) {
        recommendations.push('创意工坊', '哲学讨论', '未来规划', '科幻展览', '抽象艺术展');
      }
      // 感觉型偏好
      if (this.isSensingType(type)) {
        recommendations.push('实地参观', '感官体验', '具体活动', '手工艺制作', '自然观察');
      }
      // 思维型偏好
      if (this.isThinkingType(type)) {
        recommendations.push('策略游戏', '辩论讨论', '理性分析', '解谜游戏', '科学博物馆');
      }
      // 情感型偏好
      if (this.isFeelingType(type)) {
        recommendations.push('情感分享', '志愿服务', '共情活动', '慈善活动', '心理咨询');
      }
      // 判断型偏好
      if (this.isJudgingType(type)) {
        recommendations.push('有序行程', '计划活动', '时间管理', '主题公园', '结构化游览');
      }
      // 知觉型偏好
      if (this.isPerceivingType(type)) {
        recommendations.push('灵活安排', '即兴活动', '开放探索', '自由市场', '随机发现');
      }
    }
    
    // 根据旅行风格推荐 - 更详细的推荐
    if (user1.travelStyle === 'adventure' || user2.travelStyle === 'adventure') {
      recommendations.push('徒步旅行', '极限运动', '探险活动', '攀岩', '漂流', '山地骑行');
    }
    if (user1.travelStyle === 'relaxing' || user2.travelStyle === 'relaxing') {
      recommendations.push('温泉放松', '海滩日光浴', '冥想课程', '瑜伽体验', '水疗中心', '森林浴');
    }
    if (user1.travelStyle === 'cultural' || user2.travelStyle === 'cultural') {
      recommendations.push('博物馆参观', '历史遗迹', '文化表演', '传统工艺体验', '宗教场所参观', '当地节日参与');
    }
    if (user1.travelStyle === 'luxury' || user2.travelStyle === 'luxury') {
      recommendations.push('高端餐厅', '五星级酒店体验', '私人定制服务', '精品购物', '米其林餐厅');
    }
    if (user1.travelStyle === 'budget' || user2.travelStyle === 'budget') {
      recommendations.push('免费景点', '街头美食', '公共活动', '跳蚤市场', '学生折扣活动');
    }
    if (user1.travelStyle === 'backpacking' || user2.travelStyle === 'backpacking') {
      recommendations.push('青年旅社社交', '徒步远足', '露营体验', '背包客聚集地', '当地公共交通探索');
    }
    
    // 根据节奏偏好推荐
    if (user1.pacePreference === 'slow' || user2.pacePreference === 'slow') {
      recommendations.push('悠闲漫步', '深度体验', '慢慢品味', '长期停留', '深度对话', '冥想时刻');
    }
    if (user1.pacePreference === 'fast' || user2.pacePreference === 'fast') {
      recommendations.push('紧凑行程', '高效游览', '快速体验', '多地打卡', '快速决策', '密集活动');
    }
    if (user1.pacePreference === 'moderate' || user2.pacePreference === 'moderate') {
      recommendations.push('平衡行程', '适度活动', '劳逸结合', '合理规划', '定时休息');
    }
    
    // 根据风险承受能力推荐
    if (user1.riskTolerance === 'high' || user2.riskTolerance === 'high') {
      recommendations.push('极限运动', '探险活动', '未知领域探索', '冒险挑战', '刺激体验');
    }
    if (user1.riskTolerance === 'low' || user2.riskTolerance === 'low') {
      recommendations.push('安全路线', '知名景点', '熟悉环境', '舒适区活动', '常规体验');
    }
    if (user1.riskTolerance === 'medium' || user2.riskTolerance === 'medium') {
      recommendations.push('适度挑战', '平衡风险', '渐进式体验', '可控冒险');
    }
    
    // 根据预算敏感度推荐
    if (user1.budgetSensitivity === 'high' || user2.budgetSensitivity === 'high') {
      recommendations.push('免费活动', '打折优惠', '学生票价', '经济型选择', '性价比高的体验');
    }
    if (user1.budgetSensitivity === 'low' || user2.budgetSensitivity === 'low') {
      recommendations.push('高端体验', '奢华享受', '付费增值服务', '昂贵但值得的体验');
    }
    
    // 根据活动偏好推荐
    if (user1.activityPreference === 'outdoor' || user2.activityPreference === 'outdoor') {
      recommendations.push('户外运动', '自然探索', '公园散步', '登山', '野餐', '观鸟');
    }
    if (user1.activityPreference === 'indoor' || user2.activityPreference === 'indoor') {
      recommendations.push('室内娱乐', '博物馆', '电影院', '咖啡厅', '室内运动', '阅读空间');
    }
    if (user1.activityPreference === 'food' || user2.activityPreference === 'food') {
      recommendations.push('美食体验', '烹饪课程', '餐厅探店', '当地小吃', '食材市场', '品酒活动');
    }
    
    // 去重并返回，同时保持推荐的相关性和多样性
    const uniqueRecommendations = [...new Set(recommendations)];
    
    // 根据用户的匹配度调整推荐数量
    const matchScore = this.calculateComprehensiveMatch(user1, user2);
    const maxRecommendations = Math.min(15, Math.ceil(uniqueRecommendations.length * (matchScore / 100)));
    
    return uniqueRecommendations.slice(0, maxRecommendations);
  }
  
  /**
   * 根据用户档案推荐最佳旅行目的地
   * @param {Object} user - 用户档案
   * @returns {Array} 推荐目的地列表
   */
  static recommendDestinations(user) {
    if (!user) return [];
    
    const destinations = [];
    
    // 根据MBTI类型推荐目的地
    if (user.mbtiType) {
      if (this.isIntrovertedType(user.mbtiType)) {
        destinations.push('日本', '芬兰', '瑞士', '冰岛', '新西兰'); // 宁静自然的环境
      }
      if (this.isExtravertedType(user.mbtiType)) {
        destinations.push('泰国', '西班牙', '巴西', '美国', '意大利'); // 社交丰富的环境
      }
      if (this.isIntuitiveType(user.mbtiType)) {
        destinations.push('荷兰', '丹麦', '新加坡', '加拿大', '澳大利亚'); // 创新前瞻的地方
      }
      if (this.isSensingType(user.mbtiType)) {
        destinations.push('法国', '德国', '奥地利', '捷克', '希腊'); // 历史文化丰富的地方
      }
      if (this.isThinkingType(user.mbtiType)) {
        destinations.push('Germany', 'Switzerland', 'Japan', 'South Korea', 'Singapore'); // 科技发达的地方
      }
      if (this.isFeelingType(user.mbtiType)) {
        destinations.push('New Zealand', 'Canada', 'Costa Rica', 'Thailand', 'Bali'); // 温暖友善的地方
      }
      if (this.isJudgingType(user.mbtiType)) {
        destinations.push('Germany', 'Switzerland', 'Japan', 'South Korea', 'Austria'); // 规划完善的地方
      }
      if (this.isPerceivingType(user.mbtiType)) {
        destinations.push('Thailand', 'Indonesia', 'India', 'Morocco', 'Argentina'); // 灵活多变的地方
      }
    }
    
    // 根据旅行风格推荐目的地
    if (user.travelStyle === 'adventure') {
      destinations.push('新西兰', '尼泊尔', '南非', '哥斯达黎加', '挪威');
    }
    if (user.travelStyle === 'relaxing') {
      destinations.push('马尔代夫', '巴厘岛', '泰国', '斐济', '塞舌尔');
    }
    if (user.travelStyle === 'cultural') {
      destinations.push('意大利', '法国', '希腊', '埃及', '印度');
    }
    if (user.travelStyle === 'luxury') {
      destinations.push('瑞士', '摩纳哥', '迪拜', '新加坡', '日本');
    }
    if (user.travelStyle === 'budget') {
      destinations.push('越南', '柬埔寨', '老挝', '玻利维亚', '乌克兰');
    }
    if (user.travelStyle === 'backpacking') {
      destinations.push('泰国', '秘鲁', '摩洛哥', '危地马拉', '尼泊尔');
    }
    
    // 根据预算敏感度推荐
    if (user.budgetSensitivity === 'high') {
      destinations.push('越南', '柬埔寨', '玻利维亚', '乌克兰', '格鲁吉亚');
    }
    if (user.budgetSensitivity === 'low') {
      destinations.push('瑞士', '挪威', '丹麦', '日本', '新加坡');
    }
    
    // 根据风险承受能力推荐
    if (user.riskTolerance === 'high') {
      destinations.push('尼泊尔', '坦桑尼亚', '阿根廷', '蒙古', '格陵兰');
    }
    if (user.riskTolerance === 'low') {
      destinations.push('新加坡', '日本', '新西兰', '芬兰', '瑞士');
    }
    
    // 去重并返回
    return [...new Set(destinations)].slice(0, 10); // 返回前10个推荐目的地
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