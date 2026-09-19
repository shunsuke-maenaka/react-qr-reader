import { RefObject, useCallback, useEffect, useRef } from 'react';
import { Exception, Result } from '@zxing/library';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { DecodeContinuouslyCallback } from '@zxing/browser/esm/common/DecodeContinuouslyCallback';

import { delay, isMediaDevicesSupported, isValidType } from '../lib/utils';

export type DecodeResult = Result | null | undefined;

export interface UseQrReaderHookProps {
  onResult?: OnResultFunction;
  /**
   * Callback for retrieving the error
   */
  onError?: OnErrorFunction;
  /**
   * Property that represents the scan period
   */
  scanDelay?: number;
  /**
   * Property that represents the ID of the video element
   */
  videoId?: string;
}

interface UseQrReaderReturn {
  /** Reference to the video element */
  videoRef: RefObject<HTMLVideoElement | null>;
  /** Resets the scan result, allowing for a re-scan of the same value */
  resetScanResult: () => void;
}

type UseQrReaderHook = (props: UseQrReaderHookProps) => UseQrReaderReturn;

export type OnResultFunction = (
  result: DecodeResult,
  control?: IScannerControls
) => Promise<void>;
export type OnErrorFunction = (
  error: Exception | Error | undefined,
  control?: IScannerControls
) => void;

export const useQrReader: UseQrReaderHook = ({
  scanDelay = 200,
  onResult,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousScan = useRef<string | null>(null);
  const previousError = useRef<Exception | Error | undefined>(undefined);
  const qrReader = useRef<BrowserQRCodeReader | null>(null);
  const qrControl = useRef<IScannerControls | undefined>(undefined);

  const scanCallback: DecodeContinuouslyCallback = useCallback(
    async (result, error, control) => {
      const resultText = result?.getText();
      const previousScanText = previousScan.current;
      if (resultText && resultText != previousScanText) {
        previousScan.current = resultText;
        return onResult?.(result, control);
      }
      if (error && error != previousError.current) {
        previousError.current = error;
        return onError?.(error, control);
      }
    },
    [onError, onResult]
  );

  const resetScanResult = useCallback(() => {
    previousScan.current = null;
    previousError.current = undefined;
  }, []);

  const startScanner = useCallback(async () => {
    if (videoRef.current == null) return;
    try {
      delay(scanDelay);
      return qrReader.current?.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        scanCallback
      );
    } catch (e) {
      if (e instanceof Error) onError?.(e);
    }
  }, [scanDelay, scanCallback, onError]);

  useEffect(() => {
    if (
      !isMediaDevicesSupported() &&
      isValidType(onResult, 'onResult', 'function')
    ) {
      const message =
        'MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"';

      onError?.(new Error(message));
    }
    if (!qrReader.current) {
      qrReader.current = new BrowserQRCodeReader(undefined, {
        delayBetweenScanAttempts: scanDelay,
        delayBetweenScanSuccess: scanDelay,
      });
    }

    startScanner().then((ctrl) => {
      qrControl.current = ctrl;
    });
    return () => {
      qrControl.current?.stop();
    };
  }, [scanDelay, onError, onResult, startScanner]);

  return {
    videoRef,
    resetScanResult,
  };
};
