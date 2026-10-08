import re

with open('client/src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def find_block(name):
    start = -1
    for i, line in enumerate(lines):
        if line.startswith('const ' + name) or line.startswith('export const ' + name) or line.startswith('let ' + name):
            start = i
            break
    if start == -1: return None, None
    depth = 0
    started = False
    for i in range(start, len(lines)):
        for c in lines[i]:
            if c in '{[': depth += 1; started = True
            elif c in '}]':
                depth -= 1
                if started and depth == 0:
                    return start, i
    return None, None

to_remove = ['CUSTOM_PUZZLES', 'MEDIUM_THRESH', 'GYM_OPTION_LABEL', 'TENTH_UNITS', 'VM_ROW_COLORS', 'DIFF_LABELS', 'GYM_REMEDIATION_RUN', 'GYM_ALL_KEYS', 'CH22_AUTO_ADVANCE_MS', 'CH23_AUTO_ADVANCE_MS', 'CH24_AUTO_ADVANCE_MS']

extracted = []
for name in to_remove:
    s, e = find_block(name)
    if s is not None:
        extracted.append((s, e, name))

extracted.sort(reverse=True)
for s, e, name in extracted:
    # Just blank them out to see
    for i in range(s, e+1):
        lines[i] = ''

with open('client/src/App.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"Removed {len(extracted)} additional huge constants.")
