export type RaccoonMood = 'waiting' | 'rummaging' | 'surprised' | 'victory' | 'failure';

type RaccoonProps = { mood: RaccoonMood; className?: string };

// One round, wide-eyed raccoon silhouette for the playfield, splash and visits.
export const Raccoon = ({ mood, className = '' }: RaccoonProps) => {
  const surprised = mood === 'surprised';
  const happy = mood === 'victory';
  const smug = mood === 'failure';
  const busy = mood === 'rummaging';
  const look = busy ? 5 : smug ? 3 : 0;

  return <svg className={`raccoon-svg mood-${mood} ${className}`} viewBox="0 0 190 180" aria-hidden="true" focusable="false">
    <path d="M125 131c26-27 59-11 54 16-3 20-33 27-56 3" fill="#8b9998" stroke="#173b44" strokeWidth="6" strokeLinejoin="round" />
    <path d="M145 120q-7 17 0 33M163 126q-7 16-1 30M176 139q-8 7-10 15" fill="none" stroke="#354c54" strokeWidth="12" strokeLinecap="round" />
    <path d="M132 138q11 22 31 21" fill="none" stroke="#c3cebf" strokeWidth="5" strokeLinecap="round" />
    <ellipse cx="88" cy="140" rx="45" ry="35" fill="#899a98" stroke="#173b44" strokeWidth="6" />
    <ellipse cx="87" cy="149" rx="25" ry="20" fill="#f7e6c9" />
    <path d="M58 163q-13 13-18 7M114 163q15 13 20 5" fill="none" stroke="#173b44" strokeWidth="10" strokeLinecap="round" />
    <path d="M64 123q-14 7-18 21M112 123q15 7 19 20" fill="none" stroke="#173b44" strokeWidth="18" strokeLinecap="round" />
    <circle cx="45" cy="146" r="12" fill="#899a98" stroke="#173b44" strokeWidth="5" />
    <circle cx="132" cy="146" r="12" fill="#899a98" stroke="#173b44" strokeWidth="5" />
    <path d="M38 57 28 15q20 2 34 23M120 38q17-31 37-32l-8 53" fill="#879997" stroke="#173b44" strokeWidth="6" strokeLinejoin="round" />
    <path d="M40 41 36 24q10 4 16 13M135 33q10-13 16-17l-3 23" fill="#f4a396" />
    <path d="M89 25c34 0 62 24 62 57 0 36-29 62-64 62-37 0-62-26-62-61 0-34 27-58 64-58Z" fill="#91a4a0" stroke="#173b44" strokeWidth="6" />
    <path d="M43 58q16-27 41-22" fill="none" stroke="#cdd6c5" strokeWidth="7" strokeLinecap="round" />
    <path d="M37 77q16-31 48-17 35-19 58 9-3 27-30 34-13-3-27-7-14 5-26 6Q40 95 37 77Z" fill="#364f57" />
    <ellipse cx="88" cy="111" rx="35" ry="25" fill="#f9e9cc" />
    <ellipse cx="62" cy="82" rx="17" ry={surprised ? 22 : 19} fill="#fff9ea" />
    <ellipse cx="111" cy="80" rx="17" ry={surprised ? 22 : 19} fill="#fff9ea" />
    {happy ? <>
      <path d="M51 82q11-12 22 0M100 80q11-12 22 0" fill="none" stroke="#173b44" strokeWidth="5" strokeLinecap="round" />
    </> : <>
      <ellipse cx={64 + look} cy="84" rx={surprised ? 5 : 6} ry={surprised ? 7 : 9} fill="#173b44" />
      <ellipse cx={113 + look} cy="82" rx={surprised ? 5 : 6} ry={surprised ? 7 : 9} fill="#173b44" />
      <circle cx={62 + look} cy="79" r="2.5" fill="white" />
      <circle cx={111 + look} cy="77" r="2.5" fill="white" />
    </>}
    <path d={surprised ? 'M50 53q11-8 23-2M103 51q12-7 23 1' : smug ? 'M50 56q13 7 23 0M102 55q12-5 23-1' : busy ? 'M49 55l23 5M103 60l23-7' : 'M49 56q11-6 23-1M103 54q12-5 23 0'} fill="none" stroke="#173b44" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="87" cy="105" rx="10" ry="7" fill="#173b44" />
    {surprised ? <ellipse cx="87" cy="126" rx="6" ry="8" fill="#173b44" /> :
      <path d={happy ? 'M69 119q18 24 37-1' : smug ? 'M71 122q19 12 37-4' : busy ? 'M76 124q12 8 23-2' : 'M76 123q11 8 23-1'} fill="none" stroke="#173b44" strokeWidth="4" strokeLinecap="round" />}
    <circle cx="50" cy="108" r="6" fill="#f4aa99" opacity=".7" />
    <circle cx="126" cy="106" r="6" fill="#f4aa99" opacity=".7" />
    {smug && <path d="M101 122l-3 6 6-2" fill="#fff9ea" stroke="#173b44" strokeWidth="2" />}
  </svg>;
};
