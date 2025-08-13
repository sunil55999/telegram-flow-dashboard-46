
import React, { createContext, useContext, useState } from 'react';

export type PlanType = 'free' | 'basic' | 'plus' | 'pro';

export interface PlanFeatures {
  maxPairs: number;
  maxRedirections: number;
  maxMultiSetups: number;
  maxTelegramAccounts: number;
  noAds: boolean;
  editDeleteReply: boolean;
  duplicateFiltering: boolean;
  dedicatedServer: boolean;
  forwardToBots: boolean;
  cloning: boolean;
  transformation: boolean;
  scheduler: boolean;
  cleaner: boolean;
  filters: boolean;
  delay: boolean;
  affiliateKeySwap: boolean;
  userFiltering: boolean;
  watermark: boolean;
  translate: boolean;
  whitelist: boolean;
  blacklist: boolean;
}

export interface PlanLimits {
  pairsUsed: number;
  redirectionsUsed: number;
  multiSetupsUsed: number;
  telegramAccountsUsed: number;
}

interface PlanContextType {
  currentPlan: PlanType;
  features: PlanFeatures;
  limits: PlanLimits;
  isFeatureAvailable: (feature: keyof PlanFeatures) => boolean;
  canCreatePair: () => boolean;
  canEditDeletePair: () => boolean;
  canClonePair: () => boolean;
  canUseRedirection: () => boolean;
  canUseMultiSetup: () => boolean;
  canAddTelegramAccount: () => boolean;
  setPlan: (plan: PlanType) => void;
}

const planConfigs: Record<PlanType, PlanFeatures> = {
  free: {
    maxPairs: 5,
    maxRedirections: 0,
    maxMultiSetups: 0,
    maxTelegramAccounts: 1,
    noAds: false,
    editDeleteReply: false,
    duplicateFiltering: false,
    dedicatedServer: false,
    forwardToBots: false,
    cloning: false,
    transformation: false,
    scheduler: false,
    cleaner: false,
    filters: false,
    delay: false,
    affiliateKeySwap: false,
    userFiltering: false,
    watermark: false,
    translate: false,
    whitelist: false,
    blacklist: false,
  },
  basic: {
    maxPairs: 50,
    maxRedirections: 15,
    maxMultiSetups: 15,
    maxTelegramAccounts: 1,
    noAds: true,
    editDeleteReply: true,
    duplicateFiltering: true,
    dedicatedServer: true,
    forwardToBots: true,
    cloning: true,
    transformation: false,
    scheduler: false,
    cleaner: false,
    filters: false,
    delay: false,
    affiliateKeySwap: false,
    userFiltering: false,
    watermark: false,
    translate: false,
    whitelist: false,
    blacklist: false,
  },
  plus: {
    maxPairs: -1, // unlimited
    maxRedirections: -1,
    maxMultiSetups: -1,
    maxTelegramAccounts: 1,
    noAds: true,
    editDeleteReply: true,
    duplicateFiltering: true,
    dedicatedServer: true,
    forwardToBots: true,
    cloning: true,
    transformation: true,
    scheduler: true,
    cleaner: true,
    filters: true,
    delay: true,
    affiliateKeySwap: false,
    userFiltering: false,
    watermark: false,
    translate: false,
    whitelist: false,
    blacklist: false,
  },
  pro: {
    maxPairs: -1,
    maxRedirections: -1,
    maxMultiSetups: -1,
    maxTelegramAccounts: 3,
    noAds: true,
    editDeleteReply: true,
    duplicateFiltering: true,
    dedicatedServer: true,
    forwardToBots: true,
    cloning: true,
    transformation: true,
    scheduler: true,
    cleaner: true,
    filters: true,
    delay: true,
    affiliateKeySwap: true,
    userFiltering: true,
    watermark: true,
    translate: true,
    whitelist: true,
    blacklist: true,
  },
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [limits, setLimits] = useState<PlanLimits>({
    pairsUsed: 3,
    redirectionsUsed: 8,
    multiSetupsUsed: 5,
    telegramAccountsUsed: 1,
  });

  const features = planConfigs[currentPlan];

  const isFeatureAvailable = (feature: keyof PlanFeatures): boolean => {
    return features[feature] === true;
  };

  const canCreatePair = (): boolean => {
    return features.maxPairs === -1 || limits.pairsUsed < features.maxPairs;
  };

  const canEditDeletePair = (): boolean => {
    return features.editDeleteReply;
  };

  const canClonePair = (): boolean => {
    return features.cloning;
  };

  const canUseRedirection = (): boolean => {
    return features.maxRedirections === -1 || limits.redirectionsUsed < features.maxRedirections;
  };

  const canUseMultiSetup = (): boolean => {
    return features.maxMultiSetups === -1 || limits.multiSetupsUsed < features.maxMultiSetups;
  };

  const canAddTelegramAccount = (): boolean => {
    return features.maxTelegramAccounts === -1 || limits.telegramAccountsUsed < features.maxTelegramAccounts;
  };

  const setPlan = (plan: PlanType) => {
    setCurrentPlan(plan);
  };

  return (
    <PlanContext.Provider value={{
      currentPlan,
      features,
      limits,
      isFeatureAvailable,
      canCreatePair,
      canEditDeletePair,
      canClonePair,
      canUseRedirection,
      canUseMultiSetup,
      canAddTelegramAccount,
      setPlan,
    }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
