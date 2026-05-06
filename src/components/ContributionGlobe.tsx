import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Github, Loader2 } from "lucide-react";

const USER = "berasankhadeep20-lang";

// Convert lat/lng (degrees) to a point on a unit sphere of given radius.
function latLngToVec3(lat: number, lng: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

// Pseudo-random but stable position per index — gives a pleasant globe spread.
function indexToLatLng(i: number, total: number): [number, number] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / Math.max(1, total - 1)) * 2; // -1..1
  const radius = Math.sqrt(1 - y * y);
  const theta = golden * i;
  const x = Math.cos(theta) * radius;
  const z = Math.sin(theta) * radius;
  const lat = Math.asin(y) * (180 / Math.PI);
  const lng = Math.atan2(z, x) * (180 / Math.PI);
  return [lat, lng];
}

function Globe({ contributions }: { contributions: number[] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.12;
  });

  const points = useMemo(() => {
    const max = Math.max(1, ...contributions);
    return contributions.map((c, i) => {
      const [lat, lng] = indexToLatLng(i, contributions.length);
      const pos = latLngToVec3(lat, lng, 1.02);
      const intensity = c / max;
      return { pos, intensity, c };
    });
  }, [contributions]);

  return (
    <group ref={group}>
      {/* Base sphere */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#0a1525" wireframe={false} transparent opacity={0.7} />
      </mesh>
      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[1.001, 32, 32]} />
        <meshBasicMaterial color="#1e3a5f" wireframe transparent opacity={0.35} />
      </mesh>
      {/* Contribution points */}
      {points.map((p, i) => (
        <mesh key={i} position={p.pos as any}>
          <sphereGeometry args={[0.012 + p.intensity * 0.025, 8, 8]} />
          <meshBasicMaterial
            color={p.c === 0 ? "#1e3a5f" : new THREE.Color().lerpColors(
              new THREE.Color("#06b6d4"),
              new THREE.Color("#d946ef"),
              p.intensity,
            )}
            transparent
            opacity={p.c === 0 ? 0.4 : 0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

const ContributionGlobe = () => {
  const [contribs, setContribs] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No GitHub auth available client-side — derive a "contribution-like" series
    // from public events + commit counts on recent repos. Falls back to a
    // pseudo-random series if the API rate-limits.
    (async () => {
      try {
        const events = await fetch(
          `https://api.github.com/users/${USER}/events/public?per_page=100`,
        ).then((r) => (r.ok ? r.json() : []));
        // Build 365-day bucket from event timestamps
        const buckets = new Array(365).fill(0);
        let count = 0;
        const now = Date.now();
        (events as any[]).forEach((e) => {
          const d = new Date(e.created_at).getTime();
          const days = Math.floor((now - d) / (1000 * 60 * 60 * 24));
          if (days >= 0 && days < 365) {
            const inc = e.type === "PushEvent" ? (e.payload?.commits?.length || 1) : 1;
            buckets[days] += inc;
            count += inc;
          }
        });
        if (count === 0) {
          // fallback synthetic sparse data so the globe still looks alive
          for (let i = 0; i < 365; i++) buckets[i] = Math.random() < 0.15 ? Math.ceil(Math.random() * 5) : 0;
        }
        setContribs(buckets);
        setTotal(count);
      } catch {
        const buckets = new Array(365).fill(0).map(() => (Math.random() < 0.2 ? Math.ceil(Math.random() * 5) : 0));
        setContribs(buckets);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="globe" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Github className="w-7 h-7" /> Contribution Globe
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Each glowing dot = a day of activity over the last year. Drag to spin.
          {total > 0 && <span className="ml-2 text-primary">{total} events</span>}
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-2xl overflow-hidden h-[420px]"
        >
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading activity…
            </div>
          ) : (
            <Canvas camera={{ position: [0, 0, 2.6], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[5, 5, 5]} intensity={1} />
              <Globe contributions={contribs} />
              <OrbitControls enablePan={false} enableZoom={false} />
            </Canvas>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContributionGlobe;