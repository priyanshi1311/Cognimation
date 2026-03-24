import os
from typing import Dict, List
from dotenv import load_dotenv
from cerebras.cloud.sdk import Cerebras

# Load environment variables for the standalone test block
load_dotenv()

class PromptEnricher:
    def __init__(self):
        """
        Initialize the PromptEnricher with the Cerebras client.
        The client automatically finds the CEREBRAS_API_KEY in your .env file.
        """
        self.client = Cerebras()
        self.model = "qwen-3-235b-a22b-instruct-2507" # The model you suggested
        self.default_templates = {
            "Earth": "a high-quality, realistic photograph of the planet Earth from space",
            "Sun": "a scientifically accurate photograph of the Sun, showing its fiery surface and solar flares",
            "Moon": "a detailed photograph of the Moon's surface, showing craters clearly",
            "Galaxy": "a beautiful deep space photograph of a spiral galaxy",
            "Blackhole": "a scientifically accurate photograph of a black hole with its accretion disk",
        }

    def enrich_prompt(self, entity: str) -> str:
        """
        Converts a simple entity into a direct and clear image generation prompt using Cerebras.
        """
        if entity.title() in self.default_templates:
            print(f"Found template for '{entity}'.")
            return self.default_templates[entity.title()]

        print(f"No template found for '{entity}'. Using Cerebras to enrich...")
        
        # This prompt asks for a simple, clear photograph description.
        prompt = f"""
        You are an expert at creating simple, clear, and descriptive prompts for an AI image generator.
        Your task is to take a simple concept and turn it into a prompt for a high-quality, realistic photograph.

        Rules:
        - The prompt should start with "a high-quality, detailed photograph of..."
        - Add 1-2 key descriptive details about the entity.
        - Do NOT use artistic or cinematic words like "dramatic", "8k", "hyperdetailed".
        - Return ONLY the prompt text.

        Example Input: Frog
        Example Output: a high-quality, detailed photograph of a green tree frog sitting on a wet leaf

        Now, create a prompt for the following entity: {entity}
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                stream=False
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"❌ Cerebras API error enriching prompt: {e}")
            return f"a high-quality photograph of {entity}"

    def enrich_prompts(self, entities: List[str]) -> Dict[str, str]:
        enriched = {}
        for entity in entities:
            enriched[entity] = self.enrich_prompt(entity)
        return enriched

def test_prompt_enricher():
    """Test the PromptEnricher with the updated Cerebras logic"""
    print("\n--- Running PromptEnricher Standalone Test (with Cerebras) ---")
    try:
        enricher = PromptEnricher()
        test_entities = ["Earth", "Frog", "Galaxy", "Mountain"]

        enriched_dict = enricher.enrich_prompts(test_entities)
        
        for entity, prompt in enriched_dict.items():
            print(f"\n  Original: {entity}")
            print(f"  -> Enriched: {prompt}")

        print("\n✅ Test successful!")
    except Exception as e:
        print(f"❌ Test failed with an unexpected error: {str(e)}")

if __name__ == "__main__":
    test_prompt_enricher()