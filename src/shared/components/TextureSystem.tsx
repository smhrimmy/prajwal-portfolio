import React from "react";
import "./TextureSystem.css";

export type TextureType = "paper" | "film-grain" | "canvas" | "crt" | "concrete" | "plastic" | "fabric" | "noise" | "none";

interface TextureSystemProps {
  type: TextureType;
  opacity?: number;
}

export function TextureSystem({ type, opacity = 0.4 }: TextureSystemProps) {
  if (type === "none") return null;

  return (
    <div 
      className={`pdl-texture-overlay pdl-texture-${type}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
