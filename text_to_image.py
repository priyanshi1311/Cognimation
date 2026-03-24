# import os
# import base64
# import requests
# from typing import List
# from dotenv import load_dotenv

# load_dotenv()

# class StabilityImageGenerator:
#     def __init__(self):
#         """
#         Initialize the Stability AI Image Generator.
#         """
#         self.api_key = os.getenv("STABILITY_API_KEY")
#         if not self.api_key:
#             raise ValueError("STABILITY_API_KEY not found in .env file")
        
#         self.api_host = "https://api.stability.ai"
#         # This is the line we are changing to the new, correct model ID
#         self.engine_id = "stable-diffusion-xl-1024-v1-0" 

#     def generate_images(
#         self, prompt: str, seed: int, num_images: int, output_dir: str
#     ) -> List[str]:
#         """
#         Generates images using the Stability AI API and saves them.
#         """
#         print(f"\n--- Generating image with Stability API for: '{prompt}' ---")
        
#         try:
#             response = requests.post(
#                 f"{self.api_host}/v1/generation/{self.engine_id}/text-to-image",
#                 headers={
#                     "Content-Type": "application/json",
#                     "Accept": "application/json",
#                     "Authorization": f"Bearer {self.api_key}"
#                 },
#                 json={
#                     "text_prompts": [{"text": prompt}],
#                     "cfg_scale": 7,
#                     "height": 1024, # Using 1024x1024 for the XL model
#                     "width": 1024,
#                     "samples": num_images,
#                     "steps": 30,
#                     "seed": seed,
#                 },
#             )

#             if response.status_code != 200:
#                 # This will now give a more detailed error message
#                 raise Exception(f"Non-200 response from API: {response.text}")

#             data = response.json()
#             image_paths = []

#             for i, image in enumerate(data["artifacts"]):
#                 safe_prompt = "".join(c for c in prompt if c.isalnum() or c in " -_").rstrip()
#                 filename = f"image_api_{seed}_{i+1}_{safe_prompt[:20]}.png"
#                 output_path = os.path.join(output_dir, filename)
                
#                 # Decode the base64 string before saving
#                 with open(output_path, "wb") as f:
#                     f.write(base64.b64decode(image["base64"]))
                
#                 print(f"✅ Image ({i+1}/{num_images}) saved successfully to {output_path}")
#                 image_paths.append(output_path)
            
#             return image_paths

#         except Exception as e:
#             print(f"❌ Error during Stability API image generation: {e}")
#             return []

# if __name__ == '__main__':
#     print("\n--- Running StabilityImageGenerator Standalone Test ---")
#     test_output_dir = "pipeline_outputs/generated_images"
#     os.makedirs(test_output_dir, exist_ok=True)
    
#     generator = StabilityImageGenerator()
#     test_prompt = "A cinematic photo of a glowing red nebula in deep space, hyperdetailed, 8k"
    
#     image_paths = generator.generate_images(
#         prompt=test_prompt, seed=101, num_images=1, output_dir=test_output_dir
#     )
#     if image_paths:
#         print(f"\n✅ Test successful! Image saved to: {image_paths[0]}")
#     else:
#         print("\n❌ Test failed!")





import os
import base64
import requests
from typing import List
from dotenv import load_dotenv

load_dotenv()

class StabilityImageGenerator:
    def __init__(self):
        """
        Initialize the Stability AI Image Generator.
        """
        self.api_key = os.getenv("STABILITY_API_KEY")
        if not self.api_key:
            raise ValueError("STABILITY_API_KEY not found in .env file")
        
        self.api_host = "https://api.stability.ai"
        self.engine_id = "stable-diffusion-xl-1024-v1-0" 

    # --- THIS IS THE KEY CHANGE: The function now accepts 'entity' ---
    def generate_images(
        self, entity: str, prompt: str, seed: int, num_images: int, output_dir: str
    ) -> List[str]:
        """
        Generates an image if it doesn't already exist in the cache.
        """
        # 1. Create a safe, unique filename from the entity
        safe_entity_name = "".join(c for c in entity if c.isalnum() or c in " -_").rstrip().replace(" ", "_").lower()
        filename = f"{safe_entity_name}.png"
        output_path = os.path.join(output_dir, filename)

        # 2. Implement the caching logic
        if os.path.exists(output_path):
            print(f"\n--- ✅ Cache Hit! Found existing image for '{entity}' ---")
            print(f"Returning cached image: {output_path}")
            return [output_path]

        # 3. If image does not exist, proceed with API call
        print(f"\n--- ❌ Cache Miss. Generating new image with Stability API for: '{prompt}' ---")
        
        try:
            response = requests.post(
                f"{self.api_host}/v1/generation/{self.engine_id}/text-to-image",
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": f"Bearer {self.api_key}"
                },
                json={
                    "text_prompts": [{"text": prompt}],
                    "cfg_scale": 7,
                    "height": 1024,
                    "width": 1024,
                    "samples": num_images,
                    "steps": 30,
                    "seed": seed,
                },
            )

            if response.status_code != 200:
                raise Exception(f"Non-200 response from API: {response.text}")

            data = response.json()
            image_paths = []

            for i, image in enumerate(data["artifacts"]):
                # Save the image using the new entity-based filename
                with open(output_path, "wb") as f:
                    f.write(base64.b64decode(image["base64"]))
                
                print(f"✅ Image ({i+1}/{num_images}) saved successfully to {output_path}")
                image_paths.append(output_path)
            
            return image_paths

        except Exception as e:
            print(f"❌ Error during Stability API image generation: {e}")
            return []

if __name__ == '__main__':
    print("\n--- Running StabilityImageGenerator Standalone Test ---")
    test_output_dir = "pipeline_outputs/generated_images"
    os.makedirs(test_output_dir, exist_ok=True)
    
    generator = StabilityImageGenerator()
    test_prompt = "a high-quality photograph of a green tree frog"
    test_entity = "tree frog" # The test now needs an entity
    
    # Updated test call
    image_paths = generator.generate_images(
        entity=test_entity, prompt=test_prompt, seed=101, num_images=1, output_dir=test_output_dir
    )
    if image_paths:
        print(f"\n✅ Test successful! Image saved to: {image_paths[0]}")
    else:
        print("\n❌ Test failed!")