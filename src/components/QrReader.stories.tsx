import { useState } from 'react';
import { StoryFn } from '@storybook/react';
import { action } from 'storybook/actions';

import { ViewFinder } from './ViewFinder';
import { OnResultFunction, QrReader } from '..';
import { QrReaderProps } from './QrReader';

const styles = {
  container: {
    width: '100vw',
    maxWidth: '300px',
    margin: 'auto',
  },
};

const scanAction = action('handleScan');

const Template: StoryFn<QrReaderProps> = (args) => {
  const [error, setError] = useState('');
  const [data, setData] = useState('');

  const handleScan: OnResultFunction = async (result) => {
    scanAction(result);
    setData(result?.getText() ?? 'No result');
  };

  return (
    <div style={styles.container}>
      <QrReader
        {...args}
        onResult={handleScan}
        onError={(err) => setError(err?.message ?? '')}
      />
      <p>The value is: {JSON.stringify(data, null, 2)}</p>
      <p>The error is: {error}</p>
    </div>
  );
};

export const ScanCode = Template.bind({});

ScanCode.args = {
  ViewFinder,
  scanDelay: 500,
};

export default {
  title: 'Browser QR Reader',
  component: QrReader,
};
