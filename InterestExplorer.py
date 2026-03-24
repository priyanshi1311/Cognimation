import os
import json
from dotenv import load_dotenv
from cerebras.cloud.sdk import Cerebras
from typing import Optional, List, Dict

# Load environment variables for the standalone test block
load_dotenv()

class InterestExplorer:
    def __init__(self):
        """
        Initialize the InterestExplorer with the Cerebras client.
        The client will automatically find the CEREBRAS_API_KEY in your .env file.
        """
        self.client = Cerebras()
        self.model = "qwen-3-235b-a22b-instruct-2507" # The model you suggested

    def generate_exploration(self, interest: str, time_to_read: Optional[int] = 1) -> str:
        """
        Generate an exploration of the user's interest using the Cerebras API.
        """
        word_count = time_to_read * 250
        prompt = f"""
        Generate an engaging exploration about {interest}. The response should:
        - Be approximately {word_count} words
        - Be structured in 3-4 clear paragraphs
        - Include specific examples and insights
        - Be written in an enthusiastic, knowledgeable tone
        - Highlight what makes {interest} fascinating
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                stream=False
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error generating content: {str(e)}"

    def generate_with_focus(self, interest: str, focus_aspect: str) -> str:
        """
        Generate an exploration with a specific focus aspect, using the Cerebras API.
        """
        if focus_aspect.lower() in ["no", "none", ""]:
            return "No problem! Feel free to ask for a focused exploration anytime."

        # THIS IS THE KEY FIX: A stricter, more direct prompt to remove commentary.
        prompt = f"""
        Your task is to follow the user's instruction precisely and nothing more.
        Do not add any commentary, analysis, or self-reflection about your own response.
        Just provide the educational text that is requested.

        User's instruction: "{focus_aspect}" for the topic "{interest}".
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                stream=False
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error generating content: {str(e)}"

    def potential_entities(self, text: str, interest: str) -> List[Dict[str, str]]:
        """
        Extract potential physical entities from text using the Cerebras API.
        """
        prompt = f"""
        Analyze the following text about {interest} and identify 3 physical entities 
        (objects, places, or things) that would be most suitable for visual representation. 
        
        Return ONLY a valid JSON object with an 'entities' array containing exactly 3 objects with these properties:
        - "name": The specific name of the entity
        - "description": A brief, clear description focusing on visual aspects
        - "relevance": Why this entity is important to understanding {interest}
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                stream=False
            )
            
            response_text = response.choices[0].message.content
            json_match = response_text[response_text.find('{'):response_text.rfind('}')+1]
            
            content = json.loads(json_match)
            return content.get("entities", [])
            
        except (json.JSONDecodeError, IndexError) as e:
            return [{"error": f"Invalid JSON returned by model. Error: {e}"}]
        except Exception as e:
            return [{"error": f"Error extracting entities: {str(e)}"}]

if __name__ == "__main__":
    # This block allows you to test this file directly
    print("--- Running InterestExplorer Standalone Test (with Cerebras) ---")
    
    explorer = InterestExplorer()

    interest = input("What's your interest? ")
    print("\n1. Generating basic exploration...\n")
    exploration = explorer.generate_exploration(interest)
    print(exploration)

    focus = input("\n2. Would you like to explore a specific aspect? (e.g., history): ")
    if focus.lower() not in ["no", "none", ""]:
        print("\n3. Generating focused exploration...\n")
        focused_exploration = explorer.generate_with_focus(interest, focus)
        print(focused_exploration)
        
        print("\n4. Extracting potential entities...\n")
        entities = explorer.potential_entities(focused_exploration, interest)
        print(json.dumps(entities, indent=2))
    
    print("\n--- Test Complete ---")