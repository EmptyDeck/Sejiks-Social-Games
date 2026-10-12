# Chameleon — design notes (v2, after owner feedback)

v1 (zero-shot) was built from the PPTX word lists alone and got most of the *feel* wrong; the owner's feedback is in `../../PROMPT-TEMPLATE.md` (gap table). v2 assumptions:

1. **Sofa game, spoken aloud.** Phones carry: the category's 36-word grid (same for everyone), a hold-to-reveal secret (same gesture for everyone), the first-speaker banner, optional voting, and leader controls. No typed clues, no timers, no rounds, no scores.
2. **Leader** = phone that answered "Are you Cedric?" with the PIN (or the laptop's big screen). Setup screen: voting on/off (default on), chameleons 1..n-1 (default 1; solo may use 1), categories (all on by default, includes the sensitive ones). "Deal the word".
3. **Play screen:** everyone checks their secret (hold), taps "seen" (just a counter), the leader can pick the first speaker at random or tap a name. Then "Start voting" (if enabled) or "Reveal now".
4. **Vote:** everyone taps a suspect (not self; changeable). Leader taps "Show the result". The k most-voted (k = number of chameleons, ties count) that are real chameleons are *caught* → they each tap a word on the grid; leader taps "Show the answer".
5. **Result:** chameleons, the word (highlighted in the grid), guesses ✔/✖, vote tally. Leader: Next word / Change options / Back to lobby. Words don't repeat within a session.
6. **Solo test:** with one player everything works (can be chameleon or insider via the option; voting finishes with no votes).
7. Words are the owner's PPTX lists (14 × 36) with Korean translations; typos fixed (see v1 notes in git history: "North Koreans", "Murder", "Beyoncé", duplicate "Sickness" etc.).

Open questions for the owner: (a) "vote for the vocabulary" — I read it as the chameleon picking the word from the grid, and players voting for the suspect; tell me if you meant something else. (b) Should insiders also see which cell is the secret while holding (done) or only the word text? (c) Multiple chameleons don't know each other (classic) — OK?
