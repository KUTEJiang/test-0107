// 智能推荐引擎模块
class IntelligentRecommender {
  constructor() {
    // 季节性偏好映射
    this.seasonalPreferences = {
      'winter': ['skiing', 'hot_springs', 'festivals', 'indoor_activities', 'warm_destinations'],
      'spring': ['cherry_blossom', 'nature_walks', 'gardens', 'temperate_destinations', 'outdoor_activities'],
      'summer': ['beaches', 'water_sports', 'adventure', 'cool_destinations', 'outdoor_festivals'],
      'autumn': ['fall_foliage', 'harvest_festivals', 'wine_regions', 'moderate_activities', 'scenic_drives']
    };

    // 文化兼容性映射
    this.culturalCompatibility = {
      'introvert': ['quiet_cafes', 'art_galleries', 'libraries', 'temples', 'museums'],
      'extrovert': ['social_events', 'nightlife', 'markets', 'festivals', 'group_activities'],
      'intuitive': ['innovative_spaces', 'tech_centers', 'future_oriented_sites', 'abstract_art', 'philosophical_places'],
      'sensing': ['historical_sites', 'concrete_experiences', 'hands_on_activities', 'traditional_places', 'sensory_experiences'],
      'thinking': ['science_museums', 'debate_clubs', 'strategic_games', 'logical_challenges', 'analytical_activities'],
      'feeling': ['volunteer_work', 'empathy_based_activities', 'community_service', 'emotional_experiences', 'supportive_environments'],
      'judging': ['structured_tours', 'planned_itineraries', 'organized_activities', 'scheduled_events', 'orderly_environments'],
      'perceiving': ['spontaneous_adventures', 'flexible_plans', 'open_ended_activities', 'exploration', 'adaptable_schedules']
    };
  }

  /**
   * 基于多维度数据的智能匹配评分
   * @param {Object} user1 - 用户1档案
   * @param {Object} user2 - 用户2档案
   * @param {Object} context - 上下文信息（如季节、地点、时间等）
   * @returns {Object} 包含匹配度和详细分析的对象
   */
  getSmartMatchScore(user1, user2, context = {}) {
    if (!user1 || !user2) {
      return { score: 0, analysis: {}, recommendations: [] };
    }

    // 各维度权重
    const weights = {
      mbti: 0.25,
      travelStyle: 0.15,
      budget: 0.15,
      pace: 0.15,
      risk: 0.1,
      experience: 0.1,
      accommodation: 0.05,
      activity: 0.05
    };

    let totalScore = 0;
    const analysis = {};
    const recommendations = [];

    // MBTI兼容性
    const mbtiScore = this.calculateMBTIScore(user1.mbtiType, user2.mbtiType);
    totalScore += mbtiScore.score * weights.mbti;
    analysis.mbti = mbtiScore.analysis;

    // 旅行风格兼容性
    const travelStyleScore = this.calculateTravelStyleScore(user1.travelStyle, user2.travelStyle);
    totalScore += travelStyleScore.score * weights.travelStyle;
    analysis.travelStyle = travelStyleScore.analysis;

    // 预算兼容性
    const budgetScore = this.calculateBudgetScore(user1.budgetSensitivity, user2.budgetSensitivity);
    totalScore += budgetScore.score * weights.budget;
    analysis.budget = budgetScore.analysis;

    // 节奏兼容性
    const paceScore = this.calculatePaceScore(user1.pacePreference, user2.pacePreference);
    totalScore += paceScore.score * weights.pace;
    analysis.pace = paceScore.analysis;

    // 风险兼容性
    const riskScore = this.calculateRiskScore(user1.riskTolerance, user2.riskTolerance);
    totalScore += riskScore.score * weights.risk;
    analysis.risk = riskScore.analysis;

    // 经验兼容性
    const experienceScore = this.calculateExperienceScore(user1.soloExperience, user2.soloExperience);
    totalScore += experienceScore.score * weights.experience;
    analysis.experience = experienceScore.analysis;

    // 住宿偏好兼容性
    const accommodationScore = this.calculateAccommodationScore(user1.accommodationPreference, user2.accommodationPreference);
    totalScore += accommodationScore.score * weights.accommodation;
    analysis.accommodation = accommodationScore.analysis;

    // 活动偏好兼容性
    const activityScore = this.calculateActivityScore(user1.activityPreference, user2.activityPreference);
    totalScore += activityScore.score * weights.activity;
    analysis.activity = activityScore.analysis;

    // 根据上下文调整分数
    const contextualAdjustment = this.applyContextualAdjustments(user1, user2, context);
    totalScore = Math.min(100, Math.max(0, totalScore + contextualAdjustment.scoreAdjustment));
    
    // 生成个性化推荐
    recommendations.push(...this.generatePersonalizedRecommendations(user1, user2, context));

    return {
      score: Math.round(totalScore),
      analysis,
      recommendations,
      confidence: this.calculateConfidenceLevel(totalScore, analysis)
    };
  }

  /**
   * 计算MBTI兼容性分数
   */
  calculateMBTIScore(type1, type2) {
    if (!type1 || !type2) {
      return { score: 50, analysis: { reason: 'MBTI信息不完整', adjustment: 0 } };
    }

    // 使用现有的MBTI匹配器进行计算
    const baseScore = (window.MBTIMatcher ? 
      window.MBTIMatcher.getCompatibilityScore(type1, type2) * 10 : 
      this.estimateMBTIScore(type1, type2));

    let adjustment = 0;
    let reason = '';

    // 分析类型差异
    if (type1[0] === type2[0]) adjustment += 5; // E/I 相同
    if (type1[1] === type2[1]) adjustment += 3; // S/N 相同
    if (type1[2] === type2[2]) adjustment += 5; // T/F 相同
    if (type1[3] === type2[3]) adjustment += 3; // J/P 相同

    if (adjustment > 10) {
      reason = '性格类型高度匹配';
    } else if (adjustment > 5) {
      reason = '性格类型部分匹配';
    } else {
      reason = '性格类型差异较大，但可能互补';
    }

    const finalScore = Math.min(100, Math.max(0, baseScore + adjustment));
    
    return {
      score: finalScore,
      analysis: {
        type1,
        type2,
        reason,
        adjustment,
        compatibilityType: this.getCompatibilityType(type1, type2)
      }
    };
  }

  /**
   * 估算MBTI分数（当MBTI匹配器不可用时）
   */
  estimateMBTIScore(type1, type2) {
    if (type1 === type2) return 90;
    
    let score = 50;
    // 简单的维度比较
    if (type1[0] === type2[0]) score += 15; // E/I
    if (type1[1] === type2[1]) score += 10; // S/N
    if (type1[2] === type2[2]) score += 15; // T/F
    if (type1[3] === type2[3]) score += 10; // J/P
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * 获取兼容性类型
   */
  getCompatibilityType(type1, type2) {
    if (type1 === type2) return 'identical';
    if (this.areComplementaryTypes(type1, type2)) return 'complementary';
    if (this.areSimilarTypes(type1, type2)) return 'similar';
    return 'different';
  }

  /**
   * 判断是否为互补类型
   */
  areComplementaryTypes(type1, type2) {
    // 简单的互补判断逻辑
    const complementaryPairs = [
      ['INTJ', 'ENFJ'], ['ENFJ', 'INTJ'],
      ['ENTP', 'ISFJ'], ['ISFJ', 'ENTP'],
      ['INFJ', 'ESTP'], ['ESTP', 'INFJ'],
      ['INFP', 'ESTJ'], ['ESTJ', 'INFP']
    ];
    
    return complementaryPairs.some(pair => pair[0] === type1 && pair[1] === type2);
  }

  /**
   * 判断是否为相似类型
   */
  areSimilarTypes(type1, type2) {
    // 相似的判断逻辑基于认知功能
    return type1[1] === type2[1] && type1[3] === type2[3]; // 相同的信息处理方式
  }

  /**
   * 计算旅行风格分数
   */
  calculateTravelStyleScore(style1, style2) {
    if (!style1 || !style2) {
      return { score: 50, analysis: { reason: '旅行风格信息不完整', adjustment: 0 } };
    }

    if (style1 === style2) {
      return { 
        score: 90, 
        analysis: { 
          style1, 
          style2, 
          reason: '旅行风格完全一致', 
          adjustment: 0 
        } 
      };
    }

    // 相似风格的匹配
    const similarPairs = [
      ['adventure', 'outdoor'],
      ['relaxing', 'indoor'],
      ['cultural', 'cultural'],
      ['luxury', 'luxury'],
      ['budget', 'budget'],
      ['backpacking', 'outdoor']
    ];

    const isSimilar = similarPairs.some(pair => 
      (pair[0] === style1 && pair[1] === style2) || 
      (pair[0] === style2 && pair[1] === style1)
    );

    if (isSimilar) {
      return { 
        score: 75, 
        analysis: { 
          style1, 
          style2, 
          reason: '旅行风格相似', 
          adjustment: 0 
        } 
      };
    }

    return { 
      score: 40, 
      analysis: { 
        style1, 
        style2, 
        reason: '旅行风格差异较大', 
        adjustment: 0 
      } 
    };
  }

  /**
   * 计算预算兼容性分数
   */
  calculateBudgetScore(budget1, budget2) {
    if (!budget1 || !budget2) {
      return { score: 50, analysis: { reason: '预算信息不完整', adjustment: 0 } };
    }

    if (budget1 === budget2) {
      return { 
        score: 90, 
        analysis: { 
          budget1, 
          budget2, 
          reason: '预算敏感度一致', 
          adjustment: 0 
        } 
      };
    }

    // 预算等级
    const budgetLevels = { 'high': 0, 'medium': 1, 'low': 2 };
    const level1 = budgetLevels[budget1];
    const level2 = budgetLevels[budget2];

    if (level1 === undefined || level2 === undefined) {
      return { score: 50, analysis: { reason: '预算等级无效', adjustment: 0 } };
    }

    const diff = Math.abs(level1 - level2);
    const score = Math.max(20, 90 - diff * 30); // 每级差扣30分

    return { 
      score: score, 
      analysis: { 
        budget1, 
        budget2, 
        reason: `预算敏感度${diff === 1 ? '接近' : '差异较大'}`, 
        adjustment: 0 
      } 
    };
  }

  /**
   * 计算节奏兼容性分数
   */
  calculatePaceScore(pace1, pace2) {
    if (!pace1 || !pace2) {
      return { score: 50, analysis: { reason: '节奏信息不完整', adjustment: 0 } };
    }

    if (pace1 === pace2) {
      return { 
        score: 95, 
        analysis: { 
          pace1, 
          pace2, 
          reason: '旅行节奏完全一致', 
          adjustment: 0 
        } 
      };
    }

    // 相近节奏的匹配
    if ((pace1 === 'fast' && pace2 === 'moderate') || (pace1 === 'moderate' && pace2 === 'fast')) {
      return { 
        score: 75, 
        analysis: { 
          pace1, 
          pace2, 
          reason: '旅行节奏相近', 
          adjustment: 0 
        } 
      };
    }

    if ((pace1 === 'slow' && pace2 === 'moderate') || (pace1 === 'moderate' && pace2 === 'slow')) {
      return { 
        score: 70, 
        analysis: { 
          pace1, 
          pace2, 
          reason: '旅行节奏相近', 
          adjustment: 0 
        } 
      };
    }

    return { 
      score: 30, 
      analysis: { 
        pace1, 
        pace2, 
        reason: '旅行节奏差异很大', 
        adjustment: 0 
      } 
    };
  }

  /**
   * 计算风险兼容性分数
   */
  calculateRiskScore(risk1, risk2) {
    if (!risk1 || !risk2) {
      return { score: 50, analysis: { reason: '风险信息不完整', adjustment: 0 } };
    }

    if (risk1 === risk2) {
      return { 
        score: 90, 
        analysis: { 
          risk1, 
          risk2, 
          reason: '风险承受能力一致', 
          adjustment: 0 
        } 
      };
    }

    if (risk1 === 'medium' || risk2 === 'medium') {
      return { 
        score: 75, 
        analysis: { 
          risk1, 
          risk2, 
          reason: '至少一方风险承受能力适中', 
          adjustment: 0 
        } 
      };
    }

    return { 
      score: 25, 
      analysis: { 
        risk1, 
        risk2, 
        reason: '风险承受能力差异很大', 
        adjustment: 0 
      } 
    };
  }

  /**
   * 计算经验兼容性分数
   */
  calculateExperienceScore(exp1, exp2) {
    if (exp1 === undefined || exp2 === undefined) {
      return { score: 50, analysis: { reason: '经验信息不完整', adjustment: 0 } };
    }

    const diff = Math.abs(exp1 - exp2);
    
    if (diff === 0) {
      return { 
        score: 90, 
        analysis: { 
          exp1, 
          exp2, 
          reason: '独自出行经验相当', 
          adjustment: 0 
        } 
      };
    }

    if (diff <= 2) {
      return { 
        score: 75, 
        analysis: { 
          exp1, 
          exp2, 
          reason: '独自出行经验丰富度相近', 
          adjustment: 0 
        } 
      };
    }

    if (diff <= 5) {
      return { 
        score: 50, 
        analysis: { 
          exp1, 
          exp2, 
          reason: '独自出行经验丰富度有差异', 
          adjustment: 0 
        } 
      };
    }

    return { 
      score: 25, 
      analysis: { 
        exp1, 
        exp2, 
        reason: '独自出行经验丰富度差异很大', 
        adjustment: 0 
      } 
    };
  }

  /**
   * 计算住宿偏好兼容性分数
   */
  calculateAccommodationScore(acc1, acc2) {
    if (!acc1 || !acc2) {
      return { score: 50, analysis: { reason: '住宿偏好信息不完整', adjustment: 0 } };
    }

    if (acc1 === acc2) {
      return { 
        score: 90, 
        analysis: { 
          acc1, 
          acc2, 
          reason: '住宿偏好一致', 
          adjustment: 0 
        } 
      };
    }

    if (acc1 === 'mixed' || acc2 === 'mixed') {
      return { 
        score: 85, 
        analysis: { 
          acc1, 
          acc2, 
          reason: '至少一方接受混合住宿', 
          adjustment: 0 
        } 
      };
    }

    // 特定组合的兼容性
    const compatiblePairs = [
      ['hotel', 'airbnb'],
      ['hostel', 'backpacking'],
      ['airbnb', 'hotel']
    ];

    const isCompatible = compatiblePairs.some(pair => 
      (pair[0] === acc1 && pair[1] === acc2) || 
      (pair[0] === acc2 && pair[1] === acc1)
    );

    if (isCompatible) {
      return { 
        score: 70, 
        analysis: { 
          acc1, 
          acc2, 
          reason: '住宿偏好兼容', 
          adjustment: 0 
        } 
      };
    }

    return { 
      score: 40, 
      analysis: { 
        acc1, 
        acc2, 
        reason: '住宿偏好差异较大', 
        adjustment: 0 
      } 
    };
  }

  /**
   * 计算活动偏好兼容性分数
   */
  calculateActivityScore(activity1, activity2) {
    if (!activity1 || !activity2) {
      return { score: 50, analysis: { reason: '活动偏好信息不完整', adjustment: 0 } };
    }

    if (activity1 === activity2) {
      return { 
        score: 90, 
        analysis: { 
          activity1, 
          activity2, 
          reason: '活动偏好一致', 
          adjustment: 0 
        } 
      };
    }

    if (activity1 === 'mixed' || activity2 === 'mixed') {
      return { 
        score: 85, 
        analysis: { 
          activity1, 
          activity2, 
          reason: '至少一方接受混合活动', 
          adjustment: 0 
        } 
      };
    }

    // 相关活动的匹配
    const relatedPairs = [
      ['outdoor', 'adventure'],
      ['indoor', 'cultural'],
      ['food', 'cultural']
    ];

    const isRelated = relatedPairs.some(pair => 
      (pair[0] === activity1 && pair[1] === activity2) || 
      (pair[0] === activity2 && pair[1] === activity1)
    );

    if (isRelated) {
      return { 
        score: 70, 
        analysis: { 
          activity1, 
          activity2, 
          reason: '活动偏好相关', 
          adjustment: 0 
        } 
      };
    }

    return { 
      score: 50, 
      analysis: { 
        activity1, 
        activity2, 
        reason: '活动偏好不同', 
        adjustment: 0 
      } 
    };
  }

  /**
   * 应用上下文调整
   */
  applyContextualAdjustments(user1, user2, context) {
    let scoreAdjustment = 0;
    const reasons = [];

    // 季节性调整
    if (context.season) {
      const seasonalComp = this.analyzeSeasonalCompatibility(user1, user2, context.season);
      scoreAdjustment += seasonalComp.adjustment;
      reasons.push(seasonalComp.reason);
    }

    // 地点调整
    if (context.location) {
      const locationComp = this.analyzeLocationCompatibility(user1, user2, context.location);
      scoreAdjustment += locationComp.adjustment;
      reasons.push(locationComp.reason);
    }

    // 时间调整
    if (context.timeframe) {
      const timeComp = this.analyzeTimeCompatibility(user1, user2, context.timeframe);
      scoreAdjustment += timeComp.adjustment;
      reasons.push(timeComp.reason);
    }

    return {
      scoreAdjustment,
      reasons
    };
  }

  /**
   * 分析季节兼容性
   */
  analyzeSeasonalCompatibility(user1, user2, season) {
    const pref1 = this.getUserSeasonalPreferences(user1, season);
    const pref2 = this.getUserSeasonalPreferences(user2, season);

    // 计算偏好重叠度
    const overlap = pref1.filter(item => pref2.includes(item)).length;
    const total = new Set([...pref1, ...pref2]).size;

    const adjustment = total > 0 ? Math.round((overlap / total) * 20) - 10 : 0; // -10 to +10 range

    return {
      adjustment,
      reason: `季节性偏好${adjustment > 5 ? '高度' : adjustment > 0 ? '部分' : adjustment < -5 ? '不太' : ''}匹配`
    };
  }

  /**
   * 获取用户季节偏好
   */
  getUserSeasonalPreferences(user, season) {
    const preferences = [];
    
    // 基于MBTI类型添加偏好
    if (user.mbtiType) {
      const mbtiPrefs = this.culturalCompatibility[user.mbtiType.toLowerCase()[0]];
      if (mbtiPrefs) preferences.push(...mbtiPrefs);
    }

    // 基于旅行风格添加偏好
    if (user.travelStyle) {
      preferences.push(user.travelStyle);
    }

    // 基于季节添加偏好
    const seasonalPrefs = this.seasonalPreferences[season] || [];
    preferences.push(...seasonalPrefs);

    return [...new Set(preferences)]; // 去重
  }

  /**
   * 分析地点兼容性
   */
  analyzeLocationCompatibility(user1, user2, location) {
    // 简化的地点兼容性分析
    // 在实际应用中，这里可以连接地理数据库或API
    const adjustment = Math.floor(Math.random() * 10) - 5; // -5 to +5 range
    const reason = '地点兼容性评估';

    return { adjustment, reason };
  }

  /**
   * 分析时间兼容性
   */
  analyzeTimeCompatibility(user1, user2, timeframe) {
    // 简化的时间兼容性分析
    const adjustment = Math.floor(Math.random() * 10) - 5; // -5 to +5 range
    const reason = '时间兼容性评估';

    return { adjustment, reason };
  }

  /**
   * 生成个性化推荐
   */
  generatePersonalizedRecommendations(user1, user2, context) {
    const recommendations = [];
    
    // 基于MBTI的活动推荐
    recommendations.push(...this.getMbtiBasedRecommendations(user1, user2));
    
    // 基于季节的推荐
    if (context.season) {
      recommendations.push(...this.getSeasonalRecommendations(context.season, user1, user2));
    }
    
    // 基于地点的推荐
    if (context.location) {
      recommendations.push(...this.getLocationBasedRecommendations(context.location, user1, user2));
    }
    
    // 基于共同兴趣的推荐
    recommendations.push(...this.getSharedInterestRecommendations(user1, user2));
    
    return [...new Set(recommendations)]; // 去重
  }

  /**
   * 基于MBTI的推荐
   */
  getMbtiBasedRecommendations(user1, user2) {
    const recommendations = [];
    
    // 为每种MBTI类型添加推荐
    [user1, user2].forEach(user => {
      if (user.mbtiType) {
        const type = user.mbtiType.charAt(0).toLowerCase(); // E/I
        const cognitive = user.mbtiType.charAt(1).toLowerCase(); // S/N
        const decision = user.mbtiType.charAt(2).toLowerCase(); // T/F
        const lifestyle = user.mbtiType.charAt(3).toLowerCase(); // J/P
        
        // 添加基于各维度的推荐
        if (this.culturalCompatibility[type]) {
          recommendations.push(...this.culturalCompatibility[type]);
        }
        if (this.culturalCompatibility[cognitive]) {
          recommendations.push(...this.culturalCompatibility[cognitive]);
        }
        if (this.culturalCompatibility[decision]) {
          recommendations.push(...this.culturalCompatibility[decision]);
        }
        if (this.culturalCompatibility[lifestyle]) {
          recommendations.push(...this.culturalCompatibility[lifestyle]);
        }
      }
    });
    
    return recommendations;
  }

  /**
   * 季节性推荐
   */
  getSeasonalRecommendations(season, user1, user2) {
    return this.seasonalPreferences[season] || [];
  }

  /**
   * 地点相关推荐
   */
  getLocationBasedRecommendations(location, user1, user2) {
    // 简化的地点推荐
    return [`适合${location}的活动`, `当地特色体验`];
  }

  /**
   * 共同兴趣推荐
   */
  getSharedInterestRecommendations(user1, user2) {
    const recommendations = [];
    
    // 检查共同的旅行风格
    if (user1.travelStyle === user2.travelStyle) {
      recommendations.push(`${user1.travelStyle}相关的活动`);
    }
    
    // 检查共同的活动偏好
    if (user1.activityPreference === user2.activityPreference) {
      recommendations.push(`${user1.activityPreference}类活动`);
    }
    
    // 检查预算相似度
    if (user1.budgetSensitivity === user2.budgetSensitivity) {
      recommendations.push(`符合${user1.budgetSensitivity}预算的活动`);
    }
    
    return recommendations;
  }

  /**
   * 计算置信度级别
   */
  calculateConfidenceLevel(score, analysis) {
    // 基于分析完整性计算置信度
    const filledFields = Object.keys(analysis).filter(key => 
      analysis[key] && Object.keys(analysis[key]).length > 0
    ).length;
    
    const totalFields = 8; // mbti, travelStyle, budget, pace, risk, experience, accommodation, activity
    const completeness = filledFields / totalFields;
    
    if (score >= 80) {
      return completeness > 0.8 ? 'high' : 'medium';
    } else if (score >= 60) {
      return completeness > 0.6 ? 'medium' : 'low';
    } else {
      return 'low';
    }
  }

  /**
   * 获取匹配洞见
   */
  getMatchInsights(user1, user2, matchResult) {
    const insights = [];
    
    // 强项
    if (matchResult.analysis.mbti.score > 80) {
      insights.push(`MBTI类型高度匹配 (${user1.mbtiType} 和 ${user2.mbtiType})`);
    }
    
    if (matchResult.analysis.pace.score > 85) {
      insights.push(`旅行节奏完美匹配 (${user1.pacePreference} 和 ${user2.pacePreference})`);
    }
    
    // 改进建议
    if (matchResult.analysis.budget.score < 50) {
      insights.push(`预算敏感度差异较大，建议提前沟通消费预期`);
    }
    
    if (matchResult.analysis.risk.score < 40) {
      insights.push(`风险承受能力差异较大，建议规划时考虑双方舒适度`);
    }
    
    // 机会点
    if (matchResult.confidence === 'low') {
      insights.push('更多信息将有助于提高匹配准确性');
    }
    
    return insights;
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IntelligentRecommender;
}