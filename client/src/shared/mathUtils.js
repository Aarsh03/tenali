// Auto-extracted math utilities (Chapters 1-24 and more)

export function changeXp(delta) {
  const current = getLocalXp();
  const next = Math.max(0, current + delta);
  setLocalXp(next);
  return next;
}

export function setLocalXp(val) {
  try { localStorage.setItem('tenali_xp', val.toString()); } catch {}
  // dispatch event to sync UI if needed
  window.dispatchEvent(new CustomEvent('tenali_xp_update', { detail: { xp: val } }));
}

export function getLocalXp() {
  try {
    const val = localStorage.getItem('tenali_xp');
    return val ? parseInt(val, 10) : 0;
  } catch { return 0; }
}

export function getApiPathForType(type) {
  return `${type}-api`
}

export function fetchQuestionForType(type, difficulty, qIndex = 0, sessionGoal = 'standard') {
  // Map difficulty levels to numeric step values for some puzzle types
  const diffMap = { easy: 1, medium: 2, hard: 3 }
  const urls = {
    // Math puzzles with difficulty parameters
    basicarith: `${API}/basicarith-api/question?difficulty=${difficulty}`,
    addition: `${API}/addition-api/question?digits=${diffMap[difficulty] || 1}`,
    quadratic: `${API}/quadratic-api/question?difficulty=${difficulty}`,
    // Multiply: random multiplication table (2-9)
    multiply: `${API}/multiply-api/question?table=${Math.floor(Math.random() * 8) + 2}`,
    // Square root: step parameter mapped to difficulty (easy: 1-10, medium: 11-35, hard: 36-60)
    sqrt: `${API}/sqrt-api/question?step=${difficulty === 'easy' ? Math.floor(Math.random() * 10) + 1 : difficulty === 'medium' ? Math.floor(Math.random() * 25) + 11 : Math.floor(Math.random() * 25) + 36}`,
    polymul: `${API}/polymul-api/question?difficulty=${difficulty}`,
    polyfactor: `${API}/polyfactor-api/question?difficulty=${difficulty}`,
    primefactor: `${API}/primefactor-api/question?difficulty=${difficulty}`,
    qformula: `${API}/qformula-api/question?difficulty=${difficulty}`,
    simul: `${API}/simul-api/question?difficulty=${difficulty}`,
    funceval: `${API}/funceval-api/question?difficulty=${difficulty}`,
    lineq: `${API}/lineq-api/question?difficulty=${difficulty}`,
    // Trivia puzzles without difficulty (use defaults or random)
    gk: `${API}/gk-api/question`,
    vocab: `${API}/vocab-api/question?difficulty=${difficulty}`,
    // Fraction addition puzzle
    fractionadd: `${API}/fractionadd-api/question?difficulty=${difficulty}`,
    // Surds puzzle
    surds: `${API}/surds-api/question?difficulty=${difficulty}`,
    // Indices puzzle
    indices: `${API}/indices-api/question?difficulty=${difficulty}`,
    // Sequences & Series
    sequences: `${API}/sequences-api/question?difficulty=${difficulty}`,
    // Ratio & Proportion
    ratio: `${API}/ratio-api/question?difficulty=${difficulty}`,
    // Percentages
    percent: `${API}/percent-api/question?difficulty=${difficulty}`,
    // Sets
    sets: `${API}/sets-api/question?difficulty=${difficulty}`,
    trig: `${API}/trig-api/question?difficulty=${difficulty}`,
    ineq: `${API}/ineq-api/question?difficulty=${difficulty}`,
    coordgeom: `${API}/coordgeom-api/question?difficulty=${difficulty}`,
    prob: `${API}/prob-api/question?difficulty=${difficulty}`,
    stats: `${API}/stats-api/question?difficulty=${difficulty}`,
    matrix: `${API}/matrix-api/question?difficulty=${difficulty}`,
    vectors: `${API}/vectors-api/question?difficulty=${difficulty}`,
    dotprod: `${API}/dotprod-api/question?difficulty=${difficulty}`,
    transform: `${API}/transform-api/question?difficulty=${difficulty}`,
    mensur: `${API}/mensur-api/question?difficulty=${difficulty}`,
    bearings: `${API}/bearings-api/question?difficulty=${difficulty}`,
    log: `${API}/log-api/question?difficulty=${difficulty}`,
    diff: `${API}/diff-api/question?difficulty=${difficulty}`,
    bases: `${API}/bases-api/question?difficulty=${difficulty}`,
    circleth: `${API}/circleth-api/question?difficulty=${difficulty}`,
    integ: `${API}/integ-api/question?difficulty=${difficulty}`,
    stdform: `${API}/stdform-api/question?difficulty=${difficulty}`,
    bounds: `${API}/bounds-api/question?difficulty=${difficulty}`,
    sdt: `${API}/sdt-api/question?difficulty=${difficulty}`,
    variation: `${API}/variation-api/question?difficulty=${difficulty}`,
    hcflcm: `${API}/hcflcm-api/question?difficulty=${difficulty}`,
    profitloss: `${API}/profitloss-api/question?difficulty=${difficulty}`,
    rounding: `${API}/rounding-api/question?difficulty=${difficulty}`,
    binomial: `${API}/binomial-api/question?difficulty=${difficulty}`,
    complex: `${API}/complex-api/question?difficulty=${difficulty}`,
    angles: `${API}/angles-api/question?difficulty=${difficulty}`,
    triangles: `${API}/triangles-api/question?difficulty=${difficulty}`,
    congruence: `${API}/congruence-api/question?difficulty=${difficulty}`,
    pythag: `${API}/pythag-api/question?difficulty=${difficulty}&q=${qIndex}`,
    polygons: `${API}/polygons-api/question?difficulty=${difficulty}`,
    similarity: `${API}/similarity-api/question?difficulty=${difficulty}`,
    squaring: `${API}/squaring-api/question?difficulty=${difficulty}`,
    lineareq: `${API}/lineareq-api/question?difficulty=${difficulty}`,
    decimals: `${API}/decimals-api/question?difficulty=${difficulty}`,
    permcomb: `${API}/permcomb-api/question?difficulty=${difficulty}`,
    limits: `${API}/limits-api/question?difficulty=${difficulty}`,
    invtrig: `${API}/invtrig-api/question?difficulty=${difficulty}`,
    remfactor: `${API}/remfactor-api/question?difficulty=${difficulty}`,
    heron: `${API}/heron-api/question?difficulty=${difficulty}`,
    shares: `${API}/shares-api/question?difficulty=${difficulty}`,
    banking: `${API}/banking-api/question?difficulty=${difficulty}`,
    gst: `${API}/gst-api/question?difficulty=${difficulty}`,
    section: `${API}/section-api/question?difficulty=${difficulty}`,
    linprog: `${API}/linprog-api/question?difficulty=${difficulty}`,
    circmeasure: `${API}/circmeasure-api/question?difficulty=${difficulty}`,
    conics: `${API}/conics-api/question?difficulty=${difficulty}`,
    diffeq: `${API}/diffeq-api/question?difficulty=${difficulty}`,
    tatsavit: `${API}/tatsavit-api/question?difficulty=${difficulty}`,
  }
  const url = urls[type] || `${API}/${type}-api/question?difficulty=${difficulty}`
  const separator = url.includes('?') ? '&' : '?'
  const finalUrl = `${url}${separator}goal=${sessionGoal}`
  return fetch(finalUrl, { headers: { 'Authorization': authGetToken() ? `Bearer ${authGetToken()}` : '' } }).then(r => r.json())
}

export function coeffsToPolyStr(coeffs) {
  const parts = [];
  const numCoeffs = coeffs.map(Number);
  for (let i = numCoeffs.length - 1; i >= 0; i--) {
    const c = numCoeffs[i];
    if (c === 0 && numCoeffs.length > 1) continue;
    const sup = (n) => String(n).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
    const varPart = i === 0 ? '' : i === 1 ? 'x' : `x${sup(i)}`;
    if (parts.length === 0) {
      parts.push(c === 1 && i > 0 ? varPart : c === -1 && i > 0 ? `-${varPart}` : `${c}${varPart}`);
    } else {
      const sign = c > 0 ? '+' : '-';
      const abs = Math.abs(c);
      parts.push(`${sign} ${abs === 1 && i > 0 ? varPart : `${abs}${varPart}`}`);
    }
  }
  return parts.join(' ') || '0';
}

export function pickNextGym(stats, prevKey, streakLen, lastCorrect, consecCorrect) {
  const candidates = GYM_PUZZLE_TYPES.filter(g => !isGymDone(stats[g.key]))
  if (candidates.length === 0) return null
  const prev = prevKey ? candidates.find(g => g.key === prevKey) : null
  if (prev) {
    // Rule 1 — floor: never switch in the first MIN_STREAK questions.
    if (streakLen < GYM_MIN_STREAK) return prev
    // Rule 2 — remediation lock: a wrong answer (or insufficient recovery)
    // keeps us on the same gym so the student gets another chance.
    if (!lastCorrect || consecCorrect < GYM_REMEDIATION_RUN) return prev
    // Rule 3 — soft release with a linear-ramp probability of switching.
    if (streakLen < GYM_MAX_STREAK) {
      const t = (streakLen - GYM_MIN_STREAK) / (GYM_MAX_STREAK - GYM_MIN_STREAK)
      const pSwitch = 0.5 + 0.35 * t
      if (Math.random() > pSwitch) return prev
    }
    // Past MAX_STREAK we fall through to the weighted re-roll.
  }
  const weights = candidates.map(g => Math.max(0.1, 1 - gymMastery(stats[g.key])))
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i]
    if (r <= 0) return candidates[i]
  }
  return candidates[candidates.length - 1]
}

export function isGymDone(stat) {
  return !!(stat && (stat.extrahardCorrect || 0) >= GYM_DONE_THRESHOLD)
}

export function adaptivePct(score) { return Math.min(100, Math.max(0, (score / 3) * 100)) }

export function adaptiveLevel(score) { return ADAPT_DIFFS[Math.min(Math.max(Math.round(score), 0), 3)] }

export function mathToPlain(text) {
  if (text == null) return ''
  return String(text).replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2')
}

export function renderMath(text) {
  if (text == null) return null
  const out = []
  let i = 0
  let buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < text.length) {
    if (text.startsWith('\\frac{', i)) {
      flush()
      // Parse the two brace groups, supporting nesting.
      let j = i + 6
      let depth = 1
      const ns = j
      while (j < text.length) {
        if (text[j] === '{') depth++
        else if (text[j] === '}') { depth--; if (depth === 0) break }
        j++
      }
      const numStr = text.slice(ns, j)
      j++   // skip closing } of numerator
      if (text[j] !== '{') { buf += text.slice(i, j); i = j; continue }
      j++   // skip opening { of denominator
      depth = 1
      const ds = j
      while (j < text.length) {
        if (text[j] === '{') depth++
        else if (text[j] === '}') { depth--; if (depth === 0) break }
        j++
      }
      const denStr = text.slice(ds, j)
      j++   // skip closing } of denominator
      out.push(<MathFrac key={`f${out.length}`} num={renderMath(numStr)} den={renderMath(denStr)} />)
      i = j
    } else if (text[i] === '^') {
      const m = text.slice(i).match(/^\^(-?\d+)/)
      if (m) {
        flush()
        out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em' }}>{m[1]}</sup>)
        i += m[0].length
      } else { buf += text[i]; i++ }
    } else { buf += text[i]; i++ }
  }

export function getTopicBadgeLevel(topicKey, completedTopics = []) {
  if (!completedTopics || !Array.isArray(completedTopics)) return 'locked';
  if (completedTopics.includes(`${topicKey}-hard`) || completedTopics.includes(`${topicKey}-gold`)) {
    return 'gold';
  }
  if (completedTopics.includes(`${topicKey}-medium`)) {
    return 'silver';
  }
  if (completedTopics.includes(`${topicKey}-easy`)) {
    return 'bronze';
  }
  if (completedTopics.includes(`${topicKey}-started`)) {
    return 'blue';
  }
  return 'locked';
}

export function ch4RenderMath(text) {
  if (text == null) return null
  const src = ch4_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch4Frac key={`f${out.length}`} num={ch4RenderMath(numStr)} den={ch4RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch4_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\xi/g, 'ξ')
    .replace(/\\cap/g, '∩').replace(/\\cup/g, '∪')
    .replace(/\\subset/g, '⊂').replace(/\\subseteq/g, '⊆')
    .replace(/\\in\b/g, '∈').replace(/\\notin/g, '∉')
    .replace(/\\emptyset/g, '∅')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\equiv/g, '≡')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch4_saveProgress(p) { try { localStorage.setItem(CH4_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch4_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH4_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch4_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch4_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch4_parseFrac(raw)
      const e = ch4_parseFrac(q.answer)
      return ch4_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch4_numEqual(user, expected, tol) {
  const u = parseFloat(ch4_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch4_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch4_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch4_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch4_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch4_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch4_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch4_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch4_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch4_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch4_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch3RenderMath(text) {
  if (text == null) return null
  const src = ch3_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch3Frac key={`f${out.length}`} num={ch3RenderMath(numStr)} den={ch3RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch3_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\xi/g, 'ξ')
    .replace(/\\cap/g, '∩').replace(/\\cup/g, '∪')
    .replace(/\\subset/g, '⊂').replace(/\\subseteq/g, '⊆')
    .replace(/\\in\b/g, '∈').replace(/\\notin/g, '∉')
    .replace(/\\emptyset/g, '∅')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\equiv/g, '≡')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch3_saveProgress(p) { try { localStorage.setItem(CH3_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch3_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH3_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch3_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch3_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch3_parseFrac(raw)
      const e = ch3_parseFrac(q.answer)
      return ch3_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch3_numEqual(user, expected, tol) {
  const u = parseFloat(ch3_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch3_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch3_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch3_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch3_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch3_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch3_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch3_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch3_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch3_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch3_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch2RenderMath(text) {
  if (text == null) return null
  const src = ch2_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch2Frac key={`f${out.length}`} num={ch2RenderMath(numStr)} den={ch2RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch2_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\xi/g, 'ξ')
    .replace(/\\cap/g, '∩').replace(/\\cup/g, '∪')
    .replace(/\\subset/g, '⊂').replace(/\\subseteq/g, '⊆')
    .replace(/\\in\b/g, '∈').replace(/\\notin/g, '∉')
    .replace(/\\emptyset/g, '∅')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\equiv/g, '≡')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch2_saveProgress(p) { try { localStorage.setItem(CH2_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch2_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH2_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch2_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch2_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch2_parseFrac(raw)
      const e = ch2_parseFrac(q.answer)
      return ch2_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch2_numEqual(user, expected, tol) {
  const u = parseFloat(ch2_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch2_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch2_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch2_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch2_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch2_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch2_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch2_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch2_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch2_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch2_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch1RenderMath(text) {
  if (text == null) return null
  const src = ch1_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch1Frac key={`f${out.length}`} num={ch1RenderMath(numStr)} den={ch1RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch1_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\xi/g, 'ξ')
    .replace(/\\cap/g, '∩').replace(/\\cup/g, '∪')
    .replace(/\\subset/g, '⊂').replace(/\\subseteq/g, '⊆')
    .replace(/\\in\b/g, '∈').replace(/\\notin/g, '∉')
    .replace(/\\emptyset/g, '∅')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\equiv/g, '≡')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch1_saveProgress(p) { try { localStorage.setItem(CH1_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch1_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH1_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch1_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch1_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch1_parseFrac(raw)
      const e = ch1_parseFrac(q.answer)
      return ch1_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch1_numEqual(user, expected, tol) {
  const u = parseFloat(ch1_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch1_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch1_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch1_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch1_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch1_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch1_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch1_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch1_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch1_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch1_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch24RenderMath(text) {
  if (text == null) return null
  const src = ch24_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch24Frac key={`f${out.length}`} num={ch24RenderMath(numStr)} den={ch24RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch24_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\xi/g, 'ξ')
    .replace(/\\cap/g, '∩').replace(/\\cup/g, '∪')
    .replace(/\\subset/g, '⊂').replace(/\\subseteq/g, '⊆')
    .replace(/\\in\b/g, '∈').replace(/\\notin/g, '∉')
    .replace(/\\emptyset/g, '∅')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\equiv/g, '≡')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch24_saveProgress(p) { try { localStorage.setItem(CH24_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch24_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH24_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch24_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch24_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch24_parseFrac(raw)
      const e = ch24_parseFrac(q.answer)
      return ch24_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch24_numEqual(user, expected, tol) {
  const u = parseFloat(ch24_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch24_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch24_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch24_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch24_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch24_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch24_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch24_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch24_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch24_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch24_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch23RenderMath(text) {
  if (text == null) return null
  const src = ch23_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  // Helper: parse two brace groups starting at position after a token like \frac or \binom
  const parseTwoGroups = (start) => {
    // start points at the '{' of the first group
    let j = start
    if (src[j] !== '{') return null
    let depth = 1; j++
    const ns = j
    while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
    if (j >= src.length) return null
    const a = src.slice(ns, j); j++
    if (src[j] !== '{') return null
    j++; depth = 1
    const ds = j
    while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
    if (j >= src.length) return null
    const b = src.slice(ds, j); j++
    return { a, b, end: j }
  }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      const r = parseTwoGroups(i + 5)
      if (!r) { buf += src[i]; i++; continue }
      out.push(<Ch23Frac key={`f${out.length}`} num={ch23RenderMath(r.a)} den={ch23RenderMath(r.b)} />)
      i = r.end
    } else if (src.startsWith('\\binom{', i)) {
      flush()
      const r = parseTwoGroups(i + 6)
      if (!r) { buf += src[i]; i++; continue }
      out.push(<Ch23ColVec key={`v${out.length}`} x={ch23RenderMath(r.a)} y={ch23RenderMath(r.b)} />)
      i = r.end
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch23_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\vec\{([A-Z]{1,2})\}/g, '$1⃗') // overhead arrow combiner
    .replace(/\\mathbf\{([^{}]+)\}/g, '$1')
    .replace(/\\equiv/g, '≡')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch23_saveProgress(p) { try { localStorage.setItem(CH23_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch23_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH23_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch23_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch23_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch23_parseFrac(raw)
      const e = ch23_parseFrac(q.answer)
      return ch23_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch23_numEqual(user, expected, tol) {
  const u = parseFloat(ch23_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch23_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch23_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch23_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch23_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch23_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch23_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch23_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch23_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch23_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch23_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch22RenderMath(text) {
  if (text == null) return null
  const src = ch22_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch22Frac key={`f${out.length}`} num={ch22RenderMath(numStr)} den={ch22RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch22_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch22_saveProgress(p) { try { localStorage.setItem(CH22_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch22_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH22_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch22_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch22_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch22_parseFrac(raw)
      const e = ch22_parseFrac(q.answer)
      return ch22_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch22_numEqual(user, expected, tol) {
  const u = parseFloat(ch22_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch22_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch22_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch22_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch22_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch22_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch22_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch22_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch22_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch22_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch22_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch21RenderMath(text) {
  if (text == null) return null
  const src = ch21_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch21Frac key={`f${out.length}`} num={ch21RenderMath(numStr)} den={ch21RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch21_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch21_saveProgress(p) { try { localStorage.setItem(CH21_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch21_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH21_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch21_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch21_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch21_parseFrac(raw)
      const e = ch21_parseFrac(q.answer)
      return ch21_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch21_numEqual(user, expected, tol) {
  const u = parseFloat(ch21_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch21_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch21_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch21_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch21_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch21_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch21_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch21_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch21_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch21_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch21_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch20RenderMath(text) {
  if (text == null) return null
  const src = ch20_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch20Frac key={`f${out.length}`} num={ch20RenderMath(numStr)} den={ch20RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch20_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch20_saveProgress(p) { try { localStorage.setItem(CH20_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch20_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH20_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch20_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch20_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch20_parseFrac(raw)
      const e = ch20_parseFrac(q.answer)
      return ch20_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch20_numEqual(user, expected, tol) {
  const u = parseFloat(ch20_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch20_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch20_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch20_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch20_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch20_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch20_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch20_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch20_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch20_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch20_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch19RenderMath(text) {
  if (text == null) return null
  const src = ch19_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch19Frac key={`f${out.length}`} num={ch19RenderMath(numStr)} den={ch19RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch19_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch19_saveProgress(p) { try { localStorage.setItem(CH19_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch19_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH19_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch19_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch19_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch19_parseFrac(raw)
      const e = ch19_parseFrac(q.answer)
      return ch19_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch19_numEqual(user, expected, tol) {
  const u = parseFloat(ch19_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch19_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch19_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch19_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch19_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch19_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch19_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch19_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch19_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch19_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch19_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch18RenderMath(text) {
  if (text == null) return null
  const src = ch18_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch18Frac key={`f${out.length}`} num={ch18RenderMath(numStr)} den={ch18RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch18_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch18_saveProgress(p) { try { localStorage.setItem(CH18_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch18_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH18_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch18_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch18_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch18_parseFrac(raw)
      const e = ch18_parseFrac(q.answer)
      return ch18_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch18_numEqual(user, expected, tol) {
  const u = parseFloat(ch18_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch18_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch18_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch18_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch18_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch18_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch18_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch18_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch18_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch18_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch18_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch17RenderMath(text) {
  if (text == null) return null
  const src = ch17_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch17Frac key={`f${out.length}`} num={ch17RenderMath(numStr)} den={ch17RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch17_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch17_saveProgress(p) { try { localStorage.setItem(CH17_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch17_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH17_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch17_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch17_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch17_parseFrac(raw)
      const e = ch17_parseFrac(q.answer)
      return ch17_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch17_numEqual(user, expected, tol) {
  const u = parseFloat(ch17_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch17_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch17_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch17_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch17_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch17_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch17_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch17_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch17_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch17_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch17_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch16RenderMath(text) {
  if (text == null) return null
  const src = ch16_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch16Frac key={`f${out.length}`} num={ch16RenderMath(numStr)} den={ch16RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch16_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch16_saveProgress(p) { try { localStorage.setItem(CH16_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch16_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH16_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch16_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch16_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch16_parseFrac(raw)
      const e = ch16_parseFrac(q.answer)
      return ch16_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch16_numEqual(user, expected, tol) {
  const u = parseFloat(ch16_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch16_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch16_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch16_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch16_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch16_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch16_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch16_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch16_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch16_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch16_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch15RenderMath(text) {
  if (text == null) return null
  const src = ch15_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch15Frac key={`f${out.length}`} num={ch15RenderMath(numStr)} den={ch15RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch15_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch15_saveProgress(p) { try { localStorage.setItem(CH15_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch15_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH15_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch15_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch15_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch15_parseFrac(raw)
      const e = ch15_parseFrac(q.answer)
      return ch15_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch15_numEqual(user, expected, tol) {
  const u = parseFloat(ch15_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch15_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch15_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch15_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch15_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch15_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch15_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch15_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch15_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch15_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch15_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch14RenderMath(text) {
  if (text == null) return null
  const src = ch14_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch14Frac key={`f${out.length}`} num={ch14RenderMath(numStr)} den={ch14RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch14_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch14_saveProgress(p) { try { localStorage.setItem(CH14_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch14_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH14_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch14_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch14_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch14_parseFrac(raw)
      const e = ch14_parseFrac(q.answer)
      return ch14_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch14_numEqual(user, expected, tol) {
  const u = parseFloat(ch14_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch14_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch14_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch14_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch14_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch14_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch14_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch14_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch14_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch14_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch14_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch13RenderMath(text) {
  if (text == null) return null
  const src = ch13_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch13Frac key={`f${out.length}`} num={ch13RenderMath(numStr)} den={ch13RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch13_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch13_saveProgress(p) { try { localStorage.setItem(CH13_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch13_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH13_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch13_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch13_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch13_parseFrac(raw)
      const e = ch13_parseFrac(q.answer)
      return ch13_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch13_numEqual(user, expected, tol) {
  const u = parseFloat(ch13_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch13_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch13_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch13_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch13_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch13_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch13_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch13_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch13_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch13_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch13_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch12RenderMath(text) {
  if (text == null) return null
  const src = ch12_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch12Frac key={`f${out.length}`} num={ch12RenderMath(numStr)} den={ch12RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch12_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch12_saveProgress(p) { try { localStorage.setItem(CH12_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch12_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH12_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch12_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch12_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch12_parseFrac(raw)
      const e = ch12_parseFrac(q.answer)
      return ch12_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch12_numEqual(user, expected, tol) {
  const u = parseFloat(ch12_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch12_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch12_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch12_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch12_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch12_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch12_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch12_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch12_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch12_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch12_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch11RenderMath(text) {
  if (text == null) return null
  const src = ch11_subOps(text).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch11Frac key={`f${out.length}`} num={ch11RenderMath(numStr)} den={ch11RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch11_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch11_saveProgress(p) { try { localStorage.setItem(CH11_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch11_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH11_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch11_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch11_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch11_parseFrac(raw)
      const e = ch11_parseFrac(q.answer)
      return ch11_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch11_numEqual(user, expected, tol) {
  const u = parseFloat(ch11_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch11_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch11_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch11_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch11_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch11_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch11_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch11_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch11_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch11_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch11_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch10_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch10_saveProgress(p) { try { localStorage.setItem(CH10_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch10_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH10_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch10_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch10_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch10_parseFrac(raw)
      const e = ch10_parseFrac(q.answer)
      return ch10_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch10_numEqual(user, expected, tol) {
  const u = parseFloat(ch10_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch10_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch10_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch10_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch10_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch10_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch10_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch10_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch10_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch10_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch10_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch9_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch9_saveProgress(p) { try { localStorage.setItem(CH9_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch9_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH9_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch9_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch9_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch9_parseFrac(raw)
      const e = ch9_parseFrac(q.answer)
      return ch9_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch9_numEqual(user, expected, tol) {
  const u = parseFloat(ch9_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch9_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch9_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch9_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch9_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch9_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch9_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch9_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch9_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch9_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch9_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch8RenderMath(text) {
  if (text == null) return null
  const src = ch8_subOps(text)
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  // Helper for \left( and \right) — render just as parentheses
  const cleanedSrc = src.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
  const finalSrc = cleanedSrc
  while (i < finalSrc.length) {
    if (finalSrc.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < finalSrc.length) { if (finalSrc[j] === '{') depth++; else if (finalSrc[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = finalSrc.slice(ns, j); j++
      if (finalSrc[j] !== '{') { buf += finalSrc.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < finalSrc.length) { if (finalSrc[j] === '{') depth++; else if (finalSrc[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = finalSrc.slice(ds, j); j++
      out.push(<Ch8Frac key={`f${out.length}`} num={ch8RenderMath(numStr)} den={ch8RenderMath(denStr)} />)
      i = j
    } else if (finalSrc[i] === '^') {
      const m = finalSrc.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += finalSrc[i]; i++ }
    } else { buf += finalSrc[i]; i++ }
  }
  flush()
  return out
}

export function ch8_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch8_saveProgress(p) { try { localStorage.setItem(CH8_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch8_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH8_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch8_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch8_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch8_parseFrac(raw)
      const e = ch8_parseFrac(q.answer)
      return ch8_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch8_numEqual(user, expected, tol) {
  const u = parseFloat(ch8_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch8_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch8_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch8_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch8_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch8_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch8_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch8_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch8_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch8_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch8_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function ch7RenderMath(text) {
  if (text == null) return null
  const src = ch7_subOps(text)
  const out = []
  let i = 0, buf = ''
  const flush = () => { if (buf) { out.push(buf); buf = '' } }
  while (i < src.length) {
    if (src.startsWith('\\frac{', i)) {
      flush()
      let j = i + 6, depth = 1
      const ns = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const numStr = src.slice(ns, j); j++
      if (src[j] !== '{') { buf += src.slice(i, j); i = j; continue }
      j++; depth = 1
      const ds = j
      while (j < src.length) { if (src[j] === '{') depth++; else if (src[j] === '}') { depth--; if (depth === 0) break } j++ }
      const denStr = src.slice(ds, j); j++
      out.push(<Ch7Frac key={`f${out.length}`} num={ch7RenderMath(numStr)} den={ch7RenderMath(denStr)} />)
      i = j
    } else if (src[i] === '^') {
      const m = src.slice(i).match(/^\^(-?\d+)/)
      if (m) { flush(); out.push(<sup key={`s${out.length}`} style={{ fontSize: '0.72em', verticalAlign: 'super' }}>{m[1]}</sup>); i += m[0].length }
      else { buf += src[i]; i++ }
    } else { buf += src[i]; i++ }
  }
  flush()
  return out
}

export function ch7_subOps(s) {
  return String(s)
    .replace(/\\times/g, '×').replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈').replace(/\\sim\b/g, '~')
    .replace(/\\to\b/g, '→').replace(/\\le\b/g, '≤').replace(/\\ge\b/g, '≥')
    .replace(/\\ne\b/g, '≠').replace(/\\neq\b/g, '≠')
    .replace(/\\cdot/g, '·').replace(/\\cdots/g, '⋯').replace(/\\pm/g, '±')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\Delta/g, 'Δ')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ').replace(/\\delta/g, 'δ')
    .replace(/\\mu\b/g, 'μ').replace(/\\sigma/g, 'σ').replace(/\\omega/g, 'ω')
    .replace(/\\sum/g, '∑').replace(/\\prod/g, '∏').replace(/\\int/g, '∫')
    .replace(/\\angle/g, '∠').replace(/\\triangle/g, '△').replace(/\\square/g, '□')
    .replace(/\\infty/g, '∞')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\sqrt(\d+)/g, '√$1')
    .replace(/\\ell\b/g, 'ℓ').replace(/\\circ/g, '°')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log').replace(/\\ln\b/g, 'ln')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[').replace(/\\right\]/g, ']')
    .replace(/\\u2208/g, '∈').replace(/\\u2209/g, '∉')
    .replace(/\\u2205/g, '∅')
    .replace(/\\u222a/g, '∪').replace(/\\u2229/g, '∩')
    .replace(/\\u2286/g, '⊆').replace(/\\u2282/g, '⊂')
    .replace(/\\u2113/g, 'ℓ').replace(/\\u00b0/g, '°')
    .replace(/\\u2019/g, '’').replace(/\\u2032/g, '′').replace(/\\u2013/g, '–')
    .replace(/\\u2660/g, '♠').replace(/\\u2663/g, '♣').replace(/\\u2665/g, '♥').replace(/\\u2666/g, '♦')
    .replace(/\\dot\{(\d)\}/g, '$1̇')
    .replace(/\\\$/g, '$').replace(/\\%/g, '%')
}

export function ch7_saveProgress(p) { try { localStorage.setItem(CH7_PROGRESS_KEY, JSON.stringify(p)) } catch { } }

export function ch7_loadProgress() {
  try { return JSON.parse(localStorage.getItem(CH7_PROGRESS_KEY) || '{}') || {} } catch { return {} }
}

export function ch7_checkFill(q, raw) {
  if (!raw || !raw.trim()) return false
  switch (q.kind) {
    case 'fill-num': return ch7_numEqual(raw, q.answer, q.tol)
    case 'fill-frac': {
      const u = ch7_parseFrac(raw)
      const e = ch7_parseFrac(q.answer)
      return ch7_fracEqual(u, e)
    }
    case 'fill-text': return raw.trim().toLowerCase() === String(q.answer).trim().toLowerCase()
    default: return false
  }
}

export function ch7_numEqual(user, expected, tol) {
  const u = parseFloat(ch7_normalizeNumStr(user))
  if (!Number.isFinite(u)) return false
  const t = tol != null ? tol : Math.max(0.005, Math.abs(expected) * 0.005)
  return Math.abs(u - expected) <= t
}

export function ch7_normalizeNumStr(s) {
  return String(s).trim().replace(/[$,\s%]/g, '').replace(/–/g, '-')
}

export function ch7_fracEqual(a, b) { return a && b && a.n === b.n && a.d === b.d }

export function ch7_parseFrac(raw) {
  if (raw == null) return null
  let s = String(raw).trim().replace(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g, '$1/$2').replace(/\s+/g, ' ').replace(/–/g, '-')
  if (!s) return null
  const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
  if (mixed) {
    const sign = mixed[1] === '-' ? -1 : 1
    const w = +mixed[2], n = +mixed[3], d = +mixed[4]
    if (d === 0) return null
    return ch7_reduce(sign * (w * d + n), d)
  }
  const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/)
  if (frac) {
    const n = +frac[1], d = +frac[2]
    if (d === 0) return null
    return ch7_reduce(n, d)
  }
  const num = Number(s)
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { n: num, d: 1 }
    const sign = num < 0 ? -1 : 1
    const decimals = (s.split('.')[1] || '').length
    const denom = Math.pow(10, decimals)
    return ch7_reduce(sign * Math.round(Math.abs(num) * denom), denom)
  }
  return null
}

export function ch7_reduce(n, d) {
  if (d === 0) return null
  if (d < 0) { n = -n; d = -d }
  const g = ch7_gcd(n, d)
  return { n: n / g, d: d / g }
}

export function ch7_gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b] } return a || 1 }

export function ch7_seededShuffle(n, key) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) }
  const rand = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967295 }
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
  return arr
}

export function renderFeedback(feedback, isCorrect) {
  if (!feedback) return null
  const isSolve = isCorrect === false && feedback.startsWith('Solution:')
  if (!isSolve) {
    return (
      <div className={`feedback ${isCorrect ? 'correct' : 'wrong'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span>{feedback}</span>
      </div>
    )
  }
  // Parse solve feedback: "Solution: ANSWER\nExplanation..."
  const lines = feedback.split('\n')
  const answerLine = lines[0].replace('Solution: ', '').trim()
  const rawExplanation = lines.slice(1).filter(l => l.trim()).map(l => l.trim())

  // Group lines into steps: lines starting with a keyword or number are step headers
  const steps = []
  for (const line of rawExplanation) {
    // Detect step boundaries: numbered lines, "Step N:", "Answer:", "So,", "Therefore", etc.
    const isStepStart = /^(\d+[\.\):]|Step\s|Answer:|So[, ]|Therefore|Result:|Formula:|First|Next|Then|Finally|Multiply|Divide|Add|Subtract|Convert|Simplify|Calculate|Apply|Using|Problem:)/i.test(line)
    if (isStepStart || steps.length === 0) {
      steps.push(line)
    } else {
      // Append to previous step
      steps[steps.length - 1] += '\n' + line
    }
  }

  return (
    <div className="feedback solve">
      <div className="solve-answer-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span>{answerLine}</span>
      </div>
      {steps.length > 0 && (
        <div className="solve-timeline">
          {steps.map((step, i) => (
            <div key={i} className="solve-step">
              <div className="solve-step-marker">
                <div className="solve-step-dot" />
                {i < steps.length - 1 && <div className="solve-step-line" />}
              </div>
              <div className="solve-step-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
                <span>{step}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function saveGymResult({ gymName, totalQuestions, correctAnswers, timeTakenSeconds, questionSummary = { easy: 0, medium: 0, hard: 0, extrahard: 0 } }

export function saveHistory(record) {
  const history = loadHistory()
  history.unshift(record)
  if (history.length > MAX_HISTORY) history.splice(MAX_HISTORY)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

export function useTimer() {
  // Current elapsed time in seconds, displayed to user
  const [elapsed, setElapsed]     = useState(0)
  // Remaining time in seconds (for speed mode countdown)
  const [remaining, setRemaining] = useState(0)
  // Goal mode ('standard' | 'speed' | 'perfect' | 'revision')
  const [mode, setMode]           = useState('standard')
  // Reference to the timestamp when timer started (using Date.now())
  const startRef    = useRef(typeof window !== 'undefined' ? Date.now() : 0)
  
  // Helper to extract current timestamp
  const getTimestamp = () => Date.now()
  const intervalRef = useRef(null)
  const limitRef    = useRef(0)
  const onTORef     = useRef(null) // timeout callback ref (avoids stale closure)
  const firedRef    = useRef(false) // prevent double-fire

  /**
   * start(goal, onTimeout, limitSeconds)
   * Backward-compatible: calling with no args or a number (initialValue) still starts a count-up timer.
   */
  const start = (goal = 'standard', onTimeout = null, limitSeconds = 15) => {
    clearInterval(intervalRef.current)
    let initialValue = 0
    let currentGoal = goal
    
    // If the first argument is a number, we treat it as initialValue (backward compatibility for count-up timer)
    if (typeof goal === 'number') {
      initialValue = goal
      currentGoal = 'standard'
    }
    
    startRef.current = Date.now() - (initialValue * 1000)
    limitRef.current = limitSeconds
    onTORef.current  = onTimeout
    firedRef.current = false
    setMode(currentGoal)
    setElapsed(initialValue)
    setRemaining(currentGoal === 'speed' ? limitSeconds : 0)

    intervalRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startRef.current) / 1000)
      setElapsed(secs)
      if (currentGoal === 'speed') {
        const left = Math.max(0, limitRef.current - secs)
        setRemaining(left)
        if (left === 0 && !firedRef.current) {
          firedRef.current = true
          clearInterval(intervalRef.current)
          if (typeof onTORef.current === 'function') onTORef.current()
        }
      }
    }, 250)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    firedRef.current = true // prevent timeout after manual stop
    return Math.floor((Date.now() - startRef.current) / 1000)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    firedRef.current = true
    setElapsed(0)
    setRemaining(0)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return { elapsed, remaining, mode, start, stop, reset }
}

export function getSpeedRunLimit(difficulty, isAdaptive) {
  if (isAdaptive) return 10
  const limits = { easy: 5, medium: 10, hard: 15, extrahard: 20 }
  return limits[difficulty] ?? 10
}

export function useAutoAdvance(revealed, advanceFnRef, isCorrect) {
  useEffect(() => {
    // Disabled auto-advance so user has to click "Next Question" manually.
    return;
  }, [revealed, isCorrect])
}

export function AuthMenu({ t = (s) => s }

export function useAuth() {
  const [user, setUser] = useState(authGetUser)
  useEffect(() => {
    const onChange = () => setUser(authGetUser())
    window.addEventListener(AUTH_EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(AUTH_EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])
  const login = async (username, password) => {
    const r = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: 'login failed' }))
      throw new Error(err.error || `login failed (HTTP ${r.status})`)
    }
    const data = await r.json()
    authSet(data.token, data.user)
    setUser(data.user)
    return data.user
  }
  const logout = () => { authClear(); setUser(null) }
  return { user, login, logout }
}

export function authClear() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  } catch { }
  try { window.dispatchEvent(new Event(AUTH_EVENT)) } catch { }
}

export function authSet(token, user) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  } catch { }
  try { window.dispatchEvent(new Event(AUTH_EVENT)) } catch { }
}

export function authGetUser() { try { return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null') } catch { return null } }

export function authGetToken() { try { return localStorage.getItem(AUTH_TOKEN_KEY) || null } catch { return null } }

export function useProgressSubmit(revealed, isCorrect, topic, questionId) {
  useEffect(() => {
    if (!revealed) return;
    const token = localStorage.getItem('tenali-auth-token');
    if (!token || !topic) return;

    const API = import.meta.env.VITE_API_BASE_URL || '';
    fetch(`${API}/api/progress/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        topic,
        isCorrect,
        questionId
      })
    }).catch(err => console.error('Failed to update progress', err));
  }, [revealed, isCorrect, topic, questionId]);
}

