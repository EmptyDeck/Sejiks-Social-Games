import * as React from 'react';

export interface HoldCardProps {
  /** `insider` sees the secret word; `chameleon` sees the "you are the chameleon" message. Both look identical until pressed. */
  role: 'insider' | 'chameleon';
  /** The secret word (insiders only). */
  word?: string;
  /** Hint text shown before pressing, e.g. "HOLD TO CHECK YOUR SECRET". */
  hint?: string;
  /** Small explanation under the hint. */
  hintHelp?: string;
  /** Message the chameleon sees while holding. */
  chameleonText?: string;
  chameleonHelp?: string;
  /** Label above the word for insiders, e.g. "The secret word is". */
  wordLabel?: string;
  insiderHelp?: string;
  /** Force the revealed state (for documentation/previews). Normally the reveal happens only while the card is pressed. */
  revealed?: boolean;
}

/**
 * Press-and-hold card that reveals a player's hidden role. Everyone in the room holds the same card the same way, so
 * nobody gives themselves away by staring at their phone. The secret exists only on that player's own phone and is
 * never shown on the shared screen.
 */
export function HoldCard({ role, word, hint = 'HOLD TO CHECK YOUR SECRET', hintHelp = 'Everyone holds it, so nobody looks suspicious.', chameleonText = 'You are the CHAMELEON', chameleonHelp = 'You do not know the word. Describe it vaguely and blend in.', wordLabel = 'The secret word is', insiderHelp = 'Describe it without making it too obvious.', revealed }: HoldCardProps) {
  const cham = role === 'chameleon';
  return (
    <button type="button" className={['cpg-hold', cham && 'cpg-hold--chameleon', revealed && 'cpg-hold--revealed'].filter(Boolean).join(' ')}>
      <span className="cpg-hold__hint">🍃 {hint}<small>{hintHelp}</small></span>
      <span className="cpg-hold__body">
        {cham ? (<><span className="cpg-hold__big">🦎 {chameleonText}</span><span className="cpg-hold__help">{chameleonHelp}</span></>)
              : (<><span className="cpg-hold__small">{wordLabel}</span><span className="cpg-hold__big">{word}</span><span className="cpg-hold__help">{insiderHelp}</span></>)}
      </span>
    </button>
  );
}
