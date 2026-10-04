export type ForkStep = { instruction: string; tip?: string };

export type ForkDraft = {
  title: string;
  steps: ForkStep[];
  chefTips: string[];
  extras: string[];
  parentIngredients: readonly string[];
  allowedExtras: readonly string[];
};

export type StoredFork = {
  id: string;
  status: string;
  parentForkId: string | null;
};

export const ALLOWED_FORK_EXTRAS = ['lemon', 'corn', 'coriander', 'ginger', 'curry leaves', 'jaggery'] as const;

export function validateRecipeFork(draft: ForkDraft): { ok: true } | { ok: false; error: string } {
  if (!draft.title.trim()) return { ok: false, error: 'Add a title.' };
  if (draft.steps.length === 0 || draft.steps.some((step) => !step.instruction.trim())) {
    return { ok: false, error: 'Add at least one step.' };
  }
  const parent = draft.parentIngredients.join(' ').toLowerCase();
  const allowed = new Set(draft.allowedExtras.map((item) => item.toLowerCase()));
  const blocked = draft.extras.map((item) => item.trim()).filter(Boolean).find((item) => {
    const value = item.toLowerCase();
    return !parent.includes(value) && !allowed.has(value);
  });
  if (blocked) return { ok: false, error: `${blocked} is not allowed on this recipe.` };
  return { ok: true };
}

export function rankForks<T extends StoredFork>(forks: readonly T[]) {
  const approved = forks.filter((fork) => fork.status === 'approved');
  return approved
    .map((fork) => ({
      ...fork,
      forkCount: forks.filter((item) => item.parentForkId === fork.id).length,
    }))
    .sort((a, b) => b.forkCount - a.forkCount);
}
