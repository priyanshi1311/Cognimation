import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  // background: linear-gradient(135deg, #7209b7, #00b4d8, #caf0f8);
  background: #2e3236ff;
  background-size: 400% 400%;
  animation: GradientBackground 15s ease infinite;
  font-family: 'Inter', 'Roboto', 'Helvetica Neue', sans-serif;
  overflow: hidden;

  @keyframes GradientBackground {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

export const LeftHalf = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
`;

export const RightHalf = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
`;

export const SpeechBubbleContainer = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-65%);
  width: 100%;
  max-width: 500px;
  z-index: 10;
`;

export const SpeechBubble = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  min-height: 100px;
  height: 100px;
  width: 120%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.1rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow-y: auto;

  /* Custom scrollbar for overflow text */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
`;

export const EntityCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  margin: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeSlideIn 0.5s forwards;
  border: 1px solid rgba(255, 255, 255, 0.2);

  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

export const EntityTitle = styled.h3`
  color: #ffffff;
  font-size: 1.8rem;
  margin-bottom: 16px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const EntityImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 16px;
  margin: 12px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

export const EntityExplanation = styled.p`
  color: #e0e0e0;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 16px;
  font-weight: 400;
`;

export const Logo = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 170px;
  height: 100px;
  z-index: 100;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.3);
  color: white;
  z-index: 10;
`;

export const SplineContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const HiddenVideo = styled.video`
  position: absolute;
  visibility: hidden;
  opacity: 0;
`;

export const NeonOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: radial-gradient(circle at 50% 50%, 
    rgba(255, 193, 7, 0.1) 0%, 
    rgba(255, 193, 7, 0) 70%
  );
`;

export const HandTrackingCanvas = styled.canvas`
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  width: 320px;
  height: 240px;
  border-radius: 16px;
  border: 3px solid #2b88fbff;
  background: rgba(35, 43, 100, 0.85);
`;


export const ImageGallery = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  overflow-y: auto;
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #2b88fbff;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
`;

export const EntityLabel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
`;

export const ErrorMessage = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 0, 0, 0.1);
  color: #ff4444;
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #ff4444;
  backdrop-filter: blur(5px);
  z-index: 1000;
`;

// Add these to your styled components imports at the top
export const EntityImagePlaceholder = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin: 12px 0;
`;

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const RealWorldExampleContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-top: 15px;
`;

export const ExampleTitle = styled.h4`
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

export const ExampleText = styled.p`
  color: #e0e0e0;
  font-size: 1rem;
  line-height: 1.5;
`;

export const FunFactContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-top: 15px;
`;

export const FunFactTitle = styled.h4`
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

export const FunFactText = styled.p`
  color: #e0e0e0;
  font-size: 1rem;
  line-height: 1.5;
`;

export const WhyItMattersContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-top: 15px;
`;

export const WhyItMattersTitle = styled.h4`
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

export const WhyItMattersText = styled.p`
  color: #e0e0e0;
  font-size: 1rem;
  line-height: 1.5;
`;

// Chat context for the AI assistant
export const CHAT_CONTEXT = [
  {
    role: "system",
    content: `You are Neo, a friendly and enthusiastic AI assistant who specializes in visual and interactive learning. You love helping people learn and discover new things! You keep your responses concise, engaging, and easy to understand.

    Key traits:
    - Friendly and approachable
    - Enthusiastic about learning
    - Clear and simple explanations
    - Encouraging and supportive
    - Naturally conversational
    - Uses visual aids to enhance learning

    Always start responses with enthusiasm and keep them brief but informative. Reference the visual aids when appropriate to enhance understanding.`
  }
];