import os
import asyncio
from typing import List, Dict

# Import all the necessary components
from InterestExplorer import InterestExplorer
from entity_extraction import EntityExtractor
from entity_enrichment_prompt import PromptEnricher
from text_to_image import StabilityImageGenerator

class EducationalAnimationPipeline:
    def __init__(self, output_base_dir: str = "pipeline_outputs"):
        self.output_base_dir = output_base_dir
        self.image_dir = os.path.join(output_base_dir, "generated_images")
        os.makedirs(self.image_dir, exist_ok=True)

        self.interest_explorer = InterestExplorer()
        self.entity_extractor = EntityExtractor()
        self.prompt_enricher = PromptEnricher()
        self.image_generator = StabilityImageGenerator()

    async def process_entity(self, entity: str, seed: int = 42) -> Dict:
        """
        Process a single entity: enrich prompt, generate explanation, and generate image.
        """
        try:
            print(f"\n--- Processing entity: {entity} ---")
            
            enriched_prompt = self.prompt_enricher.enrich_prompt(entity)
            print(f"Image Prompt: {enriched_prompt}")

            explanation = self.interest_explorer.generate_with_focus(
                interest=entity, 
                focus_aspect=f"a simple, one-paragraph explanation of what a {entity} is, for a child"
            )
            print(f"Explanation: {explanation}")

            # --- THIS IS THE KEY CHANGE: We now pass the 'entity' to the image generator ---
            image_paths = self.image_generator.generate_images(
                entity=entity, # Pass the entity for caching and unique naming
                prompt=enriched_prompt, 
                seed=seed, 
                num_images=1, 
                output_dir=self.image_dir
            )
            if not image_paths:
                raise Exception(f"API image generation failed for {entity}")

            return {
                "entity": entity,
                "prompt": enriched_prompt,
                "image_path": image_paths[0],
                "explanation": explanation,
            }
        except Exception as e:
            return {"entity": entity, "error": str(e)}

    async def run_pipeline(self, user_topic: str) -> List[Dict]:
        """
        Run the complete pipeline by extracting the main subject directly from the user's topic.
        """
        try:
            print("🚀 Starting Educational Pipeline...")
            
            print(f"\n--- Extracting main subject directly from user topic: '{user_topic}' ---")
            entities = self.entity_extractor.extract_concepts(user_topic)

            if not entities or "error" in entities[0]:
                raise Exception(f"Entity extraction failed: {entities}")
            
            print(f"✅ Extracted subject: {entities}")

            tasks = [self.process_entity(entity, seed=42 + i) for i, entity in enumerate(entities)]
            return await asyncio.gather(*tasks)

        except Exception as e:
            print(f"❌ A critical pipeline error occurred: {str(e)}")
            return []