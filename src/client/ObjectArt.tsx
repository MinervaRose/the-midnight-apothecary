import type { ObjectId } from './puzzle';

type ObjectArtProps = { object: ObjectId; className?: string };

// Six original toy pieces share one outline, highlight and 64 × 64 canvas.
export const ObjectArt = ({ object, className = '' }: ObjectArtProps) => <svg className={`object-art object-${object} ${className}`} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  {object === 'can' && <>
    <path d="M14 15h36l-3 40c-1 5-29 5-30 0Z" fill="#77bbc3" stroke="#153a45" strokeWidth="3" strokeLinejoin="round" />
    <ellipse cx="32" cy="15" rx="18" ry="6" fill="#c5e5db" stroke="#153a45" strokeWidth="3" />
    <ellipse cx="32" cy="15" rx="8" ry="2" fill="none" stroke="#5c909b" strokeWidth="2" />
    <path d="M20 27h24v17H20z" fill="#fff1bd" stroke="#153a45" strokeWidth="2" />
    <path d="M27 31h10M25 36h14" stroke="#e67757" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 51q12 5 24 0" fill="none" stroke="#3c8796" strokeWidth="2" />
  </>}
  {object === 'paper' && <>
    <path d="M13 10h34l5 40-33 5-6-5Z" fill="#fdf3d2" stroke="#153a45" strokeWidth="3" strokeLinejoin="round" />
    <path d="M13 10v40l6 5V15" fill="#a7d8d0" stroke="#153a45" strokeWidth="2" />
    <path d="M24 18h20v9H24z" fill="#e9765b" stroke="#153a45" strokeWidth="2" />
    <path d="M26 22h16M24 33h21M24 38h21M24 43h14" stroke="#54747a" strokeWidth="2" strokeLinecap="round" />
  </>}
  {object === 'peel' && <>
    <path d="M32 17q-3 24-19 29Q26 44 30 29q-1 18-6 26 18-8 13-27 3 17 14 22Q48 31 37 17Z" fill="#ffcf59" stroke="#153a45" strokeWidth="3" strokeLinejoin="round" />
    <path d="M29 17q3-5 8 0l-1 7h-6Z" fill="#8c6e47" stroke="#153a45" strokeWidth="2" />
    <path d="M31 32q1 12-3 19M39 32q3 9 8 13" fill="none" stroke="#e8a632" strokeWidth="2" strokeLinecap="round" />
  </>}
  {object === 'jar' && <>
    <path d="M20 20h24l4 31q0 6-16 6t-16-6Z" fill="#a7dad2" stroke="#153a45" strokeWidth="3" strokeLinejoin="round" />
    <path d="M17 13h30v9H17z" fill="#e88366" stroke="#153a45" strokeWidth="3" strokeLinejoin="round" />
    <path d="M22 28v19M27 27v23" stroke="#f8ffeb" strokeWidth="3" strokeLinecap="round" opacity=".8" />
    <path d="M20 47q12 6 24 0" fill="none" stroke="#76b6b7" strokeWidth="3" />
  </>}
  {object === 'bottle' && <>
    <path d="M27 9h10v11l7 8v25q0 5-12 5t-12-5V28l7-8Z" fill="#b7dfdb" stroke="#153a45" strokeWidth="3" strokeLinejoin="round" />
    <path d="M26 8h12v6H26z" fill="#e97d67" stroke="#153a45" strokeWidth="2" />
    <path d="M21 35h22v13H21z" fill="#f7d47c" stroke="#153a45" strokeWidth="2" />
    <path d="M27 39h10M28 44h8" stroke="#de7556" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 28v20" stroke="#fff5de" strokeWidth="2" opacity=".8" />
  </>}
  {object === 'gem' && <>
    <path d="M18 13h28l12 15-26 29L6 28Z" fill="#82d8dc" stroke="#153a45" strokeWidth="3" strokeLinejoin="round" />
    <path d="M6 28h52M18 13l8 15 6 29 6-29 8-15" fill="none" stroke="#e8fff1" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M26 28h12" stroke="#2b8795" strokeWidth="3" strokeLinecap="round" />
    <circle cx="51" cy="10" r="3" fill="#fff4ac" />
    <path d="M51 3v14M44 10h14" stroke="#fff4ac" strokeWidth="2" />
  </>}
</svg>;
