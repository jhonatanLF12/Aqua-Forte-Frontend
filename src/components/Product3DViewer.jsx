import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Play, Pause, RotateCcw, Droplets, Truck, Layers, 
  CheckCircle2, Gauge, Activity, ShieldCheck, ArrowRight, Sparkles
} from 'lucide-react';

// ============================================================================
// 1. MODELO 3D: CAMIÓN CISTERNA INDUSTRIAL (AQUA-FORTE HEAVY DUTY TANKER)
// ============================================================================
function WaterTankerTruck() {
  const wheelRotation = useRef();

  return (
    <group position={[-1.6, 0, 0]}>
      {/* ----------------- CHASIS Y LARGUEROS ----------------- */}
      <mesh position={[-0.4, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.18, 0.85]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.8} />
      </mesh>

      {/* Tanque de combustible y caja de herramientas */}
      <mesh position={[-0.9, 0.32, 0.52]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.9, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[-0.9, 0.32, -0.52]} castShadow>
        <boxGeometry args={[0.9, 0.35, 0.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* ----------------- CABINA MODERNA ----------------- */}
      <group position={[-2.0, 0, 0]}>
        {/* Cuerpo principal de la cabina */}
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 1.15, 1.45]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Techo aerodinámico / visera */}
        <mesh position={[0.05, 1.58, 0]} castShadow>
          <boxGeometry args={[1.25, 0.12, 1.42]} />
          <meshStandardMaterial color="#0369a1" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Parabrisas delantero (cristal ahumado translúcido) */}
        <mesh position={[-0.68, 1.12, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.04, 0.65, 1.32]} />
          <meshPhysicalMaterial
            color="#94a3b8"
            transparent
            opacity={0.65}
            roughness={0.05}
            metalness={0.2}
            transmission={0.7}
            ior={1.4}
          />
        </mesh>

        {/* Ventanas laterales */}
        {[-0.73, 0.73].map((z, idx) => (
          <mesh key={idx} position={[-0.05, 1.15, z]}>
            <boxGeometry args={[0.7, 0.5, 0.03]} />
            <meshPhysicalMaterial
              color="#94a3b8"
              transparent
              opacity={0.65}
              roughness={0.05}
              transmission={0.7}
            />
          </mesh>
        ))}

        {/* Parrilla frontal cromada con textura */}
        <mesh position={[-0.69, 0.62, 0]}>
          <boxGeometry args={[0.03, 0.45, 1.15]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {[-0.1, 0, 0.1].map((yOff, i) => (
          <mesh key={i} position={[-0.71, 0.62 + yOff, 0]}>
            <boxGeometry args={[0.02, 0.04, 1.05]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}

        {/* Faros delanteros LED con emisión de luz */}
        {[-0.52, 0.52].map((z, i) => (
          <group key={i} position={[-0.7, 0.52, z]}>
            <mesh>
              <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#fef08a"
                emissiveIntensity={1.2}
                roughness={0.1}
              />
            </mesh>
          </group>
        ))}

        {/* Parachoques delantero reforzado */}
        <mesh position={[-0.75, 0.32, 0]} castShadow>
          <boxGeometry args={[0.22, 0.28, 1.62]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.6} />
        </mesh>

        {/* Espejos retrovisores */}
        {[-0.82, 0.82].map((z, i) => (
          <group key={i} position={[-0.45, 1.15, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.06, 0.32, 0.12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.4} />
            </mesh>
            <mesh position={[0.02, 0, z > 0 ? -0.06 : 0.06]}>
              <boxGeometry args={[0.02, 0.28, 0.02]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ----------------- TANQUE CISTERNA HORIZONTAL ----------------- */}
      <group position={[0.65, 1.25, 0]}>
        {/* Cuerpo cilíndrico del tanque (Acero Inoxidable / Pintura Marina) */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.82, 0.82, 3.2, 36]} />
          <meshStandardMaterial
            color="#f1f5f9"
            metalness={0.88}
            roughness={0.18}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Tapas abombadas (extremos esféricos del tanque) */}
        <mesh position={[-1.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <sphereGeometry args={[0.82, 24, 24, 0, Math.PI * 2, 0, Math.PI / 4]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.18} />
        </mesh>
        <mesh position={[1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <sphereGeometry args={[0.82, 24, 24, 0, Math.PI * 2, 0, Math.PI / 4]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.18} />
        </mesh>

        {/* Franja y logotipo institucional Aqua-Forte */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.825, 0.825, 1.6, 36, 1, true]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Emblema lateral de Aqua-Forte */}
        <group position={[0, 0, 0.835]}>
          <mesh>
            <planeGeometry args={[1.3, 0.35]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.14}
            color="#0369a1"
            font={undefined}
            anchorX="center"
            anchorY="middle"
          >
            AQUA-FORTE
          </Text>
        </group>

        {/* Abrazaderas metálicas de fijación al chasis */}
        {[-1.1, 0, 1.1].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.84, 0.035, 16, 36]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Cúpulas superiores (bocas de inspección y carga) */}
        {[-0.6, 0.6].map((x, i) => (
          <group key={i} position={[x, 0.82, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.26, 0.28, 0.14, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.06, 24]} />
              <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Pasarela superior de servicio */}
        <mesh position={[0, 0.84, 0]}>
          <boxGeometry args={[2.8, 0.04, 0.35]} />
          <meshStandardMaterial color="#475569" roughness={0.9} metalness={0.4} />
        </mesh>

        {/* Escalera de acceso trasera */}
        <group position={[1.58, -0.35, 0.4]}>
          {[-0.4, -0.15, 0.1, 0.35].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 0.32, 8]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
            </mesh>
          ))}
          <mesh position={[0, 0, -0.16]}>
            <cylinderGeometry args={[0.02, 0.02, 0.95, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <cylinderGeometry args={[0.02, 0.02, 0.95, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
          </mesh>
        </group>

        {/* ----------------- GABINETE TRASERO DE BOMBA Y CONTROL ----------------- */}
        <group position={[1.4, -0.55, 0]}>
          {/* Caja de motobomba industrial */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.65, 0.65, 1.2]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
          </mesh>

          {/* Válvula de salida principal de 3 pulgadas */}
          <group position={[0.33, -0.1, 0.35]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.22, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
            </mesh>
            {/* Volante de compuerta roja */}
            <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.1, 0.02, 8, 16]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.6} />
            </mesh>
          </group>

          {/* Manómetros de presión análogos */}
          {[-0.15, 0.15].map((z, i) => (
            <mesh key={i} position={[0.33, 0.15, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ----------------- RUEDAS DETALLADAS (NEUMÁTICOS Y RINES) ----------------- */}
      {[
        { x: -2.0, z: 0.62 }, { x: -2.0, z: -0.62 }, // Delanteras
        { x: 0.1, z: 0.62 },  { x: 0.1, z: -0.62 },   // Traseras dobles 1
        { x: 1.1, z: 0.62 },  { x: 1.1, z: -0.62 }    // Traseras dobles 2
      ].map((pos, idx) => (
        <group key={idx} position={[pos.x, 0.38, pos.z]}>
          {/* Neumático de caucho negro ranurado */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.26, 24]} />
            <meshStandardMaterial color="#090d16" roughness={0.9} metalness={0.1} />
          </mesh>
          {/* Rin de aleación metálico */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.27, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Tapa central del cubo */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.29, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Guardabarros traseros curvos */}
      {[0.1, 1.1].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.52, 0.64]}>
            <boxGeometry args={[0.75, 0.04, 0.32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          <mesh position={[x, 0.52, -0.64]}>
            <boxGeometry args={[0.75, 0.04, 0.32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================================================
// 2. MODELO: MANGUERA INDUSTRIAL CURVA 3D DINÁMICA
// ============================================================================
function IndustrialDeliveryHose({ destination }) {
  // Genera una curva Bézier tridimensional suave adaptada al objetivo
  const curve = useMemo(() => {
    // Origen: Salida de la motobomba del camión
    const pStart = new THREE.Vector3(-0.05, 0.6, 0.35);
    // Caída al piso
    const pGround1 = new THREE.Vector3(0.3, 0.09, 0.55);
    // Tendido por el suelo
    const pGround2 = new THREE.Vector3(1.1, 0.09, 0.6);

    let pRise, pTarget;
    if (destination === 'turril') {
      pRise = new THREE.Vector3(1.7, 0.65, 0.45);
      pTarget = new THREE.Vector3(2.05, 1.25, 0.2); // Boca superior del turril
    } else {
      pRise = new THREE.Vector3(1.6, 0.25, 0.4);
      pTarget = new THREE.Vector3(2.0, 0.25, 0.1); // Escotilla del reservorio subterráneo
    }

    return new THREE.CatmullRomCurve3([pStart, pGround1, pGround2, pRise, pTarget]);
  }, [destination]);

  return (
    <group>
      {/* Tubo de manguera de alta presión acanalada */}
      <mesh castShadow>
        <tubeGeometry args={[curve, 48, 0.048, 12, false]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.7}
          metalness={0.3}
          bumpScale={0.05}
        />
      </mesh>

      {/* Boquilla / Pistola de despacho de latón cromado */}
      <mesh
        position={destination === 'turril' ? [2.05, 1.25, 0.2] : [2.0, 0.25, 0.1]}
        rotation={[0, 0, Math.PI / 2.5]}
      >
        <cylinderGeometry args={[0.065, 0.08, 0.26, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ============================================================================
// 3. MODELO DESTINO A: TURRIL VERTICAL AZUL (200 LITROS)
// ============================================================================
function TurrilDestination({ fillLevel }) {
  const maxWaterHeight = 1.05;
  const currentHeight = Math.max(0.04, maxWaterHeight * (fillLevel / 100));
  const waterY = 0.08 + currentHeight / 2;

  return (
    <group position={[2.1, 0, 0.2]}>
      {/* Cuerpo principal del turril (Polietileno azul alta densidad) */}
      <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 1.18, 32]} />
        <meshStandardMaterial color="#0284c7" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Aros de refuerzo circunferenciales negros */}
      {[-0.28, 0.05, 0.38].map((yOff, i) => (
        <mesh key={i} position={[0, 0.62 + yOff, 0]}>
          <torusGeometry args={[0.425, 0.022, 12, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
      ))}

      {/* Tapa con anillo de bloqueo */}
      <mesh position={[0, 1.21, 0]}>
        <cylinderGeometry args={[0.43, 0.43, 0.04, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Visor frontal transparente con escala graduada de litros */}
      <mesh position={[0, 0.62, 0.421]}>
        <planeGeometry args={[0.18, 0.95]} />
        <meshPhysicalMaterial
          color="#bae6fd"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.8}
        />
      </mesh>

      {/* Agua interna translúcida que sube dinámicamente */}
      <mesh position={[0, waterY, 0]}>
        <cylinderGeometry args={[0.395, 0.395, currentHeight, 32]} />
        <meshPhysicalMaterial
          color="#06b6d4"
          transparent
          opacity={0.82}
          roughness={0.08}
          metalness={0.1}
          transmission={0.5}
        />
      </mesh>

      {/* Superficie oscilante del agua */}
      <mesh position={[0, 0.08 + currentHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.39, 32]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.05} transparent opacity={0.9} />
      </mesh>

      {/* Base tarima de madera/palet */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.05, 0.08, 1.05]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ============================================================================
// 4. MODELO DESTINO B: TANQUE SUBTERRÁNEO / RESERVORIO (2,500 L)
// ============================================================================
function UndergroundTankDestination({ fillLevel }) {
  const maxWaterH = 1.05;
  const currentWaterH = Math.max(0.04, maxWaterH * (fillLevel / 100));
  const waterCenterY = -1.15 + currentWaterH / 2;

  return (
    <group position={[2.1, 0, 0.2]}>
      {/* Marco de hormigón armado en la superficie */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.65, 0.08, 1.65]} />
        <meshStandardMaterial color="#475569" roughness={0.85} />
      </mesh>

      {/* Señalización de seguridad perimetral amarilla/negra */}
      {[-0.78, 0.78].map((x, i) => (
        <mesh key={i} position={[x, 0.085, 0]}>
          <boxGeometry args={[0.07, 0.01, 1.62]} />
          <meshStandardMaterial color="#eab308" roughness={0.4} />
        </mesh>
      ))}

      {/* Escotilla metálica circular abierta */}
      <mesh position={[0, 0.09, 0]}>
        <ringGeometry args={[0.42, 0.55, 32]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Tapa abatida con bisagra */}
      <mesh position={[0.48, 0.42, 0]} rotation={[0, 0, Math.PI / 3]}>
        <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Pozo y paredes subterráneas de concreto impermeable */}
      <mesh position={[0, -0.65, 0]} receiveShadow>
        <boxGeometry args={[1.4, 1.3, 1.4]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.95}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Agua líquida subterránea cristalina */}
      <mesh position={[0, waterCenterY, 0]}>
        <boxGeometry args={[1.36, currentWaterH, 1.36]} />
        <meshPhysicalMaterial
          color="#0284c7"
          transparent
          opacity={0.82}
          roughness={0.06}
          metalness={0.1}
          transmission={0.65}
        />
      </mesh>

      {/* Superficie del agua subterránea */}
      <mesh position={[0, -1.15 + currentWaterH, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.35, 1.35]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.04}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Escalera marinera interior de acero inoxidable */}
      <group position={[-0.62, -0.6, 0]}>
        {[-0.45, -0.2, 0.05, 0.3].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ============================================================================
// 5. ANIMACIÓN: CHORRO DE AGUA A PRESIÓN Y SALPICADURAS
// ============================================================================
function WaterFlowStream({ isDelivering, destination, fillLevel }) {
  const streamRef = useRef();
  const splashRingRef = useRef();

  useFrame((state) => {
    if (!isDelivering) return;
    const t = state.clock.getElapsedTime();

    // Pulso realista del chorro de agua a alta presión
    if (streamRef.current) {
      streamRef.current.scale.x = 1 + Math.sin(t * 22) * 0.12;
      streamRef.current.scale.z = 1 + Math.cos(t * 22) * 0.12;
      streamRef.current.material.opacity = 0.78 + Math.sin(t * 18) * 0.15;
    }

    // Ondas expansivas de impacto
    if (splashRingRef.current) {
      splashRingRef.current.scale.setScalar(1 + (t * 4 % 1) * 0.4);
      splashRingRef.current.material.opacity = 0.8 * (1 - (t * 4 % 1));
    }
  });

  if (!isDelivering) return null;

  if (destination === 'turril') {
    // Cálculo de altura de caída en turril
    const surfaceY = 0.08 + Math.max(0.04, 1.05 * (fillLevel / 100));
    const streamHeight = Math.max(0.15, 1.25 - surfaceY);
    const centerY = surfaceY + streamHeight / 2;

    return (
      <group position={[2.08, 0, 0.2]}>
        {/* Columna de chorro turbulento de agua */}
        <mesh ref={streamRef} position={[0, centerY, 0]}>
          <cylinderGeometry args={[0.035, 0.075, streamHeight, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.88}
            emissive="#0284c7"
            emissiveIntensity={0.6}
            roughness={0.1}
          />
        </mesh>

        {/* Anillo de ondas y espuma en la superficie de impacto */}
        <mesh ref={splashRingRef} position={[0, surfaceY + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.06, 0.18, 24]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.7} />
        </mesh>
      </group>
    );
  } else {
    // Cálculo de caída hacia el tanque subterráneo
    const surfaceY = -1.15 + Math.max(0.04, 1.05 * (fillLevel / 100));
    const streamHeight = Math.max(0.2, 0.25 - surfaceY);
    const centerY = surfaceY + streamHeight / 2;

    return (
      <group position={[2.02, 0, 0.18]}>
        <mesh ref={streamRef} position={[0, centerY, 0]}>
          <cylinderGeometry args={[0.04, 0.085, streamHeight, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.88}
            emissive="#0284c7"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh ref={splashRingRef} position={[0, surfaceY + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.28, 24]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.7} />
        </mesh>
      </group>
    );
  }
}

// ============================================================================
// 6. MODELO: OPERADOR ESPECIALIZADO DE AQUA-FORTE
// ============================================================================
function ProfessionalOperator({ isDelivering, destination }) {
  const operatorPos = destination === 'turril' ? [1.4, 0, 0.85] : [1.3, 0, 0.75];

  return (
    <group position={operatorPos} rotation={[0, -Math.PI / 6, 0]}>
      {/* Botas de seguridad con puntera reforzada */}
      {[-0.11, 0.11].map((x, i) => (
        <mesh key={i} position={[x, 0.09, 0]} castShadow>
          <boxGeometry args={[0.13, 0.18, 0.26]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      ))}

      {/* Pantalón de faena industrial azul marino */}
      {[-0.11, 0.11].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.58, 14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
      ))}

      {/* Torso con chaleco de seguridad reflectivo reglamentario */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <boxGeometry args={[0.46, 0.56, 0.28]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </mesh>
      {/* Franjas reflectivas fluorescentes de alta visibilidad */}
      {[-0.1, 0.1].map((yOff, i) => (
        <mesh key={i} position={[0, 0.98 + yOff, 0.145]}>
          <boxGeometry args={[0.44, 0.07, 0.01]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#fef08a"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Brazos operando la boquilla */}
      <mesh position={[0.22, 0.95, 0.18]} rotation={[0.6, 0, -0.4]}>
        <cylinderGeometry args={[0.06, 0.06, 0.48, 12]} />
        <meshStandardMaterial color="#ea580c" />
      </mesh>

      {/* Cabeza */}
      <mesh position={[0, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.7} />
      </mesh>

      {/* Casco amarillo de seguridad dieléctrico */}
      <mesh position={[0, 1.54, 0]} castShadow>
        <sphereGeometry args={[0.22, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Visera del casco */}
      <mesh position={[0, 1.52, 0.15]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.26, 0.03, 0.14]} />
        <meshStandardMaterial color="#eab308" roughness={0.3} />
      </mesh>
    </group>
  );
}

// ============================================================================
// 7. ENTORNO: SUELO INDUSTRIAL Y ÁREA DE DESPACHO
// ============================================================================
function IndustrialEnvironment() {
  return (
    <group position={[0, 0, 0]}>
      {/* Losa de concreto reforzado para tráfico pesado */}
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[14, 0.12, 9]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {/* Señalización vial industrial amarilla de bahía de carga */}
      <mesh position={[-0.4, 0.005, -1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 0.14]} />
        <meshStandardMaterial color="#facc15" roughness={0.5} />
      </mesh>
      <mesh position={[-0.4, 0.005, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 0.14]} />
        <meshStandardMaterial color="#facc15" roughness={0.5} />
      </mesh>

      {/* Líneas de advertencia de parada (Cebrado industrial) */}
      {[-1.2, -0.6, 0, 0.6, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0.006, 1.7]} rotation={[-Math.PI / 2, 0, 0.7]}>
          <planeGeometry args={[0.3, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      ))}

      {/* Cordón / Brocal de seguridad trasero */}
      <mesh position={[0, 0.12, -4.3]} castShadow receiveShadow>
        <boxGeometry args={[13.8, 0.24, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL EXPORTADO: PRODUCT 3D VIEWER REFACTORIZADO
// ============================================================================
export function Product3DViewer({ productName = "Camión Cisterna Aqua-Forte 10,000L" }) {
  // Estado del destino seleccionado: 'turril' (200 L) o 'tanque' (2,500 L)
  const [destination, setDestination] = useState('turril');
  const [fillLevel, setFillLevel] = useState(25); // 0% a 100%
  const [isDelivering, setIsDelivering] = useState(false);

  // Capacidades dinámicas
  const targetCapacity = destination === 'turril' ? 200 : 2500;
  const targetDeliveredLiters = Math.round((fillLevel / 100) * targetCapacity);
  const truckRemainingLiters = 10000 - targetDeliveredLiters;

  // Animación suave de llenado y bombeo a 60 FPS
  useEffect(() => {
    if (!isDelivering) return;

    const stepMs = 120;
    const increment = destination === 'turril' ? 2.5 : 1.2;

    const timer = setInterval(() => {
      setFillLevel((prev) => {
        if (prev >= 100) {
          setIsDelivering(false);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [isDelivering, destination]);

  const handleToggleDelivery = () => {
    if (fillLevel >= 100) {
      setFillLevel(10);
    }
    setIsDelivering(!isDelivering);
  };

  const handleReset = () => {
    setIsDelivering(false);
    setFillLevel(0);
  };

  const handleSwitchDestination = () => {
    setIsDelivering(false);
    setFillLevel(15);
    setDestination((prev) => (prev === 'turril' ? 'tanque' : 'turril'));
  };

  return (
    <div className="relative w-full bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 rounded-2xl border border-sky-500/30 shadow-2xl overflow-hidden flex flex-col p-4 sm:p-5">
      {/* ----------------- BARRA SUPERIOR: ESTADO Y MÉTRICAS HUD ----------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isDelivering ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Aqua-Forte • Estación de Despacho 3D
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Destino activo:{' '}
              <span className="font-semibold text-cyan-300">
                {destination === 'turril' ? 'Turril 200 L (Particular)' : 'Tanque Subterráneo 2,500 L (Residencial)'}
              </span>
            </p>
          </div>
        </div>

        {/* Panel HUD Digital con métricas en tiempo real */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono shadow-inner">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold">{targetDeliveredLiters.toLocaleString()} L</span>
            <span className="text-slate-500">/ {targetCapacity.toLocaleString()} L</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-cyan-400 font-bold">
            <Activity className={`w-3.5 h-3.5 ${isDelivering ? 'animate-pulse text-cyan-400' : 'text-slate-500'}`} />
            <span>{Math.round(fillLevel)}%</span>
          </div>
        </div>
      </div>

      {/* ----------------- ESCENA 3D CON THREE.JS Y REACT THREE FIBER ----------------- */}
      <div className="relative w-full h-88 sm:h-96 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-2xl">
        <Canvas
          shadows
          camera={{ position: [4.5, 3.8, 6.2], fov: 44 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          {/* Iluminación Industrial de Estudio */}
          <ambientLight intensity={0.65} />
          
          {/* Sol / Luz principal de patio industrial */}
          <directionalLight
            position={[7, 10, 6]}
            intensity={1.6}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={22}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
            shadow-bias={-0.0005}
          />

          {/* Relleno frío industrial para contrastar sombras */}
          <pointLight position={[-4, 4, 3]} color="#38bdf8" intensity={1.8} />
          {/* Luz cálida de trabajo sobre el área de bombeo */}
          <pointLight position={[1.8, 3, 1]} color="#fde047" intensity={0.9} />

          {/* Grupo de Modelos 3D */}
          <group position={[0, 0, 0]}>
            <IndustrialEnvironment />
            <WaterTankerTruck />
            <IndustrialDeliveryHose destination={destination} />

            {destination === 'turril' ? (
              <TurrilDestination fillLevel={fillLevel} />
            ) : (
              <UndergroundTankDestination fillLevel={fillLevel} />
            )}

            <WaterFlowStream
              isDelivering={isDelivering}
              destination={destination}
              fillLevel={fillLevel}
            />

            <ProfessionalOperator
              isDelivering={isDelivering}
              destination={destination}
            />
          </group>

          {/* Controles de Cámara 360 con protección para no atravesar el suelo */}
          <OrbitControls
            enableZoom={true}
            maxPolarAngle={Math.PI / 2.05} // Evita atravesar el suelo
            minPolarAngle={Math.PI / 6}
            minDistance={3.5}
            maxDistance={10.5}
            target={[0.2, 0.6, 0]}
          />
        </Canvas>

        {/* HUD flotante sobre el canvas 3D */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 pointer-events-none flex items-center gap-2 shadow-lg">
          {isDelivering ? (
            <>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
              <span className="text-cyan-300 font-semibold">
                Motobomba Activa • Despachando a 85 L/min
              </span>
            </>
          ) : fillLevel >= 100 ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">
                ¡Llenado Completado al 100%!
              </span>
            </>
          ) : (
            <>
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>Sistema en Espera • Listo para Bombear</span>
            </>
          )}
        </div>

        {/* Guía de navegación */}
        <div className="absolute bottom-2 left-0 w-full text-center pointer-events-none">
          <p className="text-[11px] text-slate-400/90 drop-shadow">
            🖱️ Arrastra para vista 360° • Rueda del mouse para Zoom
          </p>
        </div>
      </div>

      {/* ----------------- PANEL DE CONTROL INTERACTIVO ----------------- */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Slider manual con barra de progreso */}
        <div className="flex items-center gap-3 flex-1 min-w-[220px]">
          <span className="text-slate-400 font-medium text-[11px] whitespace-nowrap">
            Nivel Receptor:
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={fillLevel}
              onChange={(e) => {
                setIsDelivering(false);
                setFillLevel(Number(e.target.value));
              }}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>
          <span className="font-mono text-cyan-400 font-bold w-11 text-right">
            {Math.round(fillLevel)}%
          </span>
        </div>

        {/* Botones de acción y selector de destino */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Botón Iniciar / Pausar Simulación */}
          <button
            onClick={handleToggleDelivery}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              isDelivering
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
            }`}
          >
            {isDelivering ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isDelivering ? 'Pausar Bombeo' : 'Iniciar Bombeo'}</span>
          </button>

          {/* Botón Cambiar Destino */}
          <button
            onClick={handleSwitchDestination}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 shadow-md"
            title="Alternar entre Turril 200L y Tanque Subterráneo"
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Destino: {destination === 'turril' ? 'Tanque Subterráneo' : 'Turril 200L'}</span>
          </button>

          {/* Botón Reiniciar / Reset */}
          <button
            onClick={handleReset}
            className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700/80"
            title="Reiniciar Nivel a 0%"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
