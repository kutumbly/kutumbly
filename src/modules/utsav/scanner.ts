/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 * Contact     :  kutumbly@outlook.com
 * Web         :  kutumbly.com | aitdl.com | aitdl.in
 *
 * © 2026 Kutumbly.com — All Rights Reserved
 * Unauthorized use or distribution is prohibited.
 *
 * "Memory, Not Code."
 * ============================================================ */

"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

export interface ScanResult {
  rawValue: string;
  format: string;
}

export function useScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);

  const stopScanner = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError("Camera access denied. Please authorize for visual logistics.");
      console.error(err);
    }
  }, []);

  const scanFrame = useCallback(async (): Promise<ScanResult | null> => {
    if (!videoRef.current || !isScanning) return null;

    // Check for native BarcodeDetector Support
    if (!('BarcodeDetector' in window)) {
        // Fallback or No Support
        return null;
    }

    if (!detectorRef.current) {
      // @ts-ignore
      detectorRef.current = new window.BarcodeDetector({
        formats: ['qr_code', 'code_128', 'ean_13', 'ean_8']
      });
    }

    try {
      const barcodes = await detectorRef.current.detect(videoRef.current);
      if (barcodes.length > 0) {
        return {
          rawValue: barcodes[0].rawValue,
          format: barcodes[0].format
        };
      }
    } catch (err) {
      console.error("Scanning frame failed:", err);
    }
    return null;
  }, [isScanning]);

  useEffect(() => {
    return () => stopScanner();
  }, [stopScanner]);

  return {
    videoRef,
    isScanning,
    error,
    startScanner,
    stopScanner,
    scanFrame
  };
}
