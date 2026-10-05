export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 text-slate-800">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Sistema de Liquidación de Nómina</h1>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition-all">
            Cerrar Sesión
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Empleados Activos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="p-3 rounded-tl-lg">Nombre</th>
                    <th className="p-3">Documento</th>
                    <th className="p-3">Salario Base</th>
                    <th className="p-3">Hijos</th>
                    <th className="p-3 rounded-tr-lg">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock Data para UI - Esto se conectará con el frontend real usando fetch('/api/employees') */}
                  <tr className="border-b">
                    <td className="p-3 font-medium">Carlos Ruiz</td>
                    <td className="p-3 text-gray-500">10203040</td>
                    <td className="p-3">$ 2.000.000</td>
                    <td className="p-3">4</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">Ver Horas</button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Ana Gómez</td>
                    <td className="p-3 text-gray-500">50607080</td>
                    <td className="p-3">$ 1.500.000</td>
                    <td className="p-3">1</td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">Ver Horas</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition-all">
              + Agregar Empleado
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Panel de Liquidación</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Periodo Actual: <strong className="text-slate-800">Octubre 2026</strong>
              </p>
              <div className="bg-blue-50 p-4 rounded text-sm text-blue-800 mb-4">
                El motor procesará:<br/>
                ✅ Bonificación por hijos<br/>
                ✅ Deducción Salud (4%)<br/>
                ✅ Deducción Pensión (4%)<br/>
                ✅ Cálculo de horas dinámicas
              </div>
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-md font-bold text-lg transition-all">
              Ejecutar Liquidación
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
