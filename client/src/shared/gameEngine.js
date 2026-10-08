// Auto-extracted game engine functions (gym, gen_*, etc)

export function gymDifficultyFor(mastery) {
  if (mastery < 0.45) return 'easy'
  if (mastery < 0.70) return 'medium'
  if (mastery < 0.88) return 'hard'
  return 'extrahard'
}

export function gymMastery(stat) {
  if (!stat || stat.total < GYM_MIN_SAMPLES) return 0
  const accuracy = stat.correct / stat.total
  const avgTime = stat.totalTime / stat.total
  // Speed factor: 1 if avg ≤ GYM_FAST_AVG_S, decays to 0.4 by 18s.
  const speedFactor = Math.max(0.4, Math.min(1, 1 - (avgTime - GYM_FAST_AVG_S) / 12))
  return Math.max(0, Math.min(1, accuracy * speedFactor))
}

export function saveGymStats(stats) {
  try { localStorage.setItem(GYM_STATS_KEY, JSON.stringify(stats)) } catch (e) { }
}

export function loadGymStats() {
  try {
    const raw = localStorage.getItem(GYM_STATS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) || {}
  } catch (e) { return {} }
}

export function buildExtensionBatch(sourceTables, count) {
  const pool = []
  for (const t of sourceTables) for (let m = 2; m <= 10; m++) pool.push({ table: t, multiplier: m })
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

export function buildLevel1Plan() {
  const pool = []
  for (const t of MULT_TABLES) {
    for (let m = 2; m <= 10; m++) pool.push({ table: t, multiplier: m })
  }
  // Fisher-Yates partial shuffle to grab the first 10 distinct entries.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const picked = pool.slice(0, MULT_BASE_QUESTIONS)
  picked.sort((a, b) => a.table - b.table || a.multiplier - b.multiplier)
  return picked
}

export function weakTablesFromStats(tableStats) {
  return MULT_TABLES.map(t => {
    const s = tableStats[t]
    if (!s || s.total === 0) return { table: t, weakness: 1, accuracy: 0, avgTime: 0, seen: false }
    const accuracy = s.correct / s.total
    const avgTime = s.totalTime / s.total
    // Weakness ∈ [0, ~1.5]: 0 = perfect & fast, 1+ = bad accuracy and/or slow.
    // (1 - accuracy) dominates; avgTime contributes a smaller "slow" penalty.
    const weakness = (1 - accuracy) + Math.max(0, (avgTime - MULT_FAST_AVG_SECONDS) / 10)
    return { table: t, weakness, accuracy, avgTime, seen: true }
  }).sort((a, b) => b.weakness - a.weakness)
}

export function mergeTableStat(tableStats, table, correct, timeSec) {
  const cur = tableStats[table] || { correct: 0, total: 0, totalTime: 0 }
  return {
    ...tableStats,
    [table]: {
      correct: cur.correct + (correct ? 1 : 0),
      total: cur.total + 1,
      totalTime: cur.totalTime + timeSec,
    },
  }
}

export function saveMultStats(stats) {
  try { localStorage.setItem(MULT_STATS_KEY, JSON.stringify(stats)) } catch (e) { }
}

export function loadMultStats() {
  try {
    const raw = localStorage.getItem(MULT_STATS_KEY)
    if (!raw) return { tableStats: {}, hasCompletedLevel1: false }
    const parsed = JSON.parse(raw)
    return {
      tableStats: parsed.tableStats || {},
      hasCompletedLevel1: !!parsed.hasCompletedLevel1,
    }
  } catch (e) {
    return { tableStats: {}, hasCompletedLevel1: false }
  }
}

export function gymFormatAnswer(q) {
  if (q.kind === 'integer') return String(q.answer)
  if (q.kind === 'fraction') {
    const { n, d } = q.answer
    return d === 1 ? String(n) : `\\frac{${n}}{${d}}`
  }
  if (q.kind === 'decimal') return q.answer.decimal
  if (q.kind === 'polynomial') return gymFormatPoly(q.answer)
  return ''
}

export function gymReduceFrac(n, d) {
  if (d === 0) return null
  const g = gymGcd(n, d)
  let rn = n / g, rd = d / g
  if (rd < 0) { rn = -rn; rd = -rd }
  return { n: rn, d: rd }
}

export function gymParseNumeric(raw) {
  const s = String(raw).trim()
  if (!s || s === '-' || s === '.' || s === '/') return null
  if (s.includes('/') && !/[xX^]/.test(s)) {
    const parts = s.split('/')
    if (parts.length !== 2) return null
    const n = Number(parts[0]); const d = Number(parts[1])
    if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null
    return { kind: 'fraction', n, d }
  }
  const v = Number(s)
  if (!Number.isFinite(v)) return null
  return { kind: 'number', value: v }
}

export function gen_alg_lineq(d) {
  d = gymClampDiff(d)
  const maxX = Math.max(3, Math.round(3 + d * 6))   // 3 at d=0, 9 at d=1
  const maxA = Math.max(2, Math.round(2 + d * 7))   // 2 at d=0, 9 at d=1
  const maxB = Math.max(3, Math.round(3 + d * 6))
  let x
  do { x = gymPickInt(-maxX, maxX) } while (x === 0)
  const a = gymPickInt(2, maxA) * gymRandSign()
  const b = gymPickInt(-maxB, maxB)
  const c = a * x + b
  const aStr = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`
  let bStr = ''
  if (b > 0) bStr = ` + ${b}`
  else if (b < 0) bStr = ` − ${-b}`
  return { type: 'Solve x', difficulty: d, prompt: `${aStr}${bStr} = ${c},   x = ?`, kind: 'integer', answer: x }
}

export function gen_alg_add3(d) {
  d = gymClampDiff(d)
  const targetDeg = (jitter) => Math.max(1, Math.min(3, Math.round(1 + d * 2 + jitter)))
  const deg1 = targetDeg((Math.random() - 0.5) * 1.0)
  const deg2 = targetDeg((Math.random() - 0.5) * 1.0)
  const p1 = gymRandPoly(deg1)
  const p2 = gymRandPoly(deg2)
  return { type: 'Add (deg ≤ 3)', difficulty: d, prompt: `(${gymFormatPoly(p1)}) + (${gymFormatPoly(p2)}) = ?`, kind: 'polynomial', answer: gymAddPolys(p1, p2) }
}

export function gen_alg_mul3(d) {
  d = gymClampDiff(d)
  const deg1 = Math.random() < d ? 3 : 2
  const deg2 = Math.random() < d ? 3 : 2
  const p1 = gymRandPoly(deg1)
  const p2 = gymRandPoly(deg2)
  return { type: 'Multiply (deg ≤ 3)', difficulty: d, prompt: `(${gymFormatPoly(p1)})(${gymFormatPoly(p2)}) = ?`, kind: 'polynomial', answer: gymMultiplyPolys(p1, p2) }
}

export function gen_alg_add1(d) {
  d = gymClampDiff(d)
  const maxC = Math.max(2, Math.round(3 + d * 6))
  const p1 = { 1: gymPickInt(1, maxC) * gymRandSign(), 0: gymPickInt(1, maxC) * gymRandSign() }
  const p2 = { 1: gymPickInt(1, maxC) * gymRandSign(), 0: gymPickInt(1, maxC) * gymRandSign() }
  return { type: 'Add (deg 1)', difficulty: d, prompt: `(${gymFormatPoly(p1)}) + (${gymFormatPoly(p2)}) = ?`, kind: 'polynomial', answer: gymAddPolys(p1, p2) }
}

export function gen_alg_mul1(d) {
  d = gymClampDiff(d)
  const maxC = Math.max(2, Math.round(3 + d * 6))   // 3 at d=0, 6 at d=0.5, 9 at d=1
  const p1 = { 1: gymPickInt(1, maxC) * gymRandSign(), 0: gymPickInt(1, maxC) * gymRandSign() }
  const p2 = { 1: gymPickInt(1, maxC) * gymRandSign(), 0: gymPickInt(1, maxC) * gymRandSign() }
  return { type: 'Multiply (deg 1)', difficulty: d, prompt: `(${gymFormatPoly(p1)})(${gymFormatPoly(p2)}) = ?`, kind: 'polynomial', answer: gymMultiplyPolys(p1, p2) }
}

export function gen_alg_term(d) {
  d = gymClampDiff(d)
  const maxPow = Math.max(2, Math.round(2 + d * 7))   // 2 at d=0, 5 at d=0.5, 9 at d=1
  const isMul = Math.random() < 0.5
  if (isMul) {
    const a = gymPickInt(2, 9) * gymRandSign()
    const b = gymPickInt(2, 9) * gymRandSign()
    const p = gymPickInt(1, maxPow)
    const q = gymPickInt(1, maxPow)
    return { type: 'Single Term ×', difficulty: d, prompt: `(${gymFormatTerm(a, p)})(${gymFormatTerm(b, q)}) = ?`, kind: 'polynomial', answer: { [p + q]: a * b } }
  }
  const [aMag, bMag] = GYM_DIV_PAIRS[Math.floor(Math.random() * GYM_DIV_PAIRS.length)]
  const a = aMag * gymRandSign()
  const b = bMag * gymRandSign()
  const qPow = gymPickInt(1, Math.max(1, maxPow - 1))
  const pPow = qPow + gymPickInt(1, Math.max(1, maxPow - qPow))
  return { type: 'Single Term ÷', difficulty: d, prompt: `\\frac{${gymFormatTerm(a, pPow)}}{${gymFormatTerm(b, qPow)}} = ?`, kind: 'polynomial', answer: { [pPow - qPow]: a / b } }
}

export function gymAddPolys(p1, p2) {
  const out = { ...p1 }
  for (const k of Object.keys(p2)) {
    out[k] = (out[k] || 0) + p2[k]
    if (out[k] === 0) delete out[k]
  }
  return out
}

export function gymMultiplyPolys(p1, p2) {
  const out = {}
  for (const k1 of Object.keys(p1)) {
    for (const k2 of Object.keys(p2)) {
      const power = Number(k1) + Number(k2)
      out[power] = (out[power] || 0) + p1[k1] * p2[k2]
    }
  }
  return out
}

export function gymRandPoly(degree) {
  const coeffs = {}
  coeffs[degree] = gymPickInt(1, 9) * gymRandSign()
  for (let p = degree - 1; p >= 0; p--) {
    if (Math.random() < 0.2) continue                        // sparse: 20% chance of skipping
    const c = gymPickInt(1, 9) * gymRandSign()
    coeffs[p] = c
  }
  return coeffs
}

export function gymPolysEqual(p1, p2) {
  const allKeys = new Set([...Object.keys(p1), ...Object.keys(p2)])
  for (const k of allKeys) {
    const a = p1[k] || 0
    const b = p2[k] || 0
    if (a !== b) return false
  }
  return true
}

export function gymParsePoly(input) {
  let s = String(input).replace(/\s+/g, '').replace(/\*\*/g, '^').replace(/−/g, '-').toLowerCase()
  if (!s) return null
  if (!/^[\dx+\-^.\/]*$/.test(s)) return null
  s = s.replace(/-/g, '+-')
  if (s.startsWith('+')) s = s.slice(1)
  const terms = s.split('+').filter(t => t !== '')
  if (terms.length === 0) return null
  const coeffs = {}
  for (const t of terms) {
    if (t === '' || t === '-') return null
    const xIdx = t.indexOf('x')
    if (xIdx === -1) {
      const v = Number(t)
      if (!Number.isFinite(v)) return null
      coeffs[0] = (coeffs[0] || 0) + v
      continue
    }
    const coeffStr = t.slice(0, xIdx)
    const rest = t.slice(xIdx + 1)
    let coeff
    if (coeffStr === '' || coeffStr === '+') coeff = 1
    else if (coeffStr === '-') coeff = -1
    else { coeff = Number(coeffStr); if (!Number.isFinite(coeff)) return null }
    let power
    if (rest === '') power = 1
    else if (rest.startsWith('^')) {
      power = Number(rest.slice(1))
      if (!Number.isInteger(power) || power < 0) return null
    } else return null
    coeffs[power] = (coeffs[power] || 0) + coeff
  }
  return coeffs
}

export function gymFormatPoly(coeffs) {
  const powers = Object.keys(coeffs).map(Number).filter(p => coeffs[p] !== 0).sort((a, b) => b - a)
  if (powers.length === 0) return '0'
  let out = ''
  powers.forEach((p, i) => {
    const c = coeffs[p]
    const abs = Math.abs(c)
    let term
    if (p === 0) term = String(abs)
    else if (p === 1) term = abs === 1 ? 'x' : `${abs}x`
    else term = abs === 1 ? `x^${p}` : `${abs}x^${p}`
    if (i === 0) out += (c < 0 ? '-' : '') + term
    else out += (c < 0 ? ' − ' : ' + ') + term
  })
  return out
}

export function gymFormatTerm(coeff, power) {
  if (coeff === 0) return '0'
  const abs = Math.abs(coeff)
  const sign = coeff < 0 ? '-' : ''
  if (power === 0) return sign + abs
  if (power === 1) return sign + (abs === 1 ? 'x' : `${abs}x`)
  return sign + (abs === 1 ? `x^${power}` : `${abs}x^${power}`)
}

export function gen_arith_decfracred(d) {
  d = gymClampDiff(d)
  let a, b
  let attempts = 0
  while (true) {
    a = gymPickInt(1, 9); b = gymPickInt(2, 9)
    if (a !== b && gymGcd(a, b) === 1) break
    if (++attempts > 200) { a = 1; b = 2; break }
  }
  const lo = Math.ceil(10 / Math.min(a, b))
  const hi = Math.floor(99 / Math.max(a, b))
  const gMin = Math.max(lo, 2)
  if (hi < gMin) return gen_arith_decfracred(d)
  const g = gymPickInt(gMin, hi)
  const maxDp = Math.max(1, Math.round(1 + d * 3))             // 1 at d=0, 4 at d=1
  const dp = gymPickInt(1, maxDp)
  const sa = gymRandSign()
  const sb = gymRandSign()
  const numStr = gymFormatDec(g * a, sa, dp)
  const denStr = gymFormatDec(g * b, sb, dp)
  const sign = sa * sb
  return { type: 'Decimal Reduce', difficulty: d, prompt: `Reduce: \\frac{${numStr}}{${denStr}}`, kind: 'fraction', answer: { n: sign * a, d: b } }
}

export function gen_arith_decarith(d) {
  d = gymClampDiff(d)
  const twoDigChance = d                                         // 0% → 100%
  const maxDp = Math.max(0, Math.round(0.5 + d * 2.5))            // 1 at d=0, 2 at d=0.5, 3 at d=1
  let m1, m2
  if (Math.random() >= twoDigChance) {
    m1 = gymPickInt(1, 9); m2 = gymPickInt(1, 9)
  } else {
    m1 = gymPickInt(1, 9); m2 = gymPickInt(10, 99)
    if (Math.random() < 0.5) { [m1, m2] = [m2, m1] }
  }
  const dp1 = gymPickInt(0, maxDp)
  const dp2 = gymPickInt(0, maxDp)
  const s1 = gymRandSign()
  const s2 = gymRandSign()
  const d1 = gymFormatDec(m1, s1, dp1)
  const d2 = gymFormatDec(m2, s2, dp2)
  const sign = s1 * s2
  const numerMag = m1 * m2
  const totalDp = dp1 + dp2
  let resultStr
  if (totalDp === 0) {
    resultStr = String(sign * numerMag)
  } else {
    const padded = String(numerMag).padStart(totalDp + 1, '0')
    const intP = padded.slice(0, padded.length - totalDp)
    const fracP = padded.slice(padded.length - totalDp).replace(/0+$/, '')
    const signPrefix = sign < 0 && numerMag !== 0 ? '-' : ''
    resultStr = signPrefix + (fracP ? `${Number(intP)}.${fracP}` : `${Number(intP)}`)
  }
  const exactValue = (sign * numerMag) / Math.pow(10, totalDp)
  return { type: 'Decimal ×', difficulty: d, prompt: `${d1} × ${d2} = ?`, kind: 'decimal', answer: { decimal: resultStr, exactValue } }
}

export function gen_arith_fracred(d) {
  d = gymClampDiff(d)
  const twoDigit = Math.random() < d
  let num, den, redN, redD
  if (twoDigit) {
    let a, b
    let attempts = 0
    while (true) {
      a = gymPickInt(1, 9); b = gymPickInt(2, 9)
      if (a !== b && gymGcd(a, b) === 1) break
      if (++attempts > 200) { a = 1; b = 2; break }
    }
    const lo = Math.ceil(10 / Math.min(a, b))
    const hi = Math.floor(99 / Math.max(a, b))
    const gMin = Math.max(lo, 2)
    if (hi < gMin) return gen_arith_fracred(d)
    const g = gymPickInt(gMin, hi)
    num = g * a * gymRandSign()
    den = g * b * gymRandSign()
    redN = a; redD = b
  } else {
    const opts = []
    for (let i = 2; i <= 9; i++) for (let j = 2; j <= 9; j++) if (i !== j && gymGcd(i, j) > 1) opts.push([i, j])
    const [nMag, dMag] = opts[Math.floor(Math.random() * opts.length)]
    num = nMag * gymRandSign()
    den = dMag * gymRandSign()
    const g = gymGcd(nMag, dMag)
    redN = nMag / g
    redD = dMag / g
  }
  const sign = (num < 0 ? -1 : 1) * (den < 0 ? -1 : 1)
  redN = sign * redN
  return { type: 'Reduce', difficulty: d, prompt: `Reduce: \\frac{${num}}{${den}}`, kind: 'fraction', answer: { n: redN, d: redD } }
}

export function gen_arith_fracdiv(d) {
  d = gymClampDiff(d)
  const twoDigit = Math.random() < d
  let num, den
  if (twoDigit) {
    const q = gymPickInt(2, 9)
    const maxDen = Math.floor(99 / q)
    const denMag = gymPickInt(10, maxDen)
    num = q * denMag * gymRandSign()
    den = denMag * gymRandSign()
  } else {
    const opts = []
    for (let n = 2; n <= 9; n++) for (let dd = 2; dd <= 9; dd++) if (n !== dd && n % dd === 0) opts.push([n, dd])
    const [nMag, dMag] = opts[Math.floor(Math.random() * opts.length)]
    num = nMag * gymRandSign()
    den = dMag * gymRandSign()
  }
  return { type: 'Fraction ÷', difficulty: d, prompt: `\\frac{${num}}{${den}} = ?`, kind: 'integer', answer: num / den }
}

export function gen_arith_mul(d) {
  d = gymClampDiff(d)
  const rare2dChance = 0.05 + 0.25 * d        // 5% at d=0, 17% at d=0.5, 30% at d=1
  let a, b
  if (Math.random() < rare2dChance) {
    const oneDig = gymPickInt(2, 9) * gymRandSign()
    const twoDig = gymPickInt(10, 99) * gymRandSign()
    if (Math.random() < 0.5) { a = oneDig; b = twoDig } else { a = twoDig; b = oneDig }
  } else {
    const maxFactor = Math.max(5, Math.round(5 + 4 * d))   // 5 at d=0, 9 at d=1
    a = gymPickInt(2, maxFactor) * gymRandSign()
    b = gymPickInt(2, maxFactor) * gymRandSign()
  }
  return { type: 'Multiply', difficulty: d, prompt: `${gymSigned(a)} × ${gymSigned(b)} = ?`, kind: 'integer', answer: a * b }
}

export function gen_arith_add(d) {
  d = gymClampDiff(d)
  const maxAbs = Math.max(5, Math.round(5 + 94 * d))   // 5 at d=0, 99 at d=1
  const a = gymPickInt(1, maxAbs) * gymRandSign()
  const b = gymPickInt(1, maxAbs) * gymRandSign()
  const op = Math.random() < 0.5 ? '+' : '−'
  const result = op === '+' ? a + b : a - b
  const aStr = a < 0 ? `(${a})` : String(a)
  const bStr = b < 0 ? `(${b})` : String(b)
  return { type: 'Add/Sub', difficulty: d, prompt: `${aStr} ${op} ${bStr} = ?`, kind: 'integer', answer: result }
}

export function gymClampDiff(d) { return Math.min(1, Math.max(0, d == null ? 0.5 : d)) }

export function gymFormatDec(m, s, dp) {
  if (dp === 0) return (s < 0 && m !== 0 ? '-' : '') + m
  const padded = String(m).padStart(dp + 1, '0')
  const intP = padded.slice(0, padded.length - dp)
  const fracP = padded.slice(padded.length - dp)
  return (s < 0 && m !== 0 ? '-' : '') + intP + '.' + fracP
}

export function gymSigned(n) { return n < 0 ? `(${n})` : String(n) }

export function gymGcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b > 0) { [a, b] = [b, a % b] } return a || 1 }

export function gymRandSign() { return Math.random() < 0.5 ? -1 : 1 }

export function gymPickInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

