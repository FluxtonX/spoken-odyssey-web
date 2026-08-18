"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { mosaicConfig } from "@/lib/hero/mosaicConfig";
import {
  getElementState,
  getGlassesState,
  getHeadlineState,
  mosaicElements,
} from "@/lib/hero/mosaicElements";

function applyState(node, state, zBase) {
  if (!node || !state) return;
  gsap.set(node, {
    xPercent: -50,
    yPercent: -50,
    x: state.x,
    y: state.y,
    scale: state.scale,
    rotation: state.rotation,
    opacity: state.opacity,
    zIndex: state.zIndex ?? zBase,
    filter: state.blur ? `blur(${state.blur}px)` : "blur(0px)",
    transformOrigin: "center center",
  });
}

function tweenToState(tl, node, state, zBase, duration, ease) {
  if (!node || !state) return;
  tl.to(
    node,
    {
      x: state.x,
      y: state.y,
      scale: state.scale,
      rotation: state.rotation,
      opacity: state.opacity,
      zIndex: state.zIndex ?? zBase,
      filter: state.blur ? `blur(${state.blur}px)` : "blur(0px)",
      duration,
      ease,
    },
    "<"
  );
}

export function useMosaicTimeline({
  elementRefs,
  glassesRef,
  headlineRef,
  enabled,
  isDesktop,
  onPhaseChange,
}) {
  const timelineRef = useRef(null);

  useEffect(() => {
    const setInitial = (phase) => {
      mosaicElements.forEach((item) => {
        const node = elementRefs.current.get(item.id);
        applyState(node, getElementState(item, phase, isDesktop), item.zBase);
      });
      applyState(glassesRef.current, getGlassesState(phase, isDesktop), 25);
      applyState(headlineRef.current, getHeadlineState(phase, isDesktop), 30);
    };

    setInitial("mosaicA");
    onPhaseChange?.("mosaicA");

    if (!enabled) return undefined;

    const { timings } = mosaicConfig;
    const ease = timings.morphEase;

    const buildCycle = () => {
      const tl = gsap.timeline({
        defaults: { ease },
        onComplete: () => {
          tl.kill();
          buildCycle();
        },
      });

      const morphTo = (phase) => {
        onPhaseChange?.(phase);

        mosaicElements.forEach((item) => {
          const node = elementRefs.current.get(item.id);
          tweenToState(
            tl,
            node,
            getElementState(item, phase, isDesktop),
            item.zBase,
            timings.morphDuration,
            ease
          );
        });

        tweenToState(
          tl,
          glassesRef.current,
          getGlassesState(phase, isDesktop),
          25,
          timings.morphDuration,
          ease
        );

        tweenToState(
          tl,
          headlineRef.current,
          getHeadlineState(phase, isDesktop),
          30,
          timings.morphDuration,
          ease
        );
      };

      tl.to({}, { duration: timings.mosaicADuration });
      morphTo("mosaicB");
      tl.to({}, { duration: Math.max(0.35, timings.mosaicBDuration - timings.morphDuration) });
      morphTo("mosaicC");
      tl.to({}, { duration: Math.max(0.35, timings.mosaicCDuration - timings.morphDuration) });
      morphTo("mosaicA");
      tl.to({}, { duration: timings.loopPause });

      timelineRef.current = tl;
      return tl;
    };

    const nodes = [
      ...mosaicElements.map((item) => elementRefs.current.get(item.id)).filter(Boolean),
      glassesRef.current,
      headlineRef.current,
    ].filter(Boolean);

    gsap.fromTo(
      nodes,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: timings.entranceDuration,
        stagger: 0.05,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(glassesRef.current, {
            y: "+=6",
            duration: timings.idleFloatDuration,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
          buildCycle();
        },
      }
    );

    return () => {
      timelineRef.current?.kill();
      gsap.killTweensOf([
        ...elementRefs.current.values(),
        glassesRef.current,
        headlineRef.current,
      ]);
      timelineRef.current = null;
    };
  }, [enabled, isDesktop, elementRefs, glassesRef, headlineRef, onPhaseChange]);

  return timelineRef;
}
