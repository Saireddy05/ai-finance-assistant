export const INVESTMENT_LESSONS: Record<number, any> = {
  1: {
    id: 1,
    title: "Financial Psychology & Discipline",
    introduction: "Money decisions are often driven by emotions rather than logic. Understanding your psychological biases is the first step toward long-term wealth.",
    fullContent: [
      {
        heading: "The Emotional Side of Money",
        text: "Most people believe that investing is about math, charts, and data. However, the reality is that your behavior matters more than your IQ. Fear and greed are the primary drivers of market volatility. When markets are rising, greed pushes people to take unnecessary risks (FOMO). When markets fall, fear forces them to sell at the worst possible time."
      },
      {
        heading: "Common Cognitive Biases",
        text: "Our brains are wired for survival, not for modern stock market investing. We suffer from 'Loss Aversion', where the pain of losing ₹1,000 is twice as intense as the joy of gaining ₹1,000. We also fall victim to 'Confirmation Bias', seeking only information that supports our existing beliefs about an investment."
      },
      {
        heading: "The Power of Discipline",
        text: "Building wealth is a marathon, not a sprint. A disciplined investor follows a plan regardless of market noise. This includes automating your savings, resisting the urge to 'time the market', and maintaining a long-term perspective even during downturns."
      }
    ],
    keyPoints: [
      "Behavioral discipline is more important than technical knowledge.",
      "Loss Aversion can lead to poor decision-making during market dips.",
      "Avoid 'FOMO' (Fear Of Missing Out) when certain assets are hyped.",
      "Automating your finances reduces the need for constant willpower."
    ],
    examples: [
      {
        title: "The Panic Seller",
        description: "An investor sees their portfolio drop 15% in a week. Panicked, they sell everything to 'save' what's left. Two months later, the market recovers 20%, but they missed the gain and locked in their losses."
      },
      {
        title: "The FOMO Buyer",
        description: "A friend tells you they made 100% on a obscure cryptocurrency. You buy in at the peak, only for the price to crash the next day because you didn't understand the underlying asset."
      }
    ],
    didYouKnow: "According to various studies, the average individual investor significantly underperforms the market index, primarily due to emotional trading and high turnover.",
    wikipediaLinks: [
      { title: "Behavioral Finance", url: "https://en.wikipedia.org/wiki/Behavioral_economics#Behavioral_finance" },
      { title: "Cognitive Bias", url: "https://en.wikipedia.org/wiki/Cognitive_bias" }
    ],
    quiz: [
      {
        question: "Which bias describes the tendency to feel the pain of losses more than the joy of gains?",
        options: ["Confirmation Bias", "Loss Aversion", "Overconfidence Bias", "Sunken Cost Fallacy"],
        correctIndex: 1,
        explanation: "Loss aversion makes us focus excessively on avoiding losses, often leading to irrational selling during market corrections."
      },
      {
        question: "What is the most critical factor for long-term investment success?",
        options: ["Finding the next 'hidden' stock", "Timing the market perfectly", "Consistent discipline and behavior", "Having the fastest internet connection"],
        correctIndex: 2,
        explanation: "Controlling your emotions and sticking to a consistent plan is statistically the best predictor of wealth growth."
      }
    ]
  },
  2: {
    id: 2,
    title: "Cash Flow & Saving Systems",
    introduction: "You cannot invest what you haven't saved. Mastering your cash flow is the foundation upon which all wealth is built.",
    fullContent: [
      {
        heading: "Pay Yourself First",
        text: "The most successful savers don't save 'what is left' after spending. Instead, they spend 'what is left' after saving. By automating a transfer to your investment account on salary day, you treat your future self as your most important bill."
      },
      {
        heading: "The 50/30/20 Rule",
        text: "A simple yet effective framework for budgeting: 50% of your income goes to Needs (rent, groceries, bills), 30% to Wants (dining out, hobbies, movies), and 20% to Savings and Debt Repayment. Adjust these percentages as your income grows, but keep the structure intact."
      },
      {
        heading: "Managing Expenses",
        text: "Tracking your expenses isn't about being stingy; it's about being intentional. Small daily leaks—like unused subscriptions or high-frequency low-cost purchases—can add up to significant amounts over a year. Use tools to categorize and review your spending monthly."
      }
    ],
    keyPoints: [
      "Automation is the 'cheat code' for consistent saving.",
      "The 50/30/20 rule provides a balanced framework for living and saving.",
      "Tracking expenses helps identify 'leaks' in your cash flow.",
      "An emergency fund is essential before starting aggressive investments."
    ],
    examples: [
      {
        title: "Automated SIP",
        description: "Instead of manually investing, Rahul sets a Systematic Investment Plan (SIP) for the 5th of every month. Whether he is busy or on vacation, his wealth keeps growing."
      }
    ],
    didYouKnow: "Most people who retire wealthy aren't high earners, but high savers. A high income with high expenses leads to zero net worth.",
    wikipediaLinks: [
      { title: "Personal Budget", url: "https://en.wikipedia.org/wiki/Budget#Personal_budgeting" },
      { title: "Savings Account", url: "https://en.wikipedia.org/wiki/Savings_account" }
    ],
    quiz: [
      {
        question: "What does 'Pay Yourself First' mean?",
        options: ["Buying something nice after a hard week", "Saving/Investing before you start spending", "Taking a loan to buy a car", "Paying all your bills on time"],
        correctIndex: 1,
        explanation: "Treating your savings as a non-negotiable expense at the start of the month ensures consistency."
      }
    ]
  },
  3: {
    id: 3,
    title: "Compounding & Inflation",
    introduction: "Einstein called compounding the 'eighth wonder of the world.' Understanding how it works—and how inflation works against it—is vital.",
    fullContent: [
      {
        heading: "The Magic of Compounding",
        text: "Compounding is the process where the value of an investment increases because the earnings on an investment, both capital gains and interest, earn interest as time passes. The key ingredients are time and consistency. The earlier you start, the more 'generations' of money you give your capital to grow."
      },
      {
        heading: "The Silent Thief: Inflation",
        text: "Inflation is the rate at which the general level of prices for goods and services is rising. If your money is sitting in a 3% savings account and inflation is 6%, you are actually losing 3% of your purchasing power every year. Your goal is to achieve a 'Real Rate of Return' (Return - Inflation) that is positive."
      }
    ],
    keyPoints: [
      "Time is an investor's greatest asset.",
      "Compounding rewards patience and long-term holding.",
      "Inflation erodes the value of cash over time.",
      "Aim for investments that beat the inflation rate."
    ],
    examples: [
      {
        title: "Starting at 20 vs 30",
        description: "Investing ₹5,000 monthly from age 20 to 60 can result in a significantly larger corpus than investing ₹15,000 monthly from age 35 to 60, even though the total amount invested in the latter case is higher."
      }
    ],
    didYouKnow: "The 'Rule of 72' is a quick way to estimate how long it will take to double your money. Divide 72 by your annual interest rate.",
    wikipediaLinks: [
      { title: "Compound Interest", url: "https://en.wikipedia.org/wiki/Compound_interest" },
      { title: "Inflation", url: "https://en.wikipedia.org/wiki/Inflation" }
    ],
    quiz: [
      {
        question: "If inflation is 5% and your bank interest is 4%, what is happening to your money?",
        options: ["It is growing by 4%", "It is staying the same", "It is losing 1% purchasing power yearly", "It is doubling every year"],
        correctIndex: 2,
        explanation: "When returns are lower than inflation, the 'real' value of your money decreases."
      }
    ]
  },
  4: {
    id: 4,
    title: "Investment Fundamentals",
    introduction: "Before picking individual stocks, you must understand the broad categories of where money can be parked: Assets.",
    fullContent: [
      {
        heading: "Asset Classes",
        text: "Investments are generally divided into Equity (Stocks), Debt (Bonds/FDs), Gold, and Real Estate. Equity offers high growth but with volatility. Debt offers stability and regular income. Gold acts as a hedge against economic crises."
      },
      {
        heading: "Risk and Return",
        text: "There is no free lunch in finance. If you want higher potential returns, you must accept higher risk. Understanding your 'Risk Profile'—your emotional and financial ability to handle losses—is crucial."
      }
    ],
    keyPoints: [
      "Diversification reduces the impact of a single asset's failure.",
      "Asset allocation should match your financial goals and age.",
      "Equities are for growth; Debt is for preservation.",
      "Never invest in something you don't understand."
    ],
    examples: [
      {
        title: "The Balanced Portfolio",
        description: "Instead of putting all money in stocks, an investor puts 60% in Equity, 30% in Debt, and 10% in Gold. During a crash, their gold and debt provide a cushion."
      }
    ],
    didYouKnow: "Asset allocation is responsible for over 90% of a portfolio's long-term returns, far more than individual stock picking or market timing.",
    wikipediaLinks: [
      { title: "Investment", url: "https://en.wikipedia.org/wiki/Investment" },
      { title: "Asset Allocation", url: "https://en.wikipedia.org/wiki/Asset_allocation" }
    ],
    quiz: [
      {
        question: "What is the primary purpose of Diversification?",
        options: ["To maximize returns in a week", "To reduce risk by spreading investments", "To pay less tax", "To make the portfolio look bigger"],
        correctIndex: 1,
        explanation: "By not putting all eggs in one basket, you protect yourself from total loss if one investment fails."
      }
    ]
  },
  5: {
    id: 5,
    title: "Mutual Funds (Direct vs Regular)",
    introduction: "Mutual funds allow you to pool your money with other investors, managed by professionals. But the way you buy them matters.",
    fullContent: [
      {
        heading: "What are Mutual Funds?",
        text: "A Mutual Fund is a company that pools money from many investors and invests the money in securities such as stocks, bonds, and short-term debt. The combined holdings of the mutual fund are known as its portfolio. Investors buy shares in mutual funds."
      },
      {
        heading: "Expense Ratios and Plans",
        text: "Direct plans have lower expense ratios because they don't include commissions for distributors. Over 20 years, even a 1% difference in expense ratio can result in lakhs of rupees in difference in your final corpus."
      }
    ],
    keyPoints: [
      "Direct plans save you money on commissions.",
      "Index funds are low-cost ways to track the entire market.",
      "SIPs (Systematic Investment Plans) encourage rupee cost averaging.",
      "Check the track record and fund manager's history."
    ],
    examples: [
      {
        title: "The Cost of Commission",
        description: "Two friends invest ₹10,000/month. One uses a 'Regular' plan (1.5% fee) and another uses 'Direct' (0.5% fee). After 20 years, the Direct plan investor has significantly more wealth due to lower fees."
      }
    ],
    didYouKnow: "Most active mutual funds fail to beat the benchmark index (like Nifty 50) over long periods after accounting for fees.",
    wikipediaLinks: [
      { title: "Mutual Fund", url: "https://en.wikipedia.org/wiki/Mutual_fund" },
      { title: "Expense Ratio", url: "https://en.wikipedia.org/wiki/Expense_ratio" }
    ],
    quiz: [
      {
        question: "Why should you prefer a Direct Plan over a Regular Plan?",
        options: ["It gives faster returns", "It has lower fees because no commission is paid", "It is easier to buy", "It is only for experts"],
        correctIndex: 1,
        explanation: "Lower expense ratios mean more of your money remains invested and compounds over time."
      }
    ]
  },
  6: {
    id: 6,
    title: "Stocks & Fundamental Analysis",
    introduction: "Buying a stock means buying a piece of a business. Fundamental analysis helps you determine if that business is worth the price.",
    fullContent: [
      {
        heading: "The Business Model",
        text: "The first step in analysis is understanding how a company makes money. Is it a sustainable business? Does it have a 'Moat'—a competitive advantage that protects it from rivals? Examples include strong brands, high switching costs, or patents."
      },
      {
        heading: "Key Financial Ratios",
        text: "Investors use ratios like P/E (Price to Earnings), P/B (Price to Book), and ROE (Return on Equity) to compare companies within the same industry. However, ratios alone don't tell the whole story; you must read the management's quality and vision."
      }
    ],
    keyPoints: [
      "Buy businesses, not 'tickers'.",
      "Look for companies with consistent profit growth.",
      "Low debt is usually a sign of a healthier company.",
      "Management integrity is often the most overlooked factor."
    ],
    examples: [
      {
        title: "The Coffee Moat",
        description: "Starbucks has a moat because of its brand power. People are willing to pay a premium for their coffee, allowing the company to maintain high margins."
      }
    ],
    didYouKnow: "Warren Buffett, the world's most famous investor, focuses almost entirely on fundamental analysis and holding quality businesses for decades.",
    wikipediaLinks: [
      { title: "Fundamental Analysis", url: "https://en.wikipedia.org/wiki/Fundamental_analysis" },
      { title: "Stock", url: "https://en.wikipedia.org/wiki/Stock" }
    ],
    quiz: [
      {
        question: "What does 'Moat' mean in stock investing?",
        options: ["A literal water feature around the office", "A competitive advantage over rivals", "The company's debt level", "The CEO's salary"],
        correctIndex: 1,
        explanation: "A moat protects a company's profits from being eaten away by competitors."
      }
    ]
  },
  7: {
    id: 7,
    title: "Market Mechanics",
    introduction: "The stock market is a giant auction house. Understanding supply, demand, and liquidity is essential for any participant.",
    fullContent: [
      {
        heading: "How Prices Move",
        text: "At any given time, there are buyers (Bid) and sellers (Ask). When more people want to buy than sell, the price goes up. This is influenced by news, earnings reports, and the general mood of the market (sentiment)."
      },
      {
        heading: "Liquidity and Volume",
        text: "Liquidity refers to how easily you can buy or sell an asset without changing its price. Volume is the number of shares traded. Highly liquid stocks have thousands of buyers and sellers, making it easy to enter or exit trades."
      }
    ],
    keyPoints: [
      "Prices reflect all currently known information.",
      "Bull markets are driven by optimism; Bear markets by fear.",
      "Market cap defines the size of the company (Small, Mid, Large).",
      "Volatility is a normal part of the market cycle."
    ],
    didYouKnow: "The stock market is often a 'leading indicator,' meaning it moves based on what investors expect to happen in the future, not just what is happening today.",
    wikipediaLinks: [
      { title: "Stock Market", url: "https://en.wikipedia.org/wiki/Stock_market" },
      { title: "Order Book", url: "https://en.wikipedia.org/wiki/Order_book" }
    ],
    quiz: [
      {
        question: "When Demand is much higher than Supply, what happens to the price?",
        options: ["It goes down", "It stays the same", "It goes up", "The market closes"],
        correctIndex: 2,
        explanation: "Scarcity and high interest drive prices higher in any auction-based system."
      }
    ]
  },
  8: {
    id: 8,
    title: "Trading & Risk Management",
    introduction: "Trading is the pursuit of short-term profits. Without strict risk management, it is essentially gambling.",
    fullContent: [
      {
        heading: "Risk Reward Ratio",
        text: "For every trade, you should know how much you are willing to lose versus how much you expect to gain. A common ratio is 1:2, meaning you risk ₹1 to make ₹2. This ensures that even if you are right only 50% of the time, you are profitable."
      },
      {
        heading: "Stop-Loss: The Ultimate Tool",
        text: "A stop-loss is an order placed with a broker to buy or sell a specific stock once the stock reaches a certain price. It is designed to limit an investor's loss on a security position. It removes the emotion from the 'exit' decision."
      }
    ],
    keyPoints: [
      "Never trade with money you can't afford to lose.",
      "Keep emotions out of the trading desk.",
      "Plan your trade and trade your plan.",
      "Position sizing: Don't put all your capital in one trade."
    ],
    examples: [
      {
        title: "Small Losses, Big Wins",
        description: "A trader has 10 trades. They lose 6 trades (₹500 each) and win 4 trades (₹1500 each). Total loss: ₹3000. Total win: ₹6000. Net profit: ₹3000. This is the power of risk management."
      }
    ],
    didYouKnow: "Over 90% of retail traders lose money in the stock market, mostly due to a lack of risk management and emotional control.",
    wikipediaLinks: [
      { title: "Risk Management", url: "https://en.wikipedia.org/wiki/Risk_management#Financial_risk_management" },
      { title: "Stop-loss Order", url: "https://en.wikipedia.org/wiki/Stop-loss_order" }
    ],
    quiz: [
      {
        question: "What is a 'Stop-Loss'?",
        options: ["A way to stop the market from crashing", "An automatic order to sell and limit losses", "A strategy to never lose money", "A type of tax"],
        correctIndex: 1,
        explanation: "Stop-losses ensure that a single bad trade doesn't wipe out your entire trading account."
      }
    ]
  },
  9: {
    id: 9,
    title: "Futures & Options (F&O)",
    introduction: "F&O are derivatives—contracts that derive their value from an underlying asset. They are high-leverage and high-risk.",
    fullContent: [
      {
        heading: "Understanding Leverage",
        text: "Leverage allows you to control a large position with a small amount of capital (margin). While it can magnify your profits, it equally magnifies your losses. In some cases, you can lose more than your initial investment."
      },
      {
        heading: "The Purpose of Derivatives",
        text: "Originally, F&O were used for 'hedging'. For example, a farmer might use a future contract to lock in a price for their crop. Today, they are mostly used for speculation in the stock market."
      }
    ],
    keyPoints: [
      "9 out of 10 individual traders lose money in F&O.",
      "Theta decay: Options lose value as they get closer to expiry.",
      "It is a 'zero-sum game': one person's profit is another's loss.",
      "Requires deep technical knowledge and quick execution."
    ],
    didYouKnow: "In India, SEBI (the market regulator) has issued numerous warnings about the high failure rate of retail traders in the F&O segment.",
    wikipediaLinks: [
      { title: "Derivative (finance)", url: "https://en.wikipedia.org/wiki/Derivative_(finance)" },
      { title: "Options", url: "https://en.wikipedia.org/wiki/Option_(finance)" }
    ],
    quiz: [
      {
        question: "Why is F&O considered extremely high risk for beginners?",
        options: ["The platform might crash", "Leverage can wipe out capital very quickly", "The market is too slow", "It is illegal for beginners"],
        correctIndex: 1,
        explanation: "High leverage means even a small move in the opposite direction can result in massive losses."
      }
    ]
  },
  10: {
    id: 10,
    title: "Portfolio & Wealth Building",
    introduction: "The final step is putting it all together. A well-constructed portfolio is your engine for financial freedom.",
    fullContent: [
      {
        heading: "The 4% Rule",
        text: "A wealth-building milestone. If you can live on 4% of your total portfolio value per year, you are technically financially free. This means your corpus is large enough to sustain your lifestyle indefinitely through dividends and growth."
      },
      {
        heading: "Rebalancing",
        text: "Over time, some investments will grow faster than others, changing your original asset allocation. Rebalancing is the process of selling what has grown too much and buying what is currently undervalued to stay within your risk plan."
      }
    ],
    keyPoints: [
      "Focus on the 'Big Picture' (Your total net worth).",
      "Stay invested through cycles; don't chase the latest trend.",
      "Review your portfolio annually or bi-annually, not daily.",
      "The goal of wealth is freedom, not just a number on a screen."
    ],
    examples: [
      {
        title: "Annual Rebalancing",
        description: "An investor's portfolio started as 50-50 Stocks and Bonds. After a bull market, it became 70-30. They sell 20% of stocks (booking profit) and buy bonds to bring it back to 50-50."
      }
    ],
    didYouKnow: "The journey to ₹1 crore takes much longer for the first ₹10 lakhs than the last ₹50 lakhs, because of the accelerated power of compounding on larger sums.",
    wikipediaLinks: [
      { title: "Financial Independence", url: "https://en.wikipedia.org/wiki/Financial_independence" },
      { title: "Wealth Management", url: "https://en.wikipedia.org/wiki/Wealth_management" }
    ],
    quiz: [
      {
        question: "What is 'Rebalancing'?",
        options: ["Adding money to the same stock", "Adjusting your portfolio back to your target asset allocation", "Checking your balance every day", "Closing all your accounts"],
        correctIndex: 1,
        explanation: "Rebalancing forces you to 'buy low and sell high' to maintain your desired risk levels."
      }
    ]
  },
  11: {
    id: 11,
    title: "Taxes & Financial Planning",
    introduction: "It's not what you earn, but what you keep. Tax planning is the legal way to accelerate your wealth building.",
    fullContent: [
      {
        heading: "Understanding Tax Brackets",
        text: "Most modern tax systems are progressive, meaning higher income is taxed at higher percentages. However, many people misunderstand this—the higher rate only applies to the portion of income above the threshold, not the whole amount."
      },
      {
        heading: "Tax-Advantaged Accounts",
        text: "Governments often provide incentives for long-term saving. This includes schemes like PPF, ELSS (in India), or 401k/IRA (in the US). These accounts allow your money to grow tax-free or provide immediate deductions on your taxable income."
      },
      {
        heading: "Capital Gains Tax",
        text: "Profit made from selling assets is taxed differently than regular salary. Long-term gains are typically taxed at a lower rate to encourage long-term holding. Understanding these rules helps you decide the optimal time to sell an investment."
      }
    ],
    keyPoints: [
      "Plan taxes throughout the year, not just in March.",
      "Maximize tax-saving investments first.",
      "Understand the difference between tax avoidance (legal) and tax evasion (illegal).",
      "Keep records of all investments for easy filing."
    ],
    examples: [
      {
        title: "The ELSS Benefit",
        description: "By investing ₹1.5 lakh in an ELSS fund under Section 80C, an investor in the 30% bracket can save ₹45,000 in taxes while participating in the stock market's growth."
      }
    ],
    didYouKnow: "Taxes are typically the largest single expense over a person's lifetime, often exceeding the cost of their home or children's education.",
    wikipediaLinks: [
      { title: "Tax Planning", url: "https://en.wikipedia.org/wiki/Tax_planning" },
      { title: "Capital Gains Tax", url: "https://en.wikipedia.org/wiki/Capital_gains_tax" }
    ],
    quiz: [
      {
        question: "What is 'Tax Avoidance'?",
        options: ["Hiding income from the government", "Using legal ways to minimize tax liability", "Refusing to pay taxes as a protest", "Moving to another country"],
        correctIndex: 1,
        explanation: "Tax avoidance is the legitimate use of the tax regime to your advantage, such as using deductions and credits."
      }
    ]
  },
  12: {
    id: 12,
    title: "Insurance & Risk Protection",
    introduction: "Wealth building is useless without wealth protection. Insurance is the fence that protects your financial garden from life's storms.",
    fullContent: [
      {
        heading: "The Purpose of Insurance",
        text: "Insurance is not an investment; it is a transfer of risk. You pay a small premium to an insurance company so that they bear the burden of a large, catastrophic loss that you could not afford to pay yourself."
      },
      {
        heading: "Essential Coverages",
        text: "Every adult should consider three critical types of insurance: Term Life Insurance (to protect dependents in case of death), Health Insurance (to protect against medical bills which are the #1 cause of bankruptcy), and Disability Insurance (to protect your ability to earn an income)."
      },
      {
        heading: "Avoid 'Mixed' Products",
        text: "Many financial products combine insurance with investment (like ULIPs or Whole Life). These often have high fees and provide low coverage. It is almost always better to buy pure term insurance and invest the rest of the money yourself."
      }
    ],
    keyPoints: [
      "Insurance is a cost, not a profit source.",
      "Buy enough coverage for your family's needs, not just for tax savings.",
      "Disclose all health facts to avoid claim rejection.",
      "Start early to lock in lower premiums."
    ],
    examples: [
      {
        title: "The Medical Emergency",
        description: "A family with a ₹5 lakh health insurance policy is hit with an ₹8 lakh bill. Without insurance, they would have wiped out their entire savings; with it, they only pay the gap."
      }
    ],
    didYouKnow: "In many countries, medical emergencies are the leading cause of personal bankruptcy for middle-class families who didn't have adequate health coverage.",
    wikipediaLinks: [
      { title: "Insurance", url: "https://en.wikipedia.org/wiki/Insurance" },
      { title: "Life Insurance", url: "https://en.wikipedia.org/wiki/Term_life_insurance" }
    ],
    quiz: [
      {
        question: "What is the primary reason to buy Life Insurance?",
        options: ["To get rich quickly", "To provide for dependents after your death", "Because your bank told you to", "To double your money"],
        correctIndex: 1,
        explanation: "Life insurance ensures your loved ones are financially safe if your income is no longer available."
      }
    ]
  }
};

export const TOPICS = Object.values(INVESTMENT_LESSONS).map(l => l.title);
