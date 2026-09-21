import { useEffect, useRef } from "react";

/**
 * The hero's background: a slow isometric lattice of wireframe containers that
 * provision and are destroyed, forever.
 *
 * It is the product rather than decoration. The console beside it shows one
 * workspace being built; this shows the fleet doing it continuously, which is
 * the half of "disposable" the console cannot express. The cubes are the
 * logo's three isometric cubes, multiplied.
 *
 * Deliberate constraints, all from design/STYLE.md:
 *  - Edges only. No shading, no gradients, no glow — the app is flat, so this
 *    is hairlines in 3D rather than a lit scene.
 *  - Colour is read from the CSS tokens at runtime; there are no hexes here.
 *  - Orthographic, because the logo is isometric and perspective would fight it.
 *
 * Everything three.js is loaded dynamically inside the effect, so it stays out
 * of the initial bundle, never runs during prerender, and costs nothing at all
 * to a visitor whose browser or preferences decline it.
 */

const CUBE_COUNT = 18;
/** Seconds: grow, hold, shrink, then wait before the slot is reused. */
const GROW = 1.1;
const HOLD = 4.5;
const SHRINK = 0.9;
const GAP = 1.6;
const CYCLE = GROW + HOLD + SHRINK + GAP;

function readToken(el: HTMLElement, name: string, fallback: string) {
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  return value || fallback;
}

export function ContainerField() {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = holder.current;
    if (!mount) return;

    // Honour the OS setting before loading a 3D library the visitor did not ask
    // for. Motion is the entire point of this element, so there is no static
    // fallback worth 150KB — it simply does not render.
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const THREE = await import("three");
      if (disposed || !mount.isConnected) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return; // No WebGL. The hero is complete without this.
      }

      const sage = readToken(mount, "--sage", "#b5cda9");
      const line = readToken(mount, "--line-strong", "#3b4636");

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      // Orthographic: the frustum is set from the element's aspect on resize.
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
      camera.position.set(6, 5, 6);
      camera.lookAt(0, 0, 0);

      const group = new THREE.Group();
      scene.add(group);

      // One geometry and two materials shared by every cube: 18 cubes should
      // be 18 draw calls of the same buffer, not 18 uploads.
      const box = new THREE.BoxGeometry(1, 1, 1);
      const edges = new THREE.EdgesGeometry(box);
      const liveMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(sage),
        transparent: true,
      });
      const idleMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(line),
        transparent: true,
      });

      type Cube = {
        mesh: InstanceType<typeof THREE.LineSegments>;
        offset: number;
        home: InstanceType<typeof THREE.Vector3>;
      };

      const cubes: Cube[] = [];
      const lattice = 2.15;
      for (let i = 0; i < CUBE_COUNT; i++) {
        // A loose 3D lattice with jitter, so it reads as a cluster rather than
        // a grid. Deterministic per index: no random(), so every visitor and
        // every screenshot sees the same arrangement.
        const x = ((i % 3) - 1) * lattice + Math.sin(i * 2.7) * 0.34;
        const y = (Math.floor(i / 9) - 0.5) * lattice + Math.cos(i * 1.9) * 0.3;
        const z =
          ((Math.floor(i / 3) % 3) - 1) * lattice + Math.sin(i * 4.1) * 0.34;

        const mesh = new THREE.LineSegments(
          edges,
          i % 4 === 0 ? liveMaterial.clone() : idleMaterial.clone(),
        );
        mesh.position.set(x, y, z);
        group.add(mesh);
        cubes.push({
          mesh,
          offset: (i / CUBE_COUNT) * CYCLE + Math.sin(i * 3.3) * 0.8,
          home: new THREE.Vector3(x, y, z),
        });
      }

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = mount;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        // Frame a fixed world height; widen the frustum to match the element.
        const halfH = 5.2;
        const halfW = halfH * (w / h);
        camera.left = -halfW;
        camera.right = halfW;
        camera.top = halfH;
        camera.bottom = -halfH;
        camera.updateProjectionMatrix();
      };
      resize();

      const observer = new ResizeObserver(resize);
      observer.observe(mount);

      // Only run while the hero is actually on screen and the tab is focused.
      let onScreen = true;
      const visibility = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      visibility.observe(mount);

      // Plain elapsed seconds rather than THREE.Clock, which is deprecated in
      // favour of THREE.Timer and warns on construction. Nothing here needs
      // either: the cycle is a pure function of elapsed time.
      const start = performance.now();
      let frame = 0;

      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!onScreen || document.hidden) return;

        const t = (performance.now() - start) / 1000;
        group.rotation.y = t * 0.06;

        for (const cube of cubes) {
          const phase = (t + cube.offset) % CYCLE;
          let scale: number;
          let opacity: number;

          if (phase < GROW) {
            // Provision: ease out, so it arrives rather than lands.
            const p = 1 - (1 - phase / GROW) ** 3;
            scale = p;
            opacity = p;
          } else if (phase < GROW + HOLD) {
            scale = 1;
            opacity = 1;
          } else if (phase < GROW + HOLD + SHRINK) {
            // Destroy: faster than it arrived, and it collapses rather than fades.
            const p = (phase - GROW - HOLD) / SHRINK;
            scale = 1 - p * p;
            opacity = 1 - p;
          } else {
            scale = 0;
            opacity = 0;
          }

          cube.mesh.scale.setScalar(Math.max(scale, 0.0001));
          const material = cube.mesh.material as InstanceType<
            typeof THREE.LineBasicMaterial
          >;
          material.opacity = opacity * 0.5;
          cube.mesh.position.copy(cube.home);
        }

        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        visibility.disconnect();
        for (const cube of cubes) {
          (cube.mesh.material as { dispose(): void }).dispose();
        }
        edges.dispose();
        box.dispose();
        liveMaterial.dispose();
        idleMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return <div className="pa-field" ref={holder} aria-hidden="true" />;
}
