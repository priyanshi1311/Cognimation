Cognimation - AI Virtual Tutor
<img width="1910" height="1033" alt="1" src="https://github.com/user-attachments/assets/2fdd6348-abfc-4b94-a87c-3e15305f0ecf" />

<img width="1918" height="1032" alt="2" src="https://github.com/user-attachments/assets/bf241967-60d5-40b8-b8f6-95e26fb1452b" />

![3](https://github.com/user-attachments/assets/a3e77eff-e2b1-4863-bb3d-349ba578b82b)



> **Experience learning like never before with an interactive 3D companion.**
Cognimation is a next-generation virtual tutor application that transforms voice queries into immersive educational experiences. By combining a 3D interactive interface with Generative AI, it provides detailed text explanations and visualizes concepts in real-time.

🌟 Features
🗣️ Voice-Activated Learning: Ask questions naturally using your voice—no typing needed.
🤖 Interactive 3D Avatar: A lively 3D robot companion (built with Spline) that listens and reacts to you.
🧠 Intelligent Answers: Powered by Cerebras (and/or OpenAI) to provide accurate, context-aware explanations.
🎨 Dynamic Visualization: Automatically extracts keywords and generates educational images on the fly using Stability AI.
⚡ Real-Time Processing: Seamless flow from speech input to text conversion, logic processing, and multimedia response.
🛠️ Tech Stack
Frontend (React)
Core: React 19, React Scripts
3D Integration: @splinetool/runtime
Styling: Styled Components, Lucide React (Icons)
ML/Vision: @mediapipe/hands, @tensorflow/tfjs (Gesture/Interaction capabilities)
Backend (Python)
Server: Flask, Flask-Cors
AI/LLM: Cerebras Cloud SDK, Transformers
Image Generation: Stability AI (via requests), Diffusers, PyTorch
Utilities: Python-Dotenv, Pillow
🔄 How It Works
Input: User interacts via Voice (or Gesture).
Processing: * Audio is converted to text.
The backend sends the query to Cerebras for a text answer.
Keywords are extracted to prompt Stability AI for an image.
Output: The 3D Robot presents the text explanation alongside the generated visual aid.
graph TD A[User Voice Input] -->|STT| B(Text Query) B --> C{Flask Backend} C -->|Cerebras SDK| D[Generate Explanation] C -->|Keyword Extraction| E[Stability AI / Diffusers] E -->|Generate Image| F[Visual Output] D --> G[Text Output] F --> H[Frontend Interface] G --> H H --> I[User Learns via 3D Spline UI]

🚀 Installation & Setup Follow these steps to get the project running on your local machine. Prerequisites Node.js (v14 or higher) Python (v3.8 or higher) API Keys for Cerebras and Stability AI.

Clone the Repository

Backend Setup Navigate to the backend folder and install the python dependencies.

Bash

cd backend

Create a virtual environment (Recommended)
python -m venv venv

Activate on Windows: venv\Scripts\activate
Activate on Mac/Linux: source venv/bin/activate
Install dependencies
pip install -r requirements.txt

Configuration: Create a .env file in the backend directory and add your keys:

Code snippet

CEREBRAS_API_KEY=your_cerebras_key_here STABILITY_API_KEY=your_stability_key_here

Frontend Setup Navigate to the frontend folder and install the node modules.
Bash

cd ../frontend npm install

🏃‍♂️ Running the Application To run the full stack, you need two terminal windows open. Terminal 1: Start Backend

Bash

cd backend python app.py

The server will usually start on http://localhost:5000
Terminal 2: Start Frontend

Bash: cd frontend npm start

The application will launch in your browser at http://localhost:3000
🤝 Contributing Contributions are always welcome! Fork the Project. Built with ❤️ using React, Python, and Spline.
