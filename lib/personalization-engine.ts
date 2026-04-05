import { generatePersonalizedAdvice } from './ai';

export interface UserProfile {
  user_type: 'Student' | 'Employee' | 'Business Owner' | 'Freelancer' | string;
  income_range: '<10k' | '10k-30k' | '30k-70k' | '70k+' | string;
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  financial_goals: string[];
  risk_level: 'Low' | 'Medium' | 'High' | string;
}

/**
 * Personalization Engine: Combines rule-based logic with AI insights.
 */
export async function getPersonalizedInsights(profile: UserProfile, transactionsSummary: string) {
  const ruleBasedAdvice = getRuleBasedAdvice(profile);
  const aiAdvice = await generatePersonalizedAdvice(profile, transactionsSummary);

  // Return a combined list, prioritizing AI-driven dynamic advice first
  return [...aiAdvice, ...ruleBasedAdvice].slice(0, 5);
}

/**
 * Hardcoded expert rules for instant, reliable recommendations.
 */
function getRuleBasedAdvice(profile: UserProfile): any[] {
  const advice: any[] = [];

  // Logic Phase: User Type
  if (profile.user_type === 'Student') {
    advice.push({
      title: "Small Savings SIP",
      description: "Even ₹500/month can grow significantly. Start a small SIP in a Nifty 50 Index Fund.",
      icon: "TrendingUp",
      actionLabel: "Set a Budget",
      actionUrl: "/budgets"
    });
    advice.push({
      title: "Avoid Instant Credit",
      description: "Be cautious with 'Buy Now, Pay Later' apps. High interest can trap you early.",
      icon: "Shield",
      actionLabel: "Learn More",
      actionUrl: "/learning"
    });
  } else if (profile.user_type === 'Employee') {
    advice.push({
      title: "Tax Saving (ELSS)",
      description: "As an employee, consider ELSS mutual funds for your 80C deductions to save tax and grow wealth.",
      icon: "Briefcase",
      actionLabel: "View Analytics",
      actionUrl: "/analytics"
    });
  } else if (profile.user_type === 'Business Owner') {
    advice.push({
      title: "Cash Flow Reserve",
      description: "Keep 12 months of fixed business expenses in a liquid fund for unpredictable cycles.",
      icon: "Wallet",
      actionLabel: "Manage Budgets",
      actionUrl: "/budgets"
    });
  }

  // Logic Phase: Income Range
  if (profile.income_range === '<10k' || profile.income_range === '10k-30k') {
    advice.push({
      title: "Emergency Fund First",
      description: "Focus on building a 3-month survival fund before starting any risky investments.",
      icon: "ShieldCheck",
      actionLabel: "Set Up Budget",
      actionUrl: "/budgets"
    });
  }

  // Logic Phase: Financial Goals
  if (profile.financial_goals.includes('Investing')) {
     advice.push({
       title: "Diversify Portfolio",
       description: `With your ${profile.risk_level} risk appetite, ensure you're not putting more than 15% in a single stock.`,
       icon: "Target",
       actionLabel: "See Analytics",
       actionUrl: "/analytics"
     });
  }

  return advice;
}
