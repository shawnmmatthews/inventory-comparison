import React, { useState } from 'react';
import { Scanner } from './Scanner';

export const ScannerPage = () => {

    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState('');

    const scan = () => {
        setScanning(!scanning);
    }

    const onDetected = (result: any) => {
        if (/^\d+$/.test(result.codeResult.code)) { //Confirms we got a good readout, only returns if we have 12 digits
            console.log(result.codeResult.code);
            setResults(result.codeResult.code);
            setScanning(!scanning);
        } else {
            console.log("please rescan we got a bad reading");
            console.log(result.codeResult.code);
        }
    };

    return (
        <div>
            <button onClick={scan}>{scanning ? 'Stop' : 'Start'}</button>
            <p>Result: {results}</p>
            {scanning ? <Scanner onDetected={onDetected} /> : null}
        </div>
    );
}