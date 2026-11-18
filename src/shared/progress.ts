export const rewardMilestones = [
  { id: 'moon-crystal', name: 'Moon Crystal', streak: 1 },
  { id: 'apprentice-star', name: 'Apprentice Star', streak: 3 },
  { id: 'familiar-charm', name: 'Enchanted Familiar Charm', streak: 7 },
] as const;

export type RewardId = (typeof rewardMilestones)[number]['id'];
export type StoredProgress = {
  completedDates: string[];
  longestStreak: number;
  unlockedRewards: RewardId[];
};
export type ProgressSnapshot = {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  moonCrystals: number;
  completedToday: boolean;
  unlockedRewards: RewardId[];
  nextReward: { id: RewardId; name: string; daysRemaining: number } | null;
};

export const emptyProgress = (): StoredProgress => ({
  completedDates: [],
  longestStreak: 0,
  unlockedRewards: [],
});

const previousDate = (dateKey: string): string => {
  const day = Date.parse(`${dateKey}T00:00:00.000Z`);
  return new Date(day - 86_400_000).toISOString().slice(0, 10);
};

export const streakEndingOn = (
  dates: readonly string[],
  dateKey: string
): number => {
  const completed = new Set(dates);
  let streak = 0;
  let cursor = dateKey;
  while (completed.has(cursor)) {
    streak += 1;
    cursor = previousDate(cursor);
  }
  return streak;
};

export const progressSnapshot = (
  progress: StoredProgress,
  today: string
): ProgressSnapshot => {
  const currentStreak = progress.completedDates.includes(today)
    ? streakEndingOn(progress.completedDates, today)
    : streakEndingOn(progress.completedDates, previousDate(today));
  const next = rewardMilestones.find(
    (milestone) => !progress.unlockedRewards.includes(milestone.id)
  );
  return {
    currentStreak,
    longestStreak: progress.longestStreak,
    totalCompleted: progress.completedDates.length,
    moonCrystals: progress.completedDates.length,
    completedToday: progress.completedDates.includes(today),
    unlockedRewards: [...progress.unlockedRewards],
    nextReward: next
      ? {
          id: next.id,
          name: next.name,
          daysRemaining: Math.max(1, next.streak - currentStreak),
        }
      : null,
  };
};

export const completeDate = (
  progress: StoredProgress,
  today: string
): {
  progress: StoredProgress;
  newlyCompleted: boolean;
  newlyUnlocked: RewardId[];
} => {
  if (progress.completedDates.includes(today)) {
    return { progress, newlyCompleted: false, newlyUnlocked: [] };
  }
  const completedDates = [...progress.completedDates, today].sort();
  const streak = streakEndingOn(completedDates, today);
  const longestStreak = Math.max(progress.longestStreak, streak);
  const newlyUnlocked = rewardMilestones
    .filter((milestone) =>
      milestone.id === 'moon-crystal'
        ? completedDates.length === 1
        : streak >= milestone.streak &&
          !progress.unlockedRewards.includes(milestone.id)
    )
    .map((milestone) => milestone.id);
  return {
    progress: {
      completedDates,
      longestStreak,
      unlockedRewards: [...progress.unlockedRewards, ...newlyUnlocked],
    },
    newlyCompleted: true,
    newlyUnlocked,
  };
};

export const parseProgress = (
  raw: string | null | undefined
): StoredProgress => {
  if (raw == null) return emptyProgress();
  const data: unknown = JSON.parse(raw);
  if (
    typeof data !== 'object' ||
    data === null ||
    !('completedDates' in data) ||
    !Array.isArray(data.completedDates) ||
    !data.completedDates.every((date: unknown) => typeof date === 'string') ||
    !('longestStreak' in data) ||
    typeof data.longestStreak !== 'number' ||
    !('unlockedRewards' in data) ||
    !Array.isArray(data.unlockedRewards) ||
    !data.unlockedRewards.every((id: unknown) =>
      rewardMilestones.some((reward) => reward.id === id)
    )
  ) {
    throw new Error('Stored progress is invalid');
  }
  return {
    completedDates: data.completedDates,
    longestStreak: data.longestStreak,
    unlockedRewards: data.unlockedRewards,
  };
};
