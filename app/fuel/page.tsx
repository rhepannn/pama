'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { supabase } from '@/lib/supabase'
import Toast from '@/components/Toast'

const GOLD  = '#F5A623'; const RED = '#E74C3C'; const GREEN = '#2ECC71'
const DIESEL_PRICE = 12500

function KPICard({ label, value, unit, sub, color = GOLD }: { label: string; value: string | number; unit?: string; sub?: string; color?: string }) {
  return (<div className="rounded-xl p-5 flex flex-col gap-1" style={{ background: '#0B1A33', border: '1px solid #152244' }}><span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#7B8BA3' }}>{label}</span><div className="flex items-end gap-2 mt-1"><span className="text-3xl font-black" style={{ color }}>{value}</span>{unit && <span className="text-sm pb-1" style={{ color: '#7B8BA3' }}>{unit}</span>}</div>{sub && <span className="text-xs" style={{ color: '#4A5C75' }}>{sub}</span>}</div>)
}

function fmtDate(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }

export default function FuelCost() {
  const [logs, setLogs] = useState<any[]>([]); const [units, setUnits] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false); const [toast, setToast] = useState<{message:string;type:'success'|'error'}|null>(null)
  const [form, setForm] = useState({ unit_id: '', log_date: fmtDate(new Date()), shift: 1, activity: 'loading', fuel_consumed: '', bcm_activity: '' })
  const [err, setErr] = useState('')

  const fetch = async () => {
    try {
    const t = fmtDate(new Date())
    const { data: l } = await supabase.from('fuel_logs').select('*, mining_units(unit_id, unit_type)').eq('log_date', t).order('fuel_consumed', { ascending: false })
    const { data: u } = await supabase.from('mining_units').select('*').order('unit_id')
    setLogs(l||[]); setUnits(u||[])
    } catch (err) { console.error('Fuel fetch error:', err) }
    setLoading(false)
  }
  useEffect(()=>{fetch()},[])

  const totalFuel = logs.reduce((s:number,l:any)=>s+Number(l.fuel_consumed),0)
  const cost = Math.round(totalFuel*DIESEL_PRICE)
  const wb = logs.filter((l:any)=>Number(l.bcm_activity)>0&&Number(l.fuel_consumed)>0)
  const avg = wb.length>0?(wb.reduce((s:number,l:any)=>s+(Number(l.fuel_consumed)/Number(l.bcm_activity)),0)/wb.length).toFixed(2):'0'
  const worst = wb.length>0?wb.reduce((max:any,l:any)=>{const r=Number(l.fuel_consumed)/Number(l.bcm_activity);return r>max.ratio?{unit:l.mining_units?.unit_id||'—',ratio:r}:max},{unit:'—',ratio:0}):{unit:'—',ratio:0}
  const top10 = logs.filter((l:any)=>Number(l.bcm_activity)>0&&Number(l.fuel_consumed)>0).map((l:any)=>({unitId:l.mining_units?.unit_id||'—',fuelPerBCM:Number(l.fuel_consumed)/Number(l.bcm_activity)})).sort((a:any,b:any)=>b.fuelPerBCM-a.fuelPerBCM).slice(0,10)
  const boros = logs.filter((l:any)=>Number(l.bcm_activity)>0&&(Number(l.fuel_consumed)/Number(l.bcm_activity))>4.5).length

  const submit = async (e:React.FormEvent) => {
    e.preventDefault(); setErr('')
    if(!form.unit_id){setErr('Pilih unit');return}
    if(!form.fuel_consumed||Number(form.fuel_consumed)<=0){setErr('Fuel harus > 0');return}
    const u = units.find(x=>x.unit_id===form.unit_id)
    if(!u){setErr('Unit tidak ditemukan');return}
    const { error } = await supabase.from('fuel_logs').insert({unit_id:u.id,log_date:form.log_date,shift:Number(form.shift),activity:form.activity,fuel_consumed:Number(form.fuel_consumed),bcm_activity:Number(form.bcm_activity)||null})
    if(error){setErr('Gagal: '+error.message);return}
    setShow(false); setForm({unit_id:'',log_date:fmtDate(new Date()),shift:1,activity:'loading',fuel_consumed:'',bcm_activity:''})
    setToast({message:'Data BBM berhasil disimpan',type:'success'}); fetch()
  }

  if(loading) return <div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-gray-700 rounded-full animate-spin" style={{borderTopColor:GOLD}}/></div>

  return (
    <div className="p-6 space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-white">Fuel & Cost Monitoring</h1><p className="text-sm mt-0.5" style={{color:'#7B8BA3'}}>Monitoring konsumsi BBM dan biaya operasional per unit</p></div>
        <button onClick={()=>setShow(true)} className="px-4 py-2 rounded-lg text-sm font-bold" style={{background:GOLD,color:'#060D1A'}}>+ Input BBM</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Total BBM Hari Ini" value={totalFuel.toLocaleString()} unit="Liter" sub="Seluruh unit · Shift berjalan"/>
        <KPICard label="Estimasi Biaya BBM" value={`Rp ${(cost/1_000_000).toFixed(1)}M`} sub={`@ Rp ${DIESEL_PRICE.toLocaleString()}/L`} color={RED}/>
        <KPICard label="Rata-rata Fuel/BCM" value={avg} unit="L/BCM" sub="Target ≤ 4.5 L/BCM" color={parseFloat(avg)>4.5?RED:GREEN}/>
        <KPICard label="Unit Boros" value={boros} unit="Unit" sub={`Dari ${wb.length} unit produktif`} color={boros>5?RED:GOLD}/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{background:'#0B1A33',border:'1px solid #152244'}}>
          <h3 className="text-sm font-semibold text-white mb-4">Top 10 Unit Paling Boros (L/BCM)</h3>
          {top10.length>0?(
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={top10} layout="vertical"><CartesianGrid stroke="#152244" strokeDasharray="3 3" horizontal={false}/><XAxis type="number" tick={{fill:'#7B8BA3',fontSize:10}} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="unitId" tick={{fill:'#7B8BA3',fontSize:10}} axisLine={false} tickLine={false} width={52}/><Tooltip contentStyle={{background:'#060D1A',border:'1px solid #1A3470',borderRadius:8}} formatter={(v:number)=>[`${v.toFixed(2)} L/BCM`]}/><ReferenceLine x={4.5} stroke={RED} strokeDasharray="4 4" label={{value:'Batas 4.5',fill:RED,fontSize:10,position:'top'}}/><Bar dataKey="fuelPerBCM" name="L/BCM" fill={RED} radius={[0,3,3,0]}/></BarChart>
            </ResponsiveContainer>
          ):<p className="text-xs text-center py-8" style={{color:'#4A5C75'}}>Belum ada data fuel</p>}
        </div>
        <div className="rounded-xl p-5 flex flex-col gap-4" style={{background:'#0B1A33',border:'1px solid #152244'}}>
          <h3 className="text-sm font-semibold text-white">Info Harga & Target</h3>
          <div className="space-y-3">
            {[['Harga Solar Industri',`Rp ${DIESEL_PRICE.toLocaleString()}/Liter`],['Target Fuel/BCM Excavator','≤ 3.0 L/BCM'],['Target Fuel/BCM Dump Truck','≤ 4.5 L/BCM'],['Target Fuel/BCM Dozer','≤ 5.0 L/BCM'],[`Total Unit Produktif Hari Ini`,`${wb.length} unit`]].map(([l,v])=>(<div key={l} className="flex justify-between items-center p-3 rounded-lg" style={{background:'#0F1F3D',border:'1px solid #152244'}}><span className="text-xs" style={{color:'#7B8BA3'}}>{l}</span><span className="text-xs font-bold text-white">{v}</span></div>))}
          </div>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{border:'1px solid #152244'}}>
        <div className="px-5 py-3 flex items-center justify-between" style={{background:'#060D1A',borderBottom:'1px solid #152244'}}><h3 className="text-sm font-semibold text-white">Detail Konsumsi BBM — Hari Ini</h3><span className="text-xs px-2 py-0.5 rounded" style={{background:'rgba(231,76,60,0.15)',color:RED}}>{boros} unit boros</span></div>
        <table className="w-full text-sm">
          <thead><tr style={{background:'#060D1A',borderBottom:'1px solid #152244'}}>{['Unit','Shift','Aktivitas','BBM (L)','BCM','Fuel/BCM','Status'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{color:'#7B8BA3'}}>{h}</th>)}</tr></thead>
          <tbody>{logs.map((r:any)=>{const ratio=Number(r.bcm_activity)>0?Number(r.fuel_consumed)/Number(r.bcm_activity):0;const isB=ratio>4.5;return(<tr key={r.id} style={{borderBottom:'1px solid #152244',background:isB?'rgba(231,76,60,0.05)':'transparent'}}><td className="px-4 py-2.5 font-mono font-bold text-white">{r.mining_units?.unit_id||'—'}</td><td className="px-4 py-2.5 text-xs" style={{color:'#4A5C75'}}>Shift {r.shift||1}</td><td className="px-4 py-2.5 text-xs capitalize" style={{color:'#7B8BA3'}}>{r.activity}</td><td className="px-4 py-2.5 text-xs font-mono text-white">{Number(r.fuel_consumed).toLocaleString()}</td><td className="px-4 py-2.5 text-xs font-mono text-white">{Number(r.bcm_activity||0).toLocaleString()}</td><td className="px-4 py-2.5 text-xs font-bold" style={{color:isB?RED:GREEN}}>{Number(r.bcm_activity)>0?ratio.toFixed(2):'—'}</td><td className="px-4 py-2.5"><span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:isB?'rgba(231,76,60,0.15)':'rgba(46,204,113,0.15)',color:isB?RED:GREEN,border:`1px solid ${isB?'#E74C3C40':'#2ECC7140'}`}}>{isB?'Boros':'Normal'}</span></td></tr>)})}{logs.length===0&&<tr><td colSpan={7} className="px-4 py-8 text-center text-xs" style={{color:'#4A5C75'}}>Belum ada data fuel hari ini</td></tr>}</tbody>
        </table>
      </div>
      {show&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.75)'}}>
          <div className="rounded-2xl w-full max-w-md shadow-2xl" style={{background:'#0B1A33',border:'1px solid #1A3470'}}>
            <div className="flex items-center justify-between p-5 border-b" style={{borderColor:'#152244'}}><h3 className="font-bold text-white">Input Data BBM</h3><button onClick={()=>setShow(false)} className="text-gray-500 hover:text-white p-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
            <form onSubmit={submit} className="p-5 space-y-4">
              {err&&<div className="px-3 py-2 rounded-lg text-xs" style={{background:'rgba(231,76,60,0.15)',color:RED,border:'1px solid #E74C3C40'}}>{err}</div>}
              <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#7B8BA3'}}>Unit *</label><select value={form.unit_id} onChange={e=>setForm(f=>({...f,unit_id:e.target.value}))} required className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{background:'#0F1F3D',border:'1px solid #1A3470'}}><option value="">Pilih Unit</option>{units.map(u=><option key={u.id} value={u.unit_id}>{u.unit_id}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#7B8BA3'}}>Tanggal</label><input type="date" value={form.log_date} onChange={e=>setForm(f=>({...f,log_date:e.target.value}))} required className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{background:'#0F1F3D',border:'1px solid #1A3470'}}/></div><div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#7B8BA3'}}>Shift</label><select value={form.shift} onChange={e=>setForm(f=>({...f,shift:Number(e.target.value)}))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{background:'#0F1F3D',border:'1px solid #1A3470'}}><option value={1}>Shift 1</option><option value={2}>Shift 2</option><option value={3}>Shift 3</option></select></div></div>
              <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#7B8BA3'}}>Aktivitas</label><select value={form.activity} onChange={e=>setForm(f=>({...f,activity:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{background:'#0F1F3D',border:'1px solid #1A3470'}}><option value="loading">Loading</option><option value="hauling">Hauling</option><option value="dumping">Dumping</option><option value="dozing">Dozing</option><option value="grading">Grading</option><option value="drilling">Drilling</option><option value="idle">Idle</option><option value="standby">Standby</option></select></div>
              <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#7B8BA3'}}>Fuel Consumed (Liter) *</label><input type="number" step="0.1" min="0" value={form.fuel_consumed} onChange={e=>setForm(f=>({...f,fuel_consumed:e.target.value}))} required className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{background:'#0F1F3D',border:'1px solid #1A3470'}}/></div>
              <div><label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{color:'#7B8BA3'}}>BCM Activity (opsional)</label><input type="number" step="0.1" min="0" value={form.bcm_activity} onChange={e=>setForm(f=>({...f,bcm_activity:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm text-white" style={{background:'#0F1F3D',border:'1px solid #1A3470'}}/></div>
              <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold" style={{background:GOLD,color:'#060D1A'}}>Simpan Data BBM</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
