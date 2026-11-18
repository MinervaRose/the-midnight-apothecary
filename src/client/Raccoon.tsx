export type RaccoonMood = 'waiting' | 'rummaging' | 'surprised' | 'victory' | 'failure';

type RaccoonProps = {
  mood: RaccoonMood;
  className?: string;
};

// Original, small vector character. All expressions share the same silhouette.
export const Raccoon = ({ mood, className = '' }: RaccoonProps) => {
  const surprised = mood === 'surprised';
  const happy = mood === 'victory';
  const smug = mood === 'failure';
  const busy = mood === 'rummaging';

  return <svg className={`raccoon-svg mood-${mood} ${className}`} viewBox="0 0 120 112" aria-hidden="true" focusable="false">
    <path d="M82 76c13-16 29-10 29 3 0 12-18 18-31 9" fill="#788892" stroke="#153a45" strokeWidth="4" strokeLinecap="round" />
    <path d="M92 67c-3 5-4 11-2 17M105 71c-4 5-5 10-4 15" fill="none" stroke="#344d58" strokeWidth="7" />
    <ellipse cx="60" cy="84" rx="31" ry="24" fill="#85979b" stroke="#153a45" strokeWidth="4" />
    <ellipse cx="60" cy="90" rx="17" ry="14" fill="#f3e4c6" />
    <path d="M34 74c-12 5-15 14-7 18M84 74c12 5 15 14 7 18" fill="none" stroke="#153a45" strokeWidth="13" strokeLinecap="round" />
    <path d="M34 74c-12 5-15 14-7 18M84 74c12 5 15 14 7 18" fill="none" stroke="#85979b" strokeWidth="8" strokeLinecap="round" />
    <path d="M41 91l-4 12M79 91l4 12" stroke="#153a45" strokeWidth="9" strokeLinecap="round" />
    <path d="M31 29 28 9 48 19M89 29 92 9 72 19" fill="#75868a" stroke="#153a45" strokeWidth="4" strokeLinejoin="round" />
    <path d="M32 21 33 15 42 21M88 21 87 15 78 21" fill="#f7af9c" />
    <ellipse cx="60" cy="47" rx="39" ry="37" fill="#85979b" stroke="#153a45" strokeWidth="4" />
    <path d="M23 40c12-17 23-15 37-6 14-9 25-11 37 6-3 19-16 25-37 20-21 5-34-1-37-20Z" fill="#344d58" />
    <ellipse cx="60" cy="65" rx="19" ry="13" fill="#f3e4c6" />
    {happy ? <>
      <path d="M38 43q7-8 14 0M68 43q7-8 14 0" fill="none" stroke="#fff8e9" strokeWidth="4" strokeLinecap="round" />
      <path d="M52 69q8 12 16 0" fill="none" stroke="#153a45" strokeWidth="3" strokeLinecap="round" />
    </> : <>
      <ellipse cx="45" cy="44" rx={surprised ? 5 : 4} ry={surprised ? 7 : 5} fill="#fff8e9" />
      <ellipse cx="75" cy="44" rx={surprised ? 5 : 4} ry={surprised ? 7 : 5} fill="#fff8e9" />
      <circle cx={busy ? 47 : smug ? 47 : 45} cy="44" r="2.3" fill="#153a45" />
      <circle cx={busy ? 77 : smug ? 77 : 75} cy="44" r="2.3" fill="#153a45" />
      {surprised ? <>
        <path d="M38 31q7-6 14-1M68 30q7-5 14 1" fill="none" stroke="#153a45" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="60" cy="71" rx="4" ry="6" fill="#153a45" />
      </> : <>
        <path d={smug ? 'M38 32q8 5 15 0M68 32q8-5 15 0' : busy ? 'M38 31l14 3M68 34l14-3' : 'M38 32q7-3 14 0M68 32q7-3 14 0'} fill="none" stroke="#153a45" strokeWidth="3" strokeLinecap="round" />
        <path d={smug ? 'M52 69q9 8 18-2' : busy ? 'M54 69q6 5 12 0' : 'M53 69q7 4 14 0'} fill="none" stroke="#153a45" strokeWidth="3" strokeLinecap="round" />
      </>}
    </>}
    <ellipse cx="60" cy="62" rx="6" ry="4" fill="#153a45" />
    <circle cx="38" cy="58" r="3" fill="#f7af9c" opacity=".85" />
    <circle cx="82" cy="58" r="3" fill="#f7af9c" opacity=".85" />
  </svg>;
};
