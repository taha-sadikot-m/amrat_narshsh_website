'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ALLOWED_FORK_EXTRAS } from '../../lib/recipe-forks';
import type { Recipe } from '../../types';

type PublicFork = {
  id: string;
  title: string;
  steps: { instruction: string; tip?: string }[];
  chefTips: string[];
  extras: string[];
  forkCount: number;
  author: string;
};

export function RecipeForks({
  recipe,
  forks,
  signedIn,
}: {
  recipe: Recipe;
  forks: PublicFork[];
  signedIn: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState(recipe.steps.map((step) => step.instruction).join('\n'));
  const [tip, setTip] = useState(recipe.chefTips.join('\n'));
  const [extras, setExtras] = useState('');
  const [parentForkId, setParentForkId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    const response = await fetch(`/api/recipes/${recipe.slug}/forks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        parentForkId,
        steps: instruction
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => ({ instruction: line })),
        chefTips: tip
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
        extras: extras
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(body.error || 'Could not save this fork.');
      return;
    }
    setMessage('Saved. It will show here after the kitchen approves it.');
    setTitle('');
    router.refresh();
  };

  return (
    <section id="recipe-forks" className="mt-12 border-t border-[#F0E4D0] pt-8">
      <h2 className="font-display text-2xl font-bold text-[#3E2723]">Fork this recipe</h2>
      <p className="mt-2 text-sm text-[#8D6E63]">
        Change the steps and publish your version. New ingredients must already be in the recipe, or one of: {ALLOWED_FORK_EXTRAS.join(', ')}.
      </p>
      <ul className="mt-6 space-y-4">
        {forks.map((fork) => (
          <li key={fork.id} className="rounded-2xl bg-white p-4 ring-1 ring-[#F0E4D0]">
            <p className="font-semibold text-[#3E2723]">{fork.title}</p>
            <p className="text-xs text-[#8D6E63]">{fork.author} · forked {fork.forkCount} times</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[#3E2723]">
              {fork.steps.map((step) => (
                <li key={step.instruction}>{step.instruction}</li>
              ))}
            </ol>
            {signedIn && (
              <button
                type="button"
                className="mt-3 text-xs font-bold text-[#D46A1E]"
                onClick={() => {
                  setParentForkId(fork.id);
                  setTitle(`${fork.title} fork`);
                  setInstruction(fork.steps.map((step) => step.instruction).join('\n'));
                  setTip((fork.chefTips || []).join('\n'));
                  setExtras((fork.extras || []).join(', '));
                }}
              >
                Fork this version
              </button>
            )}
          </li>
        ))}
        {forks.length === 0 && <li className="text-sm text-[#8D6E63]">No published forks yet.</li>}
      </ul>

      {signedIn ? (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Name your version"
            className="w-full rounded-xl border border-[#F0E4D0] px-3 py-2 text-sm"
          />
          <textarea
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            rows={5}
            className="w-full rounded-xl border border-[#F0E4D0] px-3 py-2 text-sm"
            aria-label="Steps, one per line"
          />
          <textarea
            value={tip}
            onChange={(event) => setTip(event.target.value)}
            rows={2}
            className="w-full rounded-xl border border-[#F0E4D0] px-3 py-2 text-sm"
            aria-label="Tips, one per line"
          />
          <input
            value={extras}
            onChange={(event) => setExtras(event.target.value)}
            placeholder="Extra ingredients, separated by commas"
            className="w-full rounded-xl border border-[#F0E4D0] px-3 py-2 text-sm"
          />
          {message && <p className="text-sm text-[#3E2723]">{message}</p>}
          <button type="submit" className="rounded-lg bg-[#D46A1E] px-4 py-2 text-sm font-bold text-white">
            Submit fork
          </button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-[#8D6E63]">Sign in with your phone to fork this recipe.</p>
      )}
    </section>
  );
}
