"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"

const segmentos = [
  "Salud",
  "Familia", 
  "Amigos",
  "Finanzas",
  "Trabajo",
  "Ocio",
  "Crecimiento",
  "Espiritualidad"
]

const coloresSegmentos = [
  "#89CFF0",
  "#A5D8E6", 
  "#F8C8DC",
  "#B5EAD7",
  "#FFDAC1",
  "#C5DCA0",
  "#F2CFC5",
  "#D3C0EB"
]

export default function RuedaVida() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [valores, setValores] = useState<number[]>(new Array(8).fill(1))
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [segmentoSeleccionado, setSegmentoSeleccionado] = useState<number | null>(null)

  const dibujarRueda = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 80
    const angleStep = (2 * Math.PI) / segmentos.length

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibujar anillos de referencia
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1
    for (let i = 1; i <= 10; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (radius * i) / 10, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Dibujar segmentos
    segmentos.forEach((segmento, index) => {
      const startAngle = index * angleStep - Math.PI / 2
      const endAngle = (index + 1) * angleStep - Math.PI / 2
      const valor = valores[index]
      const segmentRadius = (radius * valor) / 10

      // Rellenar segmento según valor
      ctx.fillStyle = coloresSegmentos[index]
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, segmentRadius, startAngle, endAngle)
      ctx.closePath()
      ctx.fill()

      // Borde del segmento completo
      ctx.strokeStyle = '#2c3e50'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.stroke()

      // Destacar segmento seleccionado
      if (segmentoSeleccionado === index) {
        ctx.strokeStyle = '#00a8e8'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.stroke()
      }
    })
  }

  const manejarClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 40

    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= radius) {
      let angle = Math.atan2(dy, dx) + Math.PI / 2
      if (angle < 0) angle += 2 * Math.PI

      const segmentIndex = Math.floor(angle / ((2 * Math.PI) / segmentos.length))
      const nivel = Math.ceil((distance / radius) * 10)

      setSegmentoSeleccionado(segmentIndex)
      
      const nuevosValores = [...valores]
      nuevosValores[segmentIndex] = Math.max(1, Math.min(10, nivel))
      setValores(nuevosValores)
    }
  }

  const generarResultado = () => {
    setMostrarResultado(true)
  }

  const reiniciar = () => {
    setValores(new Array(8).fill(1))
    setMostrarResultado(false)
    setSegmentoSeleccionado(null)
  }

  const obtenerComentario = (valor: number) => {
    if (valor <= 5) return "Necesita atención"
    if (valor <= 7) return "Moderado"
    return "Buen equilibrio"
  }

  const obtenerSugerencias = () => {
    const areasAtencion = segmentos
      .map((segmento, index) => ({ segmento, valor: valores[index] }))
      .filter(item => item.valor <= 5)

    if (areasAtencion.length === 0) {
      return ["¡Felicidades! Todas las áreas están en buen equilibrio."]
    }

    const sugerencias: { [key: string]: string } = {
      "Salud": "Considera incorporar ejercicio regular y una alimentación balanceada",
      "Familia": "Dedica más tiempo de calidad con tus seres queridos",
      "Amigos": "Fortalece tus relaciones sociales y cultiva nuevas amistades",
      "Finanzas": "Revisa tu presupuesto y considera opciones de ahorro e inversión",
      "Trabajo": "Evalúa tu satisfacción laboral y oportunidades de crecimiento",
      "Ocio": "Incluye más actividades recreativas y hobbies en tu rutina",
      "Crecimiento": "Invierte en tu desarrollo personal y profesional",
      "Espiritualidad": "Dedica tiempo a la reflexión y prácticas que nutran tu espíritu"
    }

    return areasAtencion.map(area => `${area.segmento}: ${sugerencias[area.segmento]}`)
  }

  const datosRadar = segmentos.map((segmento, index) => ({
    area: segmento,
    valor: valores[index]
  }))

  useEffect(() => {
    dibujarRueda()
  }, [valores, segmentoSeleccionado])

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20" style={{ color: '#2c3e50' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabecera */}
        <div className="text-center py-8">
          <h1 
            className="text-5xl mb-6 bg-gradient-to-r from-[#00a8e8] to-[#89CFF0] bg-clip-text font-bold tracking-tighter text-zinc-900"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Rueda de la Vida
          </h1>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed text-slate-600 font-light">
            Toca cada segmento para reflejar tu nivel de satisfacción. Respira, reflexiona y evalúa con calma.
          </p>
        </div>

        {/* Rueda Interactiva */}
        <div className="flex justify-center py-8">
          <div className="relative w-full max-w-4xl">
            {/* Contenedor principal con más espacio */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 rounded-full blur-xl transform scale-110"></div>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={800}
                  onClick={manejarClick}
                  className="relative cursor-pointer rounded-full shadow-2xl shadow-blue-100/50 bg-white/80 backdrop-blur-sm"
                  style={{ maxWidth: '90vw', height: 'auto' }}
                />
              </div>
            </div>
            
            {/* Etiquetas externas para mejor visibilidad */}
            <div className="absolute inset-0 pointer-events-none">
              {segmentos.map((segmento, index) => {
                const angle = (index * (360 / segmentos.length)) - 90;
                const radius = 45; // Porcentaje desde el centro
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                
                return (
                  <div
                    key={segmento}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                  >
                    <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-white/60 ring-1 ring-blue-100/30">
                      <span className="text-sm font-medium text-slate-800 whitespace-nowrap">
                        {segmento}
                      </span>
                      <div className="text-xs text-center text-slate-600 mt-1">
                        {valores[index]}/10
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-6 py-4">
          <Button 
            onClick={generarResultado}
            className="bg-white/90 backdrop-blur-md hover:bg-white text-[#00a8e8] border border-white/80 shadow-xl shadow-blue-200/50 px-8 py-3 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-blue-300/60 ring-1 ring-blue-100/30"
          >
            Evaluar
          </Button>
          <Button 
            onClick={reiniciar}
            className="bg-white/80 backdrop-blur-md hover:bg-white/90 text-slate-700 border border-white/70 shadow-xl shadow-slate-200/50 px-8 py-3 rounded-full transition-all duration-300 hover:shadow-2xl ring-1 ring-slate-100/30"
          >
            Volver a empezar
          </Button>
        </div>

        {/* Resultados */}
        {mostrarResultado && (
          <div className="space-y-8 pt-8">
            {/* Gráfico Radar */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl shadow-blue-200/40 border border-white/60 ring-1 ring-blue-100/20">
              <h3 className="text-2xl font-light text-center mb-6 text-slate-800">Tu Equilibrio Interior</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={datosRadar}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="area" className="text-slate-700 font-medium" />
                    <PolarRadiusAxis domain={[0, 10]} stroke="#cbd5e1" />
                    <Radar
                      name="Nivel"
                      dataKey="valor"
                      stroke="#00a8e8"
                      fill="#89CFF0"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tabla Resumen */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl shadow-blue-200/40 border border-white/60 ring-1 ring-blue-100/20">
              <h3 className="text-2xl font-light text-center mb-6 text-slate-800">Reflexión por Área</h3>
              <div className="bg-white/40 rounded-2xl p-4 backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-300/50">
                      <TableHead className="text-slate-700 font-medium">Área</TableHead>
                      <TableHead className="text-slate-700 font-medium">Nivel</TableHead>
                      <TableHead className="text-slate-700 font-medium">Reflexión</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {segmentos.map((segmento, index) => (
                      <TableRow key={segmento} className="border-slate-300/30">
                        <TableCell className="font-medium text-slate-800">{segmento}</TableCell>
                        <TableCell className="text-slate-700 font-medium">{valores[index]}/10</TableCell>
                        <TableCell className="text-slate-700">{obtenerComentario(valores[index])}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Sugerencias */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl shadow-blue-200/40 border border-white/60 ring-1 ring-blue-100/20">
              <h3 className="text-2xl font-light text-center mb-6 text-slate-800">Caminos de Crecimiento</h3>
              <div className="bg-white/40 rounded-2xl p-6 backdrop-blur-sm">
                <ul className="space-y-4">
                  {obtenerSugerencias().map((sugerencia, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#00a8e8] mr-3 text-xl">◦</span>
                      <span className="text-slate-700 leading-relaxed">{sugerencia}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
