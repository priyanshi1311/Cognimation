// import * as cocoSsd from '@tensorflow-models/coco-ssd';
// import '@tensorflow/tfjs';

// // Helper function to load external MediaPipe scripts
// const loadScript = (src) => {
//   return new Promise((resolve, reject) => {
//     if (document.querySelector(`script[src="${src}"]`)) {
//       resolve(); return;
//     }
//     const script = document.createElement('script');
//     script.src = src;
//     script.async = true;
//     script.onload = resolve;
//     script.onerror = reject;
//     document.head.appendChild(script);
//   });
// };

// export const loadMediaPipe = async () => {
//   try {
//     if (window.Hands) return true;
//     await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
//   } catch (error) {
//     console.error('MediaPipe loading error:', error);
//     throw error;
//   }
// };

// export const loadTensorFlow = async () => {
//   try {
//     await cocoSsd.load();
//   } catch (error) {
//     console.error('TensorFlow/COCO-SSD loading error:', error);
//     throw error;
//   }
// };

// // Main function to initialize and run the tracking
// export const initTracking = async (videoRef, personDetectionRef, handsRef, onWaveDetected) => {
//   let animationFrameId;

//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: { width: 640, height: 480 },
//     });
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//     }

//     personDetectionRef.current = await cocoSsd.load();
//     handsRef.current = new window.Hands({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     });
//     handsRef.current.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.7 });

//     // This function will be called every time MediaPipe processes a frame
//     handsRef.current.onResults((results) => {
//       if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//         const landmarks = results.multiHandLandmarks[0];
//         const wrist = landmarks[0]; // Wrist landmark
//         const pinkyTip = landmarks[20]; // Pinky tip landmark
//         // Simple wave detection: check if the pinky is above the wrist
//         if (pinkyTip.y < wrist.y) {
//           onWaveDetected(); // Call the callback function when a wave is detected
//         }
//       }
//     });

//     // Main detection loop
//     const detect = async () => {
//       if (videoRef.current && videoRef.current.readyState === 4) {
//         // Person detection (optional, mainly for future 'look at' features)
//         await personDetectionRef.current.detect(videoRef.current);
//         // Hand detection
//         await handsRef.current.send({ image: videoRef.current });
//       }
//       animationFrameId = requestAnimationFrame(detect);
//     };
//     detect();

//     // Return a cleanup function to stop everything
//     return () => {
//       console.log("Cleaning up tracking resources...");
//       cancelAnimationFrame(animationFrameId);
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       }
//       if (handsRef.current) {
//         handsRef.current.close();
//       }
//     };

//   } catch (error) {
//     console.error('Error in tracking setup:', error);
//     throw error;
//   }
// };






import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(); return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const loadMediaPipe = async () => {
  try {
    if (window.Hands) return true;
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
  } catch (error) {
    console.error('MediaPipe loading error:', error);
    throw error;
  }
};

export const loadTensorFlow = async () => {
  try {
    await cocoSsd.load();
  } catch (error) {
    console.error('TensorFlow/COCO-SSD loading error:', error);
    throw error;
  }
};

// Main function to initialize and run the tracking
export const initTracking = async (
    videoRef, 
    personDetectionRef, 
    handsRef, 
    onWaveDetected,
    setCameraActive // We now accept the state setter
) => {
  let animationFrameId;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    personDetectionRef.current = await cocoSsd.load();
    handsRef.current = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    handsRef.current.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.7 });

    handsRef.current.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const wrist = landmarks[0];
        const pinkyTip = landmarks[20];
        if (pinkyTip.y < wrist.y) {
          onWaveDetected();
        }
      }
    });

    const detect = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        await personDetectionRef.current.detect(videoRef.current);
        await handsRef.current.send({ image: videoRef.current });
      }
      animationFrameId = requestAnimationFrame(detect);
    };
    detect();

    // Return a function to clean up resources
    return () => {
      console.log("Cleaning up tracking resources...");
      cancelAnimationFrame(animationFrameId);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };

  } catch (error) {
    console.error('Error in tracking setup:', error);
    // This now correctly calls the state setter if initialization fails
    setCameraActive(false); 
    throw error;
  }
};