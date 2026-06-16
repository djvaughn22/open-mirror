# Original Word Study

Goal:
Given a Bible reference and an English word or phrase, return the exact Greek or Hebrew word only when local alignment data proves the match.

Rule:
No alignment, no answer.

Correct user flow:
- Reference: John 1:14
- English word: Word
- Result: Greek word, transliteration, Strong's number, grammar/morphology, short meaning

Do not:
- Guess roots from English alone
- Use AI meanings
- Use Google search as the feature
- Claim exact original language from a translation without alignment data

Likely data lane:
- Use open aligned Bible resources such as unfoldingWord ULT / original language resources.
- Generate local JSON from trusted source files.
- App reads local JSON only.
