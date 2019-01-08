import React, { useEffect } from 'react';
import Quagga from 'quagga';

interface Props {
    onDetected: any,
}

export const Scanner: React.SFC<Props> = (props) => {

    useEffect(() => { // ComponentDid/WillMount!
        //console.log("stack trace error not in lifecycle");
        Quagga.init(
            {
                inputStream: {
                    type: 'LiveStream',
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: 'environment', // or user
                    },
                },
                locator: {
                    patchSize: 'medium',
                    halfSample: true,
                },
                numOfWorkers: 0,
                decoder: {
                    readers: ['code_128_reader'],
                },
                locate: true,
            },
            function (err: any) {
                if (err) {
                    return console.log(err);
                }
                Quagga.start();
            }
        );
        Quagga.onDetected(onDetected);
        return function cleanup() { //componentWillUnmount!
            //console.log("Error is not caused by unmount");
            Quagga.offDetected(onDetected);
        }
    })
    const onDetected = (result: any) => {
        //console.log("Do things break in the onDetected func call?");
        props.onDetected(result);
    }

    return <div id="interactive" className="viewport" />;
}