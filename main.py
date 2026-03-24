import os 
import asyncio
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# --- INITIAL SETUP ---
load_dotenv()
app = Flask(__name__)

# This is the key fix for the connection error
CORS(app)

# --- CONFIGURE APIs and PIPELINE ---
pipeline = None
try:
    print("🚀 Initializing backend server...")
    
    # We now import the pipeline class and initialize it directly
    from EducationalAnimationPipeline import EducationalAnimationPipeline
    pipeline = EducationalAnimationPipeline()
    
    print("✅ Backend initialized successfully.")
except Exception as e:
    print(f"❌ CRITICAL ERROR during initialization: {e}")

# --- API ENDPOINTS ---
@app.route('/pipeline_outputs/generated_images/<path:filename>')
def serve_image(filename):
    """Serves generated images to the frontend."""
    # This line now works because 'os' is imported
    return send_from_directory(os.path.join('pipeline_outputs', 'generated_images'), filename)

@app.route("/generate", methods=["POST", "OPTIONS"])
def generate_animation_endpoint():
    """Main endpoint that the frontend calls to start the pipeline."""
    if request.method == "OPTIONS":
        return jsonify(success=True)

    print("\n--- ✅ POST Request received from frontend ---")
    if pipeline is None:
        return jsonify({"error": "Pipeline not initialized due to a server startup error."}), 500
        
    data = request.get_json()
    topic = data.get("topic")
    if not topic:
        return jsonify({"error": "No topic provided"}), 400

    print(f"Processing topic: '{topic}'")
    try:
        results = asyncio.run(pipeline.run_pipeline(topic))
        print("✅ Pipeline finished. Sending results back.")
        return jsonify(results)
    except Exception as e:
        print(f"❌ Error in pipeline: {e}")
        return jsonify({"error": str(e)}), 500

# --- RUN THE SERVER ---
if __name__ == "__main__":
    print("🚀 Starting Flask server on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000)
