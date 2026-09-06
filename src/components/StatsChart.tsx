import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts'

const priceData = [
  { year: '2019', price: 85 },
  { year: '2020', price: 92 },
  { year: '2021', price: 110 },
  { year: '2022', price: 128 },
  { year: '2023', price: 145 },
  { year: '2024', price: 162 },
]
const typeData = [
  { type: 'Casa', count: 42 },
  { type: 'Apto', count: 28 },
  { type: 'Condo', count: 18 },
  { type: 'Lote', count: 10 },
  { type: 'Villa', count: 7 },
]

export default function StatsChart(){
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h4 className="font-semibold text-slate-900 text-sm mb-3">Evolución precio/m² (San José, en miles CRC)</h4>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
              <XAxis dataKey="year" tick={{fontSize:12}}/>
              <YAxis tick={{fontSize:12}}/>
              <Tooltip/>
              <Area type="monotone" dataKey="price" stroke="#0284c7" fill="#e0f2fe" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h4 className="font-semibold text-slate-900 text-sm mb-3">Distribución de inventario</h4>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
              <XAxis dataKey="type" tick={{fontSize:12}}/>
              <YAxis tick={{fontSize:12}}/>
              <Tooltip/>
              <Bar dataKey="count" fill="#0ea5e9" radius={[8,8,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
