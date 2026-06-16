from pathlib import Path
import re

p = Path("research/original-word-study/source-proof/en_ult_44-JHN_v87.usfm")
text = p.read_text(encoding="utf-8")

# Extract John 1:14 only: from chapter 1 verse 14 to chapter 1 verse 15
m = re.search(r"\\c 1\b.*?\\v 14\b(?P<verse>.*?)(?=\\v 15\b)", text, re.S)
if not m:
    raise SystemExit("STOP: John 1:14 not found.")

verse = m.group("verse")

pattern = re.compile(
    r'\\zaln-s \|'
    r'(?P<attrs>[^\\]+)'
    r'\\\*'
    r'\\w (?P<english>Word)\|[^\\]+\\w\*'
    r'\\zaln-e\\\*',
    re.S,
)

match = pattern.search(verse)
if not match:
    raise SystemExit("STOP: aligned English word 'Word' not found in John 1:14.")

attrs = match.group("attrs")

def attr(name: str) -> str:
    found = re.search(fr'{name}="([^"]+)"', attrs)
    return found.group(1) if found else ""

strongs_raw = attr("x-strong")
strongs_clean = re.sub(r"0$", "", strongs_raw)

print("Reference: John 1:14")
print("English word: Word")
print("Greek word: " + attr("x-content"))
print("Lemma: " + attr("x-lemma"))
print("Strong's raw: " + strongs_raw)
print("Strong's display: " + strongs_clean)
print("Morphology: " + attr("x-morph"))
