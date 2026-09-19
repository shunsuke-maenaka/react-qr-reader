import { CSSProperties, FC, useEffect } from 'react';

import { styles } from '../lib/styles';
import {
  OnErrorFunction,
  OnResultFunction,
  useQrReader,
} from '../hooks/useQrReader';

export interface QrReaderProps {
  /**
   *
   */
  defaultDeviceIdIndex?: 0 | 1;
  /**
   * Called when a result is found.
   */
  onResult?: OnResultFunction;
  /**
   * Called when an error occurs.
   */
  onError?: OnErrorFunction;
  /**
   * Property that represents the view finder component
   */
  ViewFinder?: FC;
  /**
   * Property that represents the scan period
   */
  scanDelay?: number;
  /**
   * Property that represents the ID of the video element
   */
  videoId?: string;
  /**
   * Property that represents an optional className to modify styles
   */
  className?: string;
  /**
   * Property that represents a style for the container
   */
  containerStyle?: CSSProperties;
  /**
   * Property that represents a style for the video container
   */
  videoContainerStyle?: CSSProperties;
  /**
   * Property that represents a style for the video
   */
  videoStyle?: CSSProperties;
}

export const QrReader: FC<QrReaderProps> = ({
  videoContainerStyle = {},
  containerStyle,
  videoStyle,
  ViewFinder,
  scanDelay = 500,
  className,
  onResult,
  onError,
  videoId = 'video',
}) => {
  const { videoRef, resetScanResult } = useQrReader({
    scanDelay,
    onResult,
    onError,
    videoId,
  });

  useEffect(() => {
    resetScanResult();
  }, [resetScanResult]);

  return (
    <section className={className} style={containerStyle}>
      <div
        style={{
          ...styles.container,
          ...videoContainerStyle,
        }}
      >
        {!!ViewFinder && <ViewFinder />}
        <video
          muted
          id={videoId}
          ref={videoRef}
          style={{
            ...styles.video,
            ...videoStyle,
          }}
        />
      </div>
    </section>
  );
};

QrReader.displayName = 'QrReader';
