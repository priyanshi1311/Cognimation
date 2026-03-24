import os
from cerebras.cloud.sdk import Cerebras
from typing import List
from dotenv import load_dotenv

# Load environment variables for the standalone test
load_dotenv()

class EntityExtractor:
    def __init__(self):
        """
        Initialize the EntityExtractor with the Cerebras client.
        The client automatically finds the CEREBRAS_API_KEY in your .env file.
        """
        self.client = Cerebras()
        self.model = "qwen-3-235b-a22b-instruct-2507" # The model you suggested

    def extract_concepts(self, text: str) -> List[str]:
        """
        Extracts the main subject from a user's question or topic.
        """
        # THIS IS THE KEY FIX: The prompt is now focused on finding the main subject of a question.
        prompt = f"""
        From the user's question or topic below, identify the single most important physical subject (a character, object, or place).

        Rules:
        1.  **IMPORTANT**: You MUST only return the main subject.
        2.  Do NOT return abstract ideas like "information", "explanation", or "color".
        3.  Return ONLY a single, comma-separated word or name.

        Example Input: Tell me about the Eiffel Tower in Paris.
        Example Output: Eiffel Tower

        Example Input: Superman
        Example Output: Superman
        
        Example Input: Which is the longest river in India?
        Example Output: Ganges River

        User's question or topic to analyze:
        "{text}"
        """

        try:
            print(f"Extracting main subject from '{text}' with Cerebras...")
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                stream=False
            )
            response_text = response.choices[0].message.content
            # Cleanly parse the comma-separated string from the model
            concepts = [concept.strip() for concept in response_text.split(',') if concept.strip()]
            print(f"✅ Extracted subject: {concepts}")
            return concepts
        except Exception as e:
            print(f"❌ Cerebras API error during entity extraction: {e}")
            return [f"error: {str(e)}"]

def test_entity_extractor():
    """Test the updated EntityExtractor with Cerebras"""
    try:
        print("\n--- Running EntityExtractor Standalone Test (with Cerebras) ---")
        
        extractor = EntityExtractor()

        # Using your original, more comprehensive test case
        test_text = """
        The James Webb Space Telescope is a large infrared telescope with a 6.5-meter primary mirror. 
        It observes the universe in infrared, allowing it to see through cosmic dust and study the 
        light from the first galaxies that formed after the Big Bang. It orbits the Sun far beyond the Moon.
        """

        print(f"\nInput text:\n---\n{test_text}\n---")

        concepts = extractor.extract_concepts(test_text)
        print("\nExtracted concepts:", concepts)

        if concepts and "error" not in concepts[0]:
            print("\n✅ Test successful!")
        else:
            print("\n❌ Test failed.")

    except Exception as e:
        print(f"Test failed with an unexpected error: {str(e)}")

if __name__ == "__main__":
    test_entity_extractor()