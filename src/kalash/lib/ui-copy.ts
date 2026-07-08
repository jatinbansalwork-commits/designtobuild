/**
 * Canonical Kalash UI strings with enforced casing.
 * @see .cursor/rules/kalash-ui-copy.mdc
 */
export const UI_COPY = {
  nav: {
    home: "Home",
    dashboard: "Dashboard",
    transactions: "Transactions",
  },
  header: {
    goldBuyPrice: "Gold Buy Price",
    dropped: "Dropped",
  },
  metrics: {
    totalSaving: "Total Saving",
    goldInLocker: "Gold in Locker",
    btcRewards: "BTC Rewards",
  },
  cta: {
    saveMore: "Save More",
    saveNow: "Save Now",
    startSaving: "Start Saving",
    apply: "Apply",
    viewBreakdown: "View Breakdown",
    addManually: "Add Manually",
    updating: "Updating…",
  },
  screens: {
    buyGold: "Buy Gold",
    getExtraGold: "Get Extra Gold",
    paymentBreakdown: "Payment Breakdown",
  },
  toggles: {
    inRupees: "In Rupees",
    inGrams: "In Grams",
  },
  streak: {
    missedDailyBonus:
      "Uh-Oh, you missed your chance at finishing the Daily Bonus streak!",
    missedEyebrow: "Uh-Oh",
    missedTitle: "You missed your chance",
    missedDetail: "at finishing the Daily Bonus streak",
    nextRewardLabel: (day: number) => `Day ${day} reward`,
    nextRewardName: "Bitcoin",
    continueRewards: "Continue on the journey to win rewards",
    saveToContinueStreak: (amount: number) =>
      `Save ₹${amount.toLocaleString("en-IN")} to Restart your streak`,
    cardTitle: "Weekly Streak",
    cardProgress: (completed: number, total: number) =>
      `${completed} of ${total} days`,
  },
  promo: {
    kalashRecommendation: "Kalash Recommendation",
    exclusivePromo: "Buy above ₹1000 and get 3% extra gold",
    exclusiveBadge: "Exclusive",
    rewindJourney: "Rewind your journey",
  },
  goldReward: {
    assured: "assured",
    headline: "₹100 Gold Reward",
    subtitle: "on your next gold saving of ₹1000 or above",
    questPattern: "GOLD QUEST",
  },
  spins: {
    title: (count: number) => `${count} Spins Available to Play`,
    subtitle: "Play and win rewards",
  },
  exploreSavings: {
    titleLead: "Explore",
    titleAccent: "Savings in Gold",
    subtitle: "Choose when and how you want to save",
    daily: {
      eyebrow: "Daily Savings",
      headline: "Save in gold automatically",
      subline: "Start with ₹10/daily",
      bonusLabel: "+₹10",
      bonusLabelAlt: "+10%",
      cta: "Complete Setup",
    },
    weekly: {
      title: "Weekly Savings",
      description: "Save one time per week",
    },
    monthly: {
      title: "Monthly Savings",
      description: "Save one time per month",
    },
    instant: {
      title: "Instant Savings",
      description: "Save anytime",
    },
  },
  ticker: {
    investedInGold: "Your savings are invested in 24K gold",
    hallmarked: "100% Hallmarked",
    cryptoRewards: "Get rewarded in crypto",
    safeSecure: "Safe & Secure",
    pureGoldDetail: "(99.9%) Pure Gold",
  },
  livePrice: {
    buyPrice: (price: string) => `Live | Buy Price: ₹ ${price}/gm`,
    refreshing: "Refreshing live price",
    validFor: (timer: string) => `Valid for: ${timer}`,
    priceUpdated: "Price updated",
    totalAdjusted: "Total adjusted to latest live rate",
    updatingLivePrice: "Updating live price…",
    priceLocked: (timer: string) => `Price locked · ${timer}`,
    priceExpiring: (timer: string) => `Price lock expiring · ${timer}`,
  },
  breakdown: {
    goldWeight: "Gold weight",
    liveBuyRate: "Live buy rate",
    goldValueExclGst: "Gold value (excl. GST)",
    youPay: "You pay",
    rateNote:
      "Rate sourced from live market feed. Total may adjust when the lock refreshes every 2 minutes.",
  },
  badges: {
    bestValue: "BEST VALUE",
    popular: "Popular",
    coupon: "Coupon",
    inclGst: "Incl. (GST)",
  },
  coupons: {
    flashdeal75: {
      code: "FLASHDEAL75",
      description:
        "Get ₹75 cashback as gold rewards. Valid only once per user on a saving of ₹1,000 in gold",
    },
    gold10: {
      code: "GOLD10",
      description:
        "Get 10% extra gold on your first save above ₹2,000 this week.",
    },
  },
  weekday: ["We", "Th", "Fr", "Sa", "Su", "Mo", "Tu"] as const,
  feedback: {
    title: "Your opinion matters",
    subtitle: "Tell us about your Kalash experience",
    cta: "Tell Us Now",
  },
} as const;
