import { useMemo } from "react";
import * as THREE from "three";

export function useBookCoverTexture(
  title: string,
  subtitle: string,
): THREE.CanvasTexture {
  return useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = 512;
    cv.height = 720;
    const ctx = cv.getContext("2d")!;

    // Background
    ctx.fillStyle = "#1B2B1E";
    ctx.fillRect(0, 0, 512, 720);

    // Outer gold border
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, 476, 684);
    ctx.lineWidth = 1;
    ctx.strokeRect(27, 27, 458, 666);

    // Corner diamonds
    [
      [27, 27],
      [485, 27],
      [27, 693],
      [485, 693],
    ].forEach(([x, y]) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#C9A84C";
      ctx.fillRect(-5, -5, 10, 10);
      ctx.restore();
    });

    // Title
    ctx.fillStyle = "#C9A84C";
    ctx.textAlign = "center";
    const words = title.split(" ");
    words.forEach((w, i) => {
      ctx.font = `bold ${w === "OF" ? 22 : 38}px serif`;
      ctx.fillText(w, 256, 240 + i * 52);
    });

    // Divider
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 400);
    ctx.lineTo(422, 400);
    ctx.stroke();
    // Diamond on divider
    ctx.save();
    ctx.translate(256, 400);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#C9A84C";
    ctx.fillRect(-4, -4, 8, 8);
    ctx.restore();

    // Subtitle
    ctx.fillStyle = "#AFC3B2";
    ctx.font = "13px monospace";
    ctx.fillText(subtitle, 256, 430);

    // Bottom name
    ctx.fillStyle = "#C9A84C";
    ctx.font = "bold 13px monospace";
    ctx.letterSpacing = "4px";
    ctx.fillText("CALDESEIO", 256, 668);

    return new THREE.CanvasTexture(cv);
  }, [title, subtitle]);
}

export function useBookSpineTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = 64;
    cv.height = 720;
    const ctx = cv.getContext("2d")!;
    ctx.fillStyle = "#1B2B1E";
    ctx.fillRect(0, 0, 64, 720);
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(5, 5, 54, 710);
    ctx.save();
    ctx.translate(32, 360);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#C9A84C";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("THE BOOK OF CALDESEIO", 0, 0);
    ctx.restore();
    return new THREE.CanvasTexture(cv);
  }, []);
}
