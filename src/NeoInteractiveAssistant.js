import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Application } from '@splinetool/runtime';
import { Logo } from './NeoAssistantStyles';
import logo from './logo.png';
import { 
  Container, 
  SplineContainer, 
  SpeechBubbleContainer, 
  SpeechBubble, 
  LeftHalf,
  RightHalf,
  EntityCard,
  EntityImage,
  EntityExplanation,
} from './NeoAssistantStyles';

const NeoInteractiveAssistant = () => {
  const splineCanvasRef = useRef(null);
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('Hello! Let\'s learn something amazing. Click me to start!');
  const [pipelineResults, setPipelineResults] = useState([]);
  const [voice, setVoice] = useState(null);

  const speakText = useCallback((text, onEndCallback = () => {}) => {
    if (!voice || !text) {
        if (onEndCallback) onEndCallback();
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.onend = onEndCallback; // Call the callback when speech finishes
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [voice]);

  const processTopicWithBackend = useCallback(async (transcript) => {
    if (!transcript || isProcessing) return;
    
    setIsListening(false);
    setIsProcessing(true);
    setPipelineResults([]);
    setMessage(`Thinking about "${transcript}"...`);

    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: transcript }),
      });

      if (!response.ok) {
        throw new Error(`Backend Error: ${response.status}`);
      }

      const results = await response.json();
      if (results && results.length > 0) {
        setPipelineResults(results);
        const firstResult = results[0];
        if (firstResult.error) {
            setMessage(`Sorry, I had trouble with "${firstResult.entity}".`);
        } else {
            setMessage("Here's what I created for you!");
            speakText(firstResult.explanation);
        }
      } else {
        setMessage("The backend responded, but something went wrong.");
      }

    } catch (error) {
      console.error("❌ FETCH ERROR:", error);
      setMessage("Connection to the backend failed. Check terminals.");
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, speakText]);

  const startListening = useCallback(() => {
    if (isProcessing || isListening) return;

    // --- THIS IS FIX #1: Interrupt any ongoing speech ---
    window.speechSynthesis.cancel();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessage("Speech recognition not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') console.error("Speech recognition error:", event);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      processTopicWithBackend(transcript);
    };
    recognition.start();
  }, [isProcessing, isListening, processTopicWithBackend]);
  
  useEffect(() => {
    const canvas = splineCanvasRef.current;
    if (canvas) {
      const app = new Application(canvas);
      app.load('https://prod.spline.design/kCwRn-TsuihTzmk1/scene.splinecode');
      // app.load - https://prod.spline.design/YY8JN5JSwskEgOqC/scene.splinecode
    }

    // --- THIS IS FIX #2: Ensure the greeting is spoken reliably ---
    const initVoiceAndGreet = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const selectedVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en-'));
        if (selectedVoice) {
          // Set the voice state, then use a callback to speak the greeting
          setVoice(prevVoice => {
            // This ensures we have the most up-to-date voice before speaking
            if (!prevVoice) { // Only greet if a voice hasn't been set before
              const utterance = new SpeechSynthesisUtterance("Hello! Let's learn something amazing. Click me to start!");
              utterance.voice = selectedVoice;
              window.speechSynthesis.speak(utterance);
            }
            return selectedVoice;
          });
        }
      }
    };

    window.speechSynthesis.onvoiceschanged = initVoiceAndGreet;
    initVoiceAndGreet(); // Initial call

  }, []); // Empty dependency array to run only once

  return (
    <Container onClick={startListening}>
      <LeftHalf>
        <Logo src={logo} alt="Project Logo" />
        <SplineContainer>
            <canvas ref={splineCanvasRef} id="spline-canvas" />
        </SplineContainer>
        <SpeechBubbleContainer>
          <SpeechBubble $visible={true}>{message}</SpeechBubble>
        </SpeechBubbleContainer>
      </LeftHalf>
      <RightHalf>
        {pipelineResults.map((result, index) => (
          !result.error && (
            <EntityCard key={index}>
              <EntityImage 
                src={`http://localhost:5000/pipeline_outputs/generated_images/${result.image_path.split(/[\\/]/).pop()}`} 
                alt={result.entity} 
              />
              <EntityExplanation>{result.explanation}</EntityExplanation>
            </EntityCard>
          )
        ))}
      </RightHalf>
    </Container>
  );
};

export default NeoInteractiveAssistant;
