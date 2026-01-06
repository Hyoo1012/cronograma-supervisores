/**
 * Entradas:
 * - workDays (N): días de trabajo EFECTIVO = Inducción + Perforación (NO incluye S ni B)
 * - restDays (M): días "libres" totales, donde descanso real = M - 2 (restando S y B)
 *
 * Ciclo total = N + M
 * Estructura del ciclo (primer ciclo):
 *  day 0: S
 *  day 1..inductionDays: I
 *  day (inductionDays+1)..N: P  (total P primer ciclo = N - inductionDays)
 *  day (N+1): B
 *  luego D por (M-2) días
 *
 * Inducción SOLO en el primer ciclo del supervisor (como en tu regla original).
 * S1 fijo. S3 entra según fórmula del documento. S2 se ajusta para cumplir:
 * - Exactamente 2 perforando por día desde que S3 está activo (por defecto: desde que S3 empieza P).
 * - Nunca 3 perforando.
 * - Nunca 1 perforando desde que S3 está activo.
 * - Patrones inválidos (solo ejemplos del doc): SS, SB, BS, BB.
 */

export const FORBIDDEN_PAIRS = new Set(["SS", "SB", "BS", "BB"]);
export function validateInputs({ workDays, restDays, inductionDays, totalDays }) {
  if (!Number.isInteger(workDays) || workDays <= 0) return "Trabajo (N) debe ser un entero > 0.";
  if (!Number.isInteger(restDays) || restDays <= 0) return "Descanso (M) debe ser un entero > 0.";
  if (!Number.isInteger(inductionDays) || inductionDays < 1 || inductionDays > 5) return "Inducción debe ser entre 1 y 5.";
  if (!Number.isInteger(totalDays) || totalDays < 1) return "Total de días a simular debe ser ≥ 1.";
  if (workDays - inductionDays < 1) {
    return `No cabe perforación: N(${workDays}) - Inducción(${inductionDays}) debe ser ≥ 1.`;
  }
  if (restDays - 2 < 0) {
    return `Descanso real = M-2 no puede ser negativo. (M debe ser ≥ 2)`;
  }

  return "";
}
function cycleLen(workDays, restDays) {
  return workDays + restDays;
}
export function stateForDayDoc({ day, startOffset, workDays, restDays, inductionDays }) {
  if (day < startOffset) return "-";
  const L = cycleLen(workDays, restDays);
  const t = day - startOffset;
  const pos = t % L;
  if (pos === 0) return "S";
  const isFirstCycle = t < L;
  if (isFirstCycle && pos >= 1 && pos <= inductionDays) return "I";
  if (pos >= 1 && pos <= workDays) {
    if (isFirstCycle && pos <= inductionDays) return "I";
    return "P";
  }
  if (pos === workDays + 1) return "B";
  return "D";
}
function pCount(a, b, c) {
  let n = 0;
  if (a === "P") n++;
  if (b === "P") n++;
  if (c === "P") n++;
  return n;
}
export function validateForbiddenPairs(rowStates) {
  const invalidStarts = [];
  for (let i = 0; i < rowStates.length - 1; i++) {
    const a = rowStates[i];
    const b = rowStates[i + 1];
    if (a === "-" || b === "-") continue;
    const pair = `${a}${b}`;
    if (FORBIDDEN_PAIRS.has(pair)) invalidStarts.push(i);
  }
  return invalidStarts;
}
function buildLine({ totalDays, startOffset, workDays, restDays, inductionDays }) {
  return Array.from({ length: totalDays }, (_, d) =>
    stateForDayDoc({ day: d, startOffset, workDays, restDays, inductionDays })
  );
}
function repairS2({ s1, s2, s3, totalDays, startEnforceDay }) {
  let changes = 0;
  for (let d = startEnforceDay; d < totalDays; d++) {
    const c = pCount(s1[d], s2[d], s3[d]);
    if (c === 1) {
      if (s2[d] === "D" || s2[d] === "-") {
        s2[d] = "P";
        changes++;
      }
    }
    if (c === 3) {
      if (s2[d] === "P") {
        s2[d] = "D";
        changes++;
      }
    }
  }
  for (let d = startEnforceDay; d < totalDays; d++) {
    const c = pCount(s1[d], s2[d], s3[d]);
    if (c !== 2) return { ok: false, changes };
  }

  return { ok: true, changes };
}
export function generarCronograma({ workDays, restDays, inductionDays, totalDays }) {
  const err = validateInputs({ workDays, restDays, inductionDays, totalDays });
  if (err) {
    return { estados: null, alerts: [err], meta: null };
  }
  const L = cycleLen(workDays, restDays);
  const s1BajaDia = 1 + workDays;                
  const s3EntraDia = s1BajaDia - inductionDays - 1;
  const s3StartP = s3EntraDia + 1 + inductionDays; 
  const o1 = 0;
  const s1 = buildLine({ totalDays, startOffset: o1, workDays, restDays, inductionDays });
  const o3 = Math.max(0, s3EntraDia);
  const s3 = buildLine({ totalDays, startOffset: o3, workDays, restDays, inductionDays });
 const startEnforceDay = Math.max(0, o3);
  let best = null;
  for (let o2 = 0; o2 < L; o2++) {
    const s2 = buildLine({ totalDays, startOffset: o2, workDays, restDays, inductionDays });
    const s2Work = s2.slice();
    const rep = repairS2({ s1, s2: s2Work, s3, totalDays, startEnforceDay });
    if (!rep.ok) continue;
    const fp1 = validateForbiddenPairs(s1);
    const fp2 = validateForbiddenPairs(s2Work);
    const fp3 = validateForbiddenPairs(s3);
    const penalty = rep.changes * 10 + (fp2.length + fp3.length) * 100;
    if (!best || penalty < best.penalty) {
      best = {
        penalty,
        o1,
        o2,
        o3,
        s1,
        s2: s2Work,
        s3,
        startEnforceDay,
        s1BajaDia,
        s3EntraDia,
        s3StartP,
        changes: rep.changes,
        forbiddenPairs: { s1: fp1, s2: fp2, s3: fp3 },
      };
    }
  }
  if (!best) {
    return {
      estados: { S1: s1, S2: buildLine({ totalDays, startOffset: 0, workDays, restDays, inductionDays }), S3: s3 },
      alerts: [
        "No se encontró una solución que cumpla exactamente 2 supervisores perforando por día desde que S3 inicia perforación (P).",
        "Revisar parámetros: en algunos regímenes S2 cae en S/I/B en días críticos y no se puede forzar P sin romper el ciclo.",
      ],
      meta: { s1BajaDia, s3EntraDia, s3StartP, startEnforceDay },
    };
  }
  const alerts = [];
  for (let d = best.startEnforceDay; d < totalDays; d++) {
    const c = pCount(best.s1[d], best.s2[d], best.s3[d]);
    if (c === 3) alerts.push(`Día ${d}: hay 3 supervisores perforando.`);
  }
  for (let d = best.startEnforceDay; d < totalDays; d++) {
    const c = pCount(best.s1[d], best.s2[d], best.s3[d]);
    if (c === 1) alerts.push(`Día ${d}: solo 1 supervisor perforando (desde inicio de P de S3).`);
  }
  const fp = best.forbiddenPairs;
  if (fp.s1.length) alerts.push(`S1: patrones inválidos en días ${fp.s1.join(", ")}.`);
  if (fp.s2.length) alerts.push(`S2: patrones inválidos en días ${fp.s2.join(", ")}.`);
  if (fp.s3.length) alerts.push(`S3: patrones inválidos en días ${fp.s3.join(", ")}.`);
  return {
    estados: { S1: best.s1, S2: best.s2, S3: best.s3 },
    alerts,
    meta: {
      offsets: { S1: best.o1, S2: best.o2, S3: best.o3 },
      s1BajaDia: best.s1BajaDia,
      s3EntraDia: best.s3EntraDia,
      s3StartP: best.s3StartP,
      startEnforceDay: best.startEnforceDay,
      s2Changes: best.changes,
    },
  };
}
