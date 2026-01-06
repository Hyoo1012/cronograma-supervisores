export function generarCronograma(config) {
  const { workDays, restDays, inductionDays, totalDays } = config;
  const supervisores = ["S1", "S2", "S3"];
  const estados = {};
  supervisores.forEach(sup => (estados[sup] = Array(totalDays).fill("-")));
  const s1 = estados["S1"];
  s1[0] = "S"; 
  for (let i = 1; i <= inductionDays; i++) s1[i] = "I";
  for (let i = inductionDays + 1; i < workDays; i++) s1[i] = "P";
  s1[workDays] = "B"; 
  for (let i = workDays + 1; i < workDays + restDays; i++) s1[i] = "D";
  const s1BajaDia = 1 + workDays; 
  const s3EntraDia = s1BajaDia - inductionDays - 1;
  const s3StartP = s3EntraDia + 1 + inductionDays; 
  const s3 = estados["S3"];
  if (s3EntraDia >= 0 && s3EntraDia < totalDays) s3[s3EntraDia] = "S";
  for (let i = 1; i <= inductionDays; i++) {
    if (s3EntraDia + i < totalDays) s3[s3EntraDia + i] = "I";
  }
  for (let i = s3StartP; i < totalDays; i++) {
    s3[i] = "P";
  }
  if (s3StartP + workDays < totalDays) s3[s3StartP + workDays] = "B";
  const s2 = estados["S2"];
  s2[0] = "S";
  for (let i = 1; i <= inductionDays; i++) s2[i] = "I";
  let s2PStart = inductionDays + 1;
  let s2Pend = workDays - 1;
  for (let i = s2PStart; i < s2Pend; i++) s2[i] = "P";
  s2[s2Pend] = "B";
  ajustarCobertura(estados, s3StartP, totalDays);
  const alerts = validarCronograma(estados, s3StartP);
  return { estados, alerts, s3StartP };
}
function ajustarCobertura(estados, s3StartP, totalDays) {
  const countP = contarPerforando(estados, totalDays);
  for (let i = s3StartP; i < totalDays; i++) {
    if (countP[i] === 1) {
      for (let j = i - 1; j >= 0; j--) {
        if (["D", "B", "-"].includes(estados["S2"][j])) {
          estados["S2"][j] = "P";
          break;
        }
      }
    }
  }
}
function contarPerforando(estados, totalDays) {
  const count = Array(totalDays).fill(0);
  for (let i = 0; i < totalDays; i++) {
    for (const sup in estados) {
      if (estados[sup][i] === "P") count[i]++;
    }
  }
  return count;
}
function validarCronograma(estados, s3StartP) {
  const totalDays = estados["S1"].length;
  const count = contarPerforando(estados, totalDays);
  const alerts = [];
  const tresP = count.findIndex(v => v > 2);
  if (tresP !== -1)
    alerts.push(`❌ Día ${tresP}: hay 3 supervisores perforando.`);
  for (let i = s3StartP; i < totalDays; i++) {
    if (count[i] === 1)
      alerts.push(`⚠️ Día ${i}: solo 1 supervisor perforando (tras entrada S3).`);
  }
  const patrones = ["SS", "SB", "BS", "BB"];
  for (const sup in estados) {
    const line = estados[sup].join("");
    patrones.forEach(p => {
      if (line.includes(p)) alerts.push(`⚠️ ${sup} tiene patrón inválido ${p}.`);
    });
  }
  return alerts;
}
