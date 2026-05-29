"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  varying vec2 v_uv;
  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float u_time;
  uniform vec2  u_res;
  uniform vec2  u_mouse;
  varying vec2  v_uv;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i),               b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0 - 2.0*f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p){
    float v = 0.0, amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = v_uv;
    vec2 p = (uv - 0.5);
    p.x *= u_res.x / u_res.y;

    float t = u_time * 0.04;
    // drifting domain-warped fog
    vec2 q = vec2(fbm(p * 2.2 + t), fbm(p * 2.2 - t + 5.2));
    float f = fbm(p * 3.0 + q * 1.6 + vec2(t * 0.6, -t * 0.4));

    // base void with faint violet depth
    vec3 col = vec3(0.018, 0.018, 0.021);
    col += vec3(0.10, 0.04, 0.22) * pow(f, 2.2) * 0.9;            // violet fog
    col += vec3(0.32, 0.0, 0.18) * pow(max(f - 0.45, 0.0), 2.0);  // pink wisps

    // cursor spotlight (acid-tinted bloom)
    vec2 m = u_mouse;
    m.x = (m.x - 0.5) * (u_res.x / u_res.y) + 0.5;
    float d = distance(vec2((uv.x - 0.5) * (u_res.x / u_res.y) + 0.5, uv.y), m);
    float spot = smoothstep(0.42, 0.0, d);
    col += vec3(0.55, 0.62, 0.05) * spot * (0.35 + f * 0.6);
    col += vec3(0.9, 1.0, 0.0) * smoothstep(0.06, 0.0, d) * 0.25; // hot core

    // subtle scan grain
    col += (hash(uv * u_res.xy * 0.5 + t) - 0.5) * 0.025;

    // vignette
    col *= smoothstep(1.15, 0.25, length(p));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderQuad({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number; tx: number; ty: number }> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(1, 1) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );

  useFrame((_, dt) => {
    const m = mouseRef.current;
    m.x += (m.tx - m.x) * 0.06;
    m.y += (m.ty - m.y) * 0.06;
    uniforms.u_time.value += dt;
    uniforms.u_mouse.value.set(m.x, 1.0 - m.y);
    uniforms.u_res.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={matRef} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  );
}

/**
 * React Three Fiber wrapper for the hero shader.
 * The orthographic camera + full-viewport quad means the fragment shader is
 * effectively the whole canvas — no scene geometry needed.
 */
export function HeroShader({
  mouseRef,
}: {
  mouseRef: React.RefObject<{ x: number; y: number; tx: number; ty: number }>;
}) {
  return (
    <Canvas
      className="hero__gl"
      orthographic
      camera={{ left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 1 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    >
      <ShaderQuad mouseRef={mouseRef} />
    </Canvas>
  );
}
