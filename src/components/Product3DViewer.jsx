import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Droplets, ArrowDownRight, CheckCircle2 } from 'lucide-react';

// ==========================================
// 1. COMPONENTE: AGUA DENTRO DEL TANQUE
// ==========================================
function WaterInTank({ level }) {
  const meshRef = useRef();
  const surfaceRef = useRef();
  const maxH = 2.6;
  const currentH = Math.max(0.1, maxH * (level / 100));
  const posY = -1.3 + currentH / 2;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (surfaceRef.current) {
      surfaceRef.current.position.y = posY + currentH / 2;
      surfaceRef.current.scale.set(
        1 + Math.sin(t * 3) * 0.02,
        1,
        1 + Math.cos(t * 3) * 0.02
      );
    }
  });

  return (
    <group>
      {/* Volumen cilíndrico del agua */}
      <mesh ref={meshRef} position={[0, posY, 0]}>
        <cylinderGeometry args={[0.95, 0.95, currentH, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.75}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Superficie oscilante del agua */}
      <mesh ref={surfaceRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.94, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.85}
          roughness={0.05}
        />
      </mesh>
    </group>
  );
}

// ==========================================
// 2. COMPONENTE: TANQUE CISTERNA INDUSTRIAL
// ==========================================
function CisternaTank({ waterLevel }) {
  return (
    <group position={[-1.7, 0, 0]}>
      {/* Cuerpo translúcido de la cisterna */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 2.7, 32]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.3}
          roughness={0.15}
          metalness={0.1}
          transmission={0.6}
          ior={1.3}
        />
      </mesh>

      {/* Agua interna dinámica */}
      <WaterInTank level={waterLevel} />

      {/* Tapa y base del tanque (acero azul) */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.15, 32]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0369a1" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.15, 32]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Anillos de refuerzo metálicos */}
      {[-0.6, 0.1, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[1.01, 0.02, 16, 32]} />
          <meshStandardMaterial color="#0369a1" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Patas de soporte del tanque */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={i} position={[x, -1.6, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.15, 0.4, 1.6]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Tubería de salida inferior con válvula */}
      <group position={[0.9, -1.1, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Volante de la válvula */}
        <mesh position={[0.25, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.12, 0.02, 8, 16]} />
          <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// 3. COMPONENTE: OPERADOR DE AQUA-FORTE
// ==========================================
function OperatorFigure({ isDelivering }) {
  const armRef = useRef();

  useFrame((state) => {
    if (armRef.current && isDelivering) {
      armRef.current.rotation.z = -0.3 + Math.sin(state.clock.getElapsedTime() * 4) * 0.05;
    }
  });

  return (
    <group position={[0.2, -0.6, 0.3]}>
      {/* Casco amarillo de seguridad */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.23, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} />
      </mesh>
      {/* Cabeza */}
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.7} />
      </mesh>

      {/* Torso con chaleco reflectivo naranja */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.42, 0.52, 0.26]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </mesh>
      {/* Franja reflectiva del chaleco */}
      <mesh position={[0, 0.22, 0.135]}>
        <boxGeometry args={[0.4, 0.08, 0.01]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.3} />
      </mesh>

      {/* Piernas (pantalón de trabajo azul oscuro) */}
      <mesh position={[-0.12, -0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.65, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.12, -0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.65, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Brazo sujetando la manguera */}
      <group ref={armRef} position={[0.2, 0.35, 0]} rotation={[0, 0, -0.3]}>
        <mesh position={[0.2, -0.1, 0.1]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.06, 0.06, 0.45, 12]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>
        {/* Boquilla de la manguera */}
        <mesh position={[0.4, -0.25, 0.15]} rotation={[0, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.04, 0.06, 0.25, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// 4. COMPONENTE: CLIENTE Y SU TURRIL (200L)
// ==========================================
function ClientAndTurril({ turrilLevel, isDelivering }) {
  const currentTurrilH = Math.max(0.05, 0.9 * (turrilLevel / 100));

  return (
    <group position={[1.8, -0.8, 0]}>
      {/* Turril azul tradicional de 200L */}
      <group position={[0, -0.3, 0.2]}>
        {/* Tambor exterior */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.95, 24]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Aros de refuerzo negros del turril */}
        {[-0.15, 0.15].map((y, i) => (
          <mesh key={i} position={[0, 0.45 + y, 0]}>
            <torusGeometry args={[0.425, 0.02, 12, 24]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}

        {/* Agua dentro del turril que se va llenando */}
        <mesh position={[0, 0.05 + currentTurrilH / 2, 0]}>
          <cylinderGeometry args={[0.39, 0.39, currentTurrilH, 24]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Figura del Cliente */}
      <group position={[0.8, 0.2, -0.2]}>
        {/* Cabeza del cliente */}
        <mesh position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.7} />
        </mesh>
        {/* Cabello */}
        <mesh position={[0, 0.74, -0.03]}>
          <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        {/* Torso (ropa casual celeste) */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.38, 0.5, 0.24]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Piernas (pantalón negro) */}
        <mesh position={[-0.1, -0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.7, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.1, -0.35, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.7, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// 5. COMPONENTE: MANGUERA Y CHORRO DE AGUA
// ==========================================
function HoseAndWaterStream({ isDelivering }) {
  const streamRef = useRef();

  useFrame((state) => {
    if (streamRef.current && isDelivering) {
      const t = state.clock.getElapsedTime();
      streamRef.current.material.opacity = 0.75 + Math.sin(t * 15) * 0.2;
    }
  });

  return (
    <group>
      {/* Manguera negra que va de la cisterna al operador */}
      <mesh position={[-0.3, -1.1, 0.2]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Chorro de agua animado (cuando está despachando) */}
      {isDelivering && (
        <group position={[1.15, -0.65, 0.35]} rotation={[0, 0, -Math.PI / 3]}>
          <mesh ref={streamRef}>
            <cylinderGeometry args={[0.035, 0.06, 0.9, 12]} />
            <meshStandardMaterial
              color="#38bdf8"
              transparent
              opacity={0.85}
              emissive="#0284c7"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ==========================================
// 6. COMPONENTE: PLATAFORMA BASE
// ==========================================
function StationPlatform() {
  return (
    <group position={[0, -1.7, 0]}>
      {/* Base circular de cemento */}
      <mesh receiveShadow>
        <cylinderGeometry args={[3.8, 4.0, 0.25, 48]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Borde reflectante */}
      <mesh position={[0, 0.13, 0]}>
        <torusGeometry args={[3.8, 0.03, 16, 48]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// ==========================================
// VISOR 3D PRINCIPAL EXPORTADO
// ==========================================
export function Product3DViewer({ productName = "Tanque Cisterna Aqua-Forte" }) {
  // Estado de simulación de llenado / vaciado
  const [tankLevel, setTankLevel] = useState(85); // 0 a 100%
  const [turrilLevel, setTurrilLevel] = useState(30); // 0 a 100%
  const [isDelivering, setIsDelivering] = useState(false);
  const [autoCycle, setAutoCycle] = useState(false);

  // Litros totales de la cisterna (ej. 5,000 Litros de capacidad)
  const TANK_CAPACITY_LITERS = 5000;
  const currentLiters = Math.round((tankLevel / 100) * TANK_CAPACITY_LITERS);

  // Efecto para la simulación animada de entrega o auto-ciclo
  useEffect(() => {
    if (!isDelivering && !autoCycle) return;

    const interval = setInterval(() => {
      setTankLevel((prev) => {
        if (prev <= 10) {
          if (autoCycle) {
            // Auto recargar al llegar al fondo
            setTurrilLevel(0);
            return 100;
          }
          setIsDelivering(false);
          return 10;
        }
        return Math.max(10, prev - 1.5);
      });

      setTurrilLevel((prev) => {
        if (prev >= 100) return autoCycle ? 0 : 100;
        return Math.min(100, prev + 3);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isDelivering, autoCycle]);

  const handleRefill = () => {
    setIsDelivering(false);
    setTankLevel(100);
    setTurrilLevel(15);
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden flex flex-col p-4">
      {/* Barra Superior con Métricas en Vivo */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2 z-10">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isDelivering ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            {productName}
          </span>
        </div>

        {/* Indicador de Litros y Porcentaje */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <Droplets className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-bold">{currentLiters.toLocaleString()} L</span>
          <span className="text-cyan-400 font-semibold">({Math.round(tankLevel)}%)</span>
        </div>
      </div>

      {/* Escena 3D Canvas */}
      <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-950/70 border border-slate-800/80">
        <Canvas camera={{ position: [0, 1.2, 5.5], fov: 48 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 4]} intensity={1.4} castShadow />
          <pointLight position={[-4, 3, -2]} color="#06b6d4" intensity={2} />
          <pointLight position={[3, -1, 3]} color="#38bdf8" intensity={1.5} />

          {/* Elementos 3D */}
          <group position={[0, 0, 0]}>
            <CisternaTank waterLevel={tankLevel} />
            <OperatorFigure isDelivering={isDelivering} />
            <ClientAndTurril turrilLevel={turrilLevel} isDelivering={isDelivering} />
            <HoseAndWaterStream isDelivering={isDelivering} />
            <StationPlatform />
          </group>

          <OrbitControls
            enableZoom={true}
            maxPolarAngle={Math.PI / 2 + 0.05} // No mirar desde abajo del piso
            minDistance={3}
            maxDistance={8}
          />
        </Canvas>

        {/* Overlay informativo del estado de la entrega */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 pointer-events-none flex items-center gap-2">
          {isDelivering ? (
            <>
              <ArrowDownRight className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span>Operador despachando agua a cliente...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tanque listo para despacho</span>
            </>
          )}
        </div>

        {/* Mensaje de navegación 3D */}
        <div className="absolute bottom-2 left-0 w-full text-center pointer-events-none">
          <p className="text-[11px] text-slate-400">
            🖱️ Arrastra para rotar 360° • Rueda del mouse para Zoom
          </p>
        </div>
      </div>

      {/* Barra de Controles Interactivos de Simulación */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Slider manual de nivel */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="text-slate-400 text-[11px]">Nivel Cisterna:</span>
          <input
            type="range"
            min="5"
            max="100"
            value={tankLevel}
            onChange={(e) => {
              setIsDelivering(false);
              setAutoCycle(false);
              setTankLevel(Number(e.target.value));
            }}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <span className="font-mono text-cyan-400 w-9 text-right">{Math.round(tankLevel)}%</span>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAutoCycle(false);
              setIsDelivering(!isDelivering);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              isDelivering
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20'
            }`}
          >
            {isDelivering ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isDelivering ? 'Pausar Entrega' : 'Simular Entrega'}</span>
          </button>

          <button
            onClick={handleRefill}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
            title="Llenar tanque al 100%"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Llenar Tanque</span>
          </button>
        </div>
      </div>
    </div>
  );
}
