import * as React from 'react';

/** The 13 built-in looks. Each one is a complete visual world (palette, fonts, shapes, motion). */
export type ThemeName =
  | 'cartoon-party' | 'old-money' | 'neon-jungle' | 'hackers' | 'arcade-80s' | 'spooky-mansion' | 'space'
  | 'medieval' | 'tropical-ocean' | 'noir-detective' | 'candy-pop' | 'notebook-sketch' | 'game-show';

export interface PartyThemeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which look to apply to everything inside. Defaults to `cartoon-party`. */
  theme?: ThemeName;
  children?: React.ReactNode;
}

/**
 * Root wrapper for every Cedric's Party Games screen. Components read their colors, fonts, radius and motion from the
 * theme variables this wrapper sets, so ALWAYS wrap your UI in it; without it nothing is styled.
 * Pick one `theme` per game and never mix themes inside a screen.
 */
export function PartyTheme({ theme = 'cartoon-party', className, children, ...rest }: PartyThemeProps) {
  return (
    <div {...rest} className={['cpg-root', className].filter(Boolean).join(' ')} data-theme={theme}>
      {children}
    </div>
  );
}
