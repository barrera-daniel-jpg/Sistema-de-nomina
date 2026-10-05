import { prisma } from './prisma';

// Constantes legales (Reglas de Negocio)
const SALUD_PERCENTAGE = 0.04;
const PENSION_PERCENTAGE = 0.04;
const HORAS_MENSUALES_BASE = 240; // Estándar para deducir el valor de 1 hora ordinaria

export async function calculateEmployeePayroll(employeeId: string, periodId: string) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: { timeRecords: { include: { hourType: true } } }
  });

  if (!employee) throw new Error('Empleado no encontrado');

  // 1. Cálculo de Devengado Base
  let totalDevengado = employee.baseSalary;
  const valorHoraBase = employee.baseSalary / HORAS_MENSUALES_BASE;

  // 2. Horas dinámicas (Extras, nocturnas, etc)
  const periodRecords = employee.timeRecords; // En un entorno real se filtraría por date vs periodId
  let totalHorasDinamicas = 0;
  
  for (const record of periodRecords) {
    const costoHora = valorHoraBase * record.hourType.multiplier;
    totalHorasDinamicas += (costoHora * record.hours);
  }
  
  totalDevengado += totalHorasDinamicas;

  // 3. Bonificación por hijo (RN-01)
  let totalBonus = 0;
  if (employee.childrenCount === 1) totalBonus = 250000;
  else if (employee.childrenCount === 2) totalBonus = 400000;
  else if (employee.childrenCount >= 3) totalBonus = 600000;

  // 4. Deducciones legales (RN-02) - Se calculan sobre el devengado sin incluir el bono (normativa estándar)
  const deduccionSalud = totalDevengado * SALUD_PERCENTAGE;
  const deduccionPension = totalDevengado * PENSION_PERCENTAGE;
  const totalDeductions = deduccionSalud + deduccionPension;

  // 5. Neto (RN-05)
  const netToPay = totalDevengado + totalBonus - totalDeductions;

  return {
    totalDevengado,
    totalBonus,
    totalDeductions,
    netToPay,
    detalles: {
      salud: deduccionSalud,
      pension: deduccionPension,
      horasDinamicas: totalHorasDinamicas,
      salarioBase: employee.baseSalary
    }
  };
}
