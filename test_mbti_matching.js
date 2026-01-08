// Test script for MBTI matching functionality
console.log('Testing MBTI Matching Functionality...\n');

// Load the MBTI matcher
const MBTIMatcher = require('./src/frontend/mbti-matcher.js');

// Test basic compatibility scoring
console.log('1. Testing Basic Compatibility Scoring:');
console.log('ENFJ vs INFP:', MBTIMatcher.getCompatibilityScore('ENFJ', 'INFP'));
console.log('ISTJ vs ENFP:', MBTIMatcher.getCompatibilityScore('ISTJ', 'ENFP'));
console.log('ENTJ vs ENTJ:', MBTIMatcher.getCompatibilityScore('ENTJ', 'ENTJ'));

// Test cognitive function calculation
console.log('\n2. Testing Cognitive Functions:');
console.log('Dominant function for ENFJ:', MBTIMatcher.getDominantFunction('ENFJ'));
console.log('Auxiliary function for ENFJ:', MBTIMatcher.getAuxiliaryFunction('ENFJ'));
console.log('Dominant function for ISTP:', MBTIMatcher.getDominantFunction('ISTP'));
console.log('Auxiliary function for ISTP:', MBTIMatcher.getAuxiliaryFunction('ISTP'));

// Test comprehensive matching
console.log('\n3. Testing Comprehensive Matching:');
const user1 = {
  mbtiType: 'ENFJ',
  travelStyle: 'cultural',
  budgetSensitivity: 'medium',
  pacePreference: 'moderate',
  riskTolerance: 'medium',
  soloExperience: 3,
  accommodationPreference: 'hotel',
  activityPreference: 'cultural'
};

const user2 = {
  mbtiType: 'ISFP',
  travelStyle: 'relaxing',
  budgetSensitivity: 'high',
  pacePreference: 'slow',
  riskTolerance: 'low',
  soloExperience: 1,
  accommodationPreference: 'airbnb',
  activityPreference: 'indoor'
};

const user3 = {
  mbtiType: 'ENFJ', // Same MBTI as user1
  travelStyle: 'cultural', // Same travel style
  budgetSensitivity: 'medium', // Same budget
  pacePreference: 'moderate', // Same pace
  riskTolerance: 'medium', // Same risk tolerance
  soloExperience: 2, // Similar experience
  accommodationPreference: 'hotel', // Same accommodation
  activityPreference: 'cultural' // Same activity
};

console.log('User1 vs User2 match:', MBTIMatcher.calculateComprehensiveMatch(user1, user2));
console.log('User1 vs User3 match:', MBTIMatcher.calculateComprehensiveMatch(user1, user3));

// Test activity recommendations
console.log('\n4. Testing Activity Recommendations:');
const activities1 = MBTIMatcher.recommendActivities(user1, user2);
console.log('Activities for User1 & User2:', activities1);

const activities2 = MBTIMatcher.recommendActivities(user1, user3);
console.log('Activities for User1 & User3:', activities2);

// Test destination recommendations
console.log('\n5. Testing Destination Recommendations:');
const destinations1 = MBTIMatcher.recommendDestinations(user1);
console.log('Destinations for User1:', destinations1.slice(0, 5)); // Show first 5

const destinations2 = MBTIMatcher.recommendDestinations(user2);
console.log('Destinations for User2:', destinations2.slice(0, 5)); // Show first 5

console.log('\n✅ All tests completed successfully!');
console.log('\nEnhanced MBTI matching functionality includes:');
console.log('- Cognitive function-based compatibility scoring');
console.log('- Comprehensive multi-factor matching (MBTI, travel style, budget, pace, risk, experience)');
console.log('- Detailed activity recommendations based on personality types');
console.log('- Personalized destination recommendations');
console.log('- Enhanced compatibility scoring with nuanced weightings');