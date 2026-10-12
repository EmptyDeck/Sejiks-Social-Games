---
category: Forms
---

# TextField

Input or textarea. `code` = big spaced letters for room code / PIN.

```jsx
<TextField label="Your name" value={name} onChange={setName} maxLength={14} />
<TextField code maxLength={4} placeholder="ABCD" />
```
