"use client"

import { useEffect } from "react"
// @ts-ignore
import Quagga from 'quagga';
import { useRouter } from "next/navigation";

export default function QuaggaPage() {
    const router = useRouter();

    useEffect(() => {
        Quagga.init({
            inputStream: {
                type : "LiveStream",
                constraints: {
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 480, ideal: 720, max: 1080 },
                    aspectRatio: { min: 1, max: 2, ideal: 1 },
                    facing: "environment" // or user
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 2,
            decoder: {
                readers : [ "code_128_reader", "code_39_reader"]
            },
            locate: true
        }, function() {
            Quagga.start();
        });
        Quagga.onDetected((result: string) => router.replace("/?result=" + result));

        return () => {
            Quagga.onDetected(() => {})
            Quagga.stop()
        }
    }, [])

    return <div id="interactive" className="viewport"/>
}