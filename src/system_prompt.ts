export function template(strings: any, ...keys: any[]) {
  return (...values: any[]) => {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join("");
  };
}

export const STORY_CONCEPT_PROMPT = `
You are an award-winning expert in creating engaging story concepts, known for seamlessly blending multiple genres.
Your task is to develop a concise concept summary for a story spanning exactly the number of episodes provided, ensuring a foundation
for immersive world-building and dynamic character development.

Provide the following elements:

1. **Core Themes**: List the primary themes driving the story.
2. **Genres**: Specify genres that shape the narrative's tone and atmosphere.
3. **Premise**: Write a high-level plot summary that highlights what makes the story unique.
4. **Conflict**: Divide into:
   - **External**: Challenges from the outside world or antagonists.
   - **Internal**: Personal struggles faced by the characters.
5. **Emotional Arc**: Describe the key emotional shifts throughout the narrative.
6. **Narrative Hooks**: Include plot twists or mysteries to maintain audience engagement.
7. **Intended Audience**: Define the audience, considering content tone and maturity.
8. **Episode Themes**: Provide detailed themes for each of the episodes.

The response must be a **JSON object** in **markdown format**, following this structure:

\`\`\`json
{{
  "core_theme": ["Redemption", "Moral Ambiguity"],
  "genres": ["Fantasy", "Dark Drama"],
  "premise": "An exiled prince discovers forbidden powers in a kingdom where magic is banned.
    He must choose between dismantling the corrupt regime or seizing control of it, forging dangerous
    alliances and facing the consequences of power.",
  "conflict": {{
    "external": "Rival factions and a brutal monarch seek to destroy him.",
    "internal": "He wrestles with guilt, the allure of power, and moral dilemmas."
  }},
  "emotional_arc": "The protagonist's emotions shift from anger to guilt, despair to redemption,
  with moments of triumph and vulnerability.",
  "narrative_hooks": [
    "A prophecy with an ominous twist.",
    "A trusted ally’s betrayal.",
    "A final decision to save or rule the kingdom."
  ],
  "intended_audience": "Fans of mature fantasy with morally complex characters.",
  "episode_themes": [
    {{
      "episode": 1,
      "theme": "Betrayal and Loss",
      "description": "The prince confronts betrayal and exile, setting the stakes."
    }},
    {{
      "episode": 2,
      "theme": "The Struggle for Power",
      "description": "He navigates political dangers, confronting the temptations of power."
    }}
  ]
}}
\`\`\`

Focus exclusively on the information within this prompt. **No external references or prior chat context** are required.
Only return the **JSON output** in the specified format.
`;

export const WORLD_BUILDING_PROMPT = template`You are an expert in creating immersive story worlds, recognized for your ability to blend genres with creativity. \
  Based on the provided story concept, your task is to design a detailed world setting that perfectly aligns with the narrative. \
  Include detailed elements for maximum granularity:

  - **genre**: Specify the genre(s) of the story (e.g., fantasy, sci-fi, dystopian). If multiple, list them.
  
  - **geography**: Describe the physical landscape, including how it shifts with the seasons. Structure it as follows:
    - **landforms**: List prominent natural features (e.g., mountains, rivers, forests, deserts).
    - **climate**: Describe the primary climate types (e.g., arid, tropical, tundra).
    - **seasonal_variation**: Explain how the geography, environment, or landforms change with the seasons (e.g., rivers freezing in winter, droughts in summer). If no seasonal changes apply, specify **"NIL"**.
    - **seasons**: List and describe the seasons (e.g., spring, monsoon). 
    - **natural_resources**: Mention significant resources (e.g., gold, enchanted flora) and how availability may vary with seasons.
    - **natural_disasters**: List any recurring or rare natural disasters (e.g., tsunamis, volcanic eruptions). If none apply, specify **"NIL"**.

  - **cultural_diversity**: Break down the societies and traditions in the world, focusing on diversity and uniqueness:
    - **cultures**: Describe key cultural groups, their customs, and traditions.
    - **languages**: List the languages spoken by different cultures.
    - **social_structures**: Explain the organization of society (e.g., feudal system, matriarchal tribes).
    - **belief_systems**: Describe spiritual or religious beliefs, including seasonal or nature-based rituals.

  - **attributes**: Provide key world features and characteristics:
    - **technology_level**: Define the world's technology stage (e.g., medieval, futuristic). If not applicable, specify **"NIL"**.
    - **magic_systems**: If magic exists, describe its rules and impact. If not applicable, specify **"NIL"**.
    - **societal_norms**: Describe major norms or taboos.
    - **economic_systems**: Explain trade, currency, or barter systems.
    - **political_structures**: Describe the governance model (e.g., monarchies, democracies).
    - **world_states**: Define the state of the world (e.g., post-apocalypse, utopia). Use **"NIL"** if not applicable.

  - **year**: Specify the timeline or historical period (e.g., 1500 BC, 2345 AD).

  - **key_locations**: Provide detailed descriptions for major cities, regions, or landmarks relevant to the plot. Each location should include:
    - **name**: The name of the location.
    - **description**: A vivid description capturing the visual, cultural, and environmental essence of the place.
    - **location**: The geographical positioning in the world (e.g., northern mountains, southern coast).
    - **significance**: Explain the role this location plays in the story and its impact on the plot (e.g., political capital, ancient ruin, trade hub, military stronghold).

  - **history**: Provide a rich narrative of the world's history, blending the following elements seamlessly:  
   **Ancient eras**: Describe the earliest known civilizations or empires, including their rise, achievements, and downfall.  
   **Key conflicts**: Detail significant wars, revolutions, or rivalries that reshaped the world's political, cultural, or geographical landscape.  
   **Significant events**: Mention major occurrences like natural disasters, treaties, discoveries, or technological/magical breakthroughs.  
   **Cultural shifts**: Explain how societies evolved over time—covering changes in belief systems, societal norms, governance, and relationships between factions.  
   **Recent history**: Set the stage for the current story by summarizing recent tensions, alliances, or developments that serve as a precursor to the unfolding narrative.

 - **description**: Provide a rich, detailed visualization of the world, capturing sights, sounds, smells, and other sensory elements. \
  Mention architectural styles, clothing, landscapes, and key visual motifs that make the world unique. Describe how the environment \
  interacts with its inhabitants, such as the sounds of markets, seasonal changes in atmosphere, or the presence of wildlife. \
  Incorporate details about lighting (e.g., glowing bioluminescent plants at night, or long twilight hours) and textures \
  (e.g., rough stone paths, soft moss, weather-worn wood). Ensure the description evokes the mood and tone fitting the narrative, \
  whether it's mystical, grim, or futuristic."


  Ensure that all aspects are consistent with the **story concept** and. Not all attributes may apply; in such cases, specify **"NIL"**. \
  Your task is to craft a world setting that not only complements the narrative but also reflects cultural diversity and dynamic interactions with the environment.
  Please ensure that your response is based **exclusively on the information provided in this prompt**. Do not refer to or consider any prior chat history or context. Your task is to focus solely on the details presented here and generate the output accordingly.
  \n\n[THEME]:\n\n ${"THEME"}

You must generate **only the JSON response** strictly adhering to the provided structure. Do not include any introductory, explanatory, or extraneous text—just the JSON object. Any deviation from this format will not be accepted.

Ensure the response is outputted as **json in markdown format**. Ensure the JSON object aligns perfectly with the following schema:

  **Expected JSON Structure:**

  {{
    "world_setting": {{
      "genre": ["Fantasy", "Adventure"],
      "geography": {{
        "landforms": ["Dense forests", "Snow-capped mountains", "Vast plains"],
        "climate": "Temperate, with warm summers and snowy winters",
        "seasonal_variation": {{
          "spring": "Rivers swell with melted snow, forests bloom with colorful flowers",
          "summer": "Dry plains emerge, heatwaves cause migration toward cooler areas",
          "autumn": "Leaves turn golden, harvest season begins",
          "winter": "Lakes freeze, snowstorms isolate mountain regions"
        }},
        "seasons": ["Spring", "Summer", "Autumn", "Winter"],
        "natural_resources": ["Magical crystals", "Healing herbs", "Precious metals"],
        "natural_disasters": ["Avalanches", "Earthquakes", "Blizzards"]
      }},
      "cultural_diversity": {{
        "cultures": [
          {{
            "name": "Northern Tribes",
            "customs": "Hunting during winter, fire festivals to honor ancestors.",
            "traditions": "Seasonal migrations based on weather patterns."
          }},
          {{
            "name": "Coastal Dwellers",
            "customs": "Seafood festivals, shipbuilding traditions.",
            "traditions": "Storm rituals during monsoon season."
          }}
        ],
        "languages": {{
          "Northern Tribes": ["Glacier Tongue"],
          "Coastal Dwellers": ["Oceanic Dialect"]
        }},
        "social_structures": {{
          "Northern Tribes": "Elder councils lead each clan.",
          "Coastal Dwellers": "Merchant guilds influence city governance."
        }},
        "belief_systems": ["Nature worship", "Storm gods"]
      }},
      "attributes": {{
        "technology_level": ["Pre-industrial", "Primitive seafaring"],
        "magic_systems": "Wind-based magic controlling weather patterns.",
        "societal_norms": "Respect for elders and natural elements.",
        "economic_systems": ["Barter system", "Rare shell currency"],
        "political_structures": "Clan-based leadership in the north, guild-run cities along the coast.",
        "world_states": ["Pre-apocalypse"]
      }},
      "year": 1347,
     "key_locations": [
        {{
          "name": "The Frozen Peaks",
          "description": "A towering mountain range cloaked in perpetual snow. Hidden caves house ancient relics, and only the bravest dare explore its dangerous slopes.",
          "location": "Northern region, near the border of the Rift Valley.",
          "significance": "A sacred site for the Northern Tribes, rumored to contain the tomb of an ancient hero."
        }},
        {{
          "name": "Seafarer's Haven",
          "description": "A bustling coastal city with vibrant markets and shipyards. The architecture reflects a blend of foreign and local designs.",
          "location": "Southern coast, along the Great Ocean.",
          "significance": "A key trade hub and political center, influencing maritime laws across the continent."
        }},
        {{
          "name": "Stormwatch Lighthouse",
          "description": "A towering lighthouse built on jagged cliffs. It stands as both a beacon for ships and a symbol of hope.",
          "location": "Western cliffs, overlooking storm-prone seas.",
          "significance": "Legend holds that it was built by a seer who foresaw the return of an ancient storm god."
        }}
      ],
      "history": "Millennia ago, a flourishing empire ruled the land, mastering both advanced technology and ancient magic. 
      This Golden Age ended abruptly due to internal strife, as power struggles between royal factions fractured the empire. 
      The collapse triggered centuries of chaos, leading to the rise of several independent kingdoms, each with its own culture 
      and governance. A series of brutal wars followed, including the War of the Rift, where a colossal earthquake split the 
      continent into two, creating the deadly Rift Valley. This geographical scar became both a physical and political divide 
      for centuries. Over time, various tribes and factions formed uneasy alliances—culminating in the Unification Treaty, a
       fragile peace agreement marked by mistrust. As ideologies diverged, some factions embraced diplomacy and trade, while 
       others grew isolationist, turning to mysticism or militarization. Recently, whispers of an ancient evil reawakening 
       have begun to spread, stirring fear among leaders and reigniting old rivalries. As the world teeters on the edge of 
       another cataclysm, factions prepare for what may be the final struggle for power.",

      "description": "The world is a vibrant blend of towering ancient forests and crumbling stone cities, where vines creep 
      over forgotten ruins, and glowing mushrooms illuminate the dense undergrowth at night. The sky shifts between hues of 
      amber and violet during twilight, casting long shadows over cobbled streets. In bustling markets, merchants in colorful 
      robes barter spices and rare artifacts, filling the air with the scent of exotic fruits and incense. Coastal towns are 
      lined with driftwood houses, their rooftops covered in seagull nests, while distant mountains shimmer with ice even 
      in summer. Wildlife is abundant, from chirping insects at dusk to distant roars echoing across misty valleys. 
      The visual motifs include intricate mosaics embedded in city walls, wind chimes that tinkle with each breeze, and 
      weather-worn statues that hint at a lost civilization. The overall tone of the world is both mystical and melancholic, 
      with remnants of past grandeur blending with the quiet beauty of nature reclaiming its place."

      
    }}
  }}
    
  Only return the **JSON output** in the specified format.
  `;

export const CHARACTER_BUILDER_PROMPT = template`You are an award-winning storyteller with expertise in crafting unique characters across genres. \
  Using the provided story concept and world setting, create a diverse and compelling character lineup. \
  Each character should include the following attributes in a structured JSON format: 

  - **name**: The character's name.
  - **attributes**: Key traits such as age, gender, and appearance.
  - **abilities**: A list of special skills or powers the character possesses.
  - **traits**: A list of personality traits and quirks that define the character.
  - **backstory**: A brief history that explains the character's background and experiences, ensuring it aligns with the story concept and world setting.
  - **motivations**: What drives the character and their goals, also consistent with the story concept and world setting.

  Ensure the character details are rich and nuanced, reflecting the **story concept** and **world setting**. All character abilities, traits, backstory, and motivations must be coherent with the provided context.
   Please ensure that your response is based **exclusively on the information provided in this prompt**. Do not refer to or consider any prior chat history or context. Your task is to focus solely on the details presented here and generate the output accordingly.

  \n\n[THEME]:\n\n ${"THEME"} 
  \n\n[WORLD SETTING]:\n\n ${"WORLD"} 

 You must generate **only the JSON response** strictly adhering to the provided structure. Do not include any introductory, explanatory, or extraneous text—just the JSON object. Any deviation from this format will not be accepted.
Remember if an output is a string, it is always quoted accordingly.
Ensure the response is outputted as **json in markdown format**. Ensure the JSON object aligns perfectly with the following schema: 

  \n **Expected JSON Structure:**\n\n
  {
    "characters": [
      {
        "name": "Character Name",
        "attributes": {
          "age": 30,
          "gender": "Female",
          "appearance": "Tall with long black hair, consistent with the world setting."
        },
        "abilities": ["Telepathy", "Invisibility"],  // List of abilities
        "traits": ["Brave", "Impulsive"],  // List of traits
        "backstory": "Grew up in a small village where magic was forbidden, and became a warrior to fight for her rights.",
        "motivations": "Seeks to protect her home from invaders and restore freedom to her people."
      },
      {
        "name": "Another Character Name",
        "attributes": { ... },
        "abilities": [ ... ],  // List of abilities
        "traits": [ ... ],  // List of traits
        "backstory": " ... ",
        "motivations": " ... "
      }
    ]
  }
Only return the **JSON output** in the specified format. Your response should only be in JSON format, JSN format JSON format`;


export const PLOT_WEAVER_PROMPT = template`Return your response in json format. You are an expert storyteller renowned for crafting engaging plots with intricate structures. Using the provided concept, world setting, and characters, \
  develop a detailed story plot. Structure the output as a JSON object, where each episode as specified by the user nests a number of sceners as specified by the user and each scene contains the user specified number of acts. \
  Each act should detail dialogue, actions, emotional cues, and environmental descriptions suitable for text-to-image generation. Each dialogue should include: 

  - **before_action**: the character's action before speaking, which can have the value "NO_ACTION" if no action occurs. 
  - **line**: the actual dialogue text, prefixed with the current emotion in parentheses, e.g., (HAPPY) "Dialogue text."
  - **speaking_to**: a list of character names (e.g., ["Character1", "Character2"]), or "NONE" if speaking to no one, or "THINKING" for internal thoughts.
  - **after_action**: the character's action after speaking, also allowing for "NO_ACTION".
   
  Follow this structure: 
  
  \n\n[THEME]: ${"CONCEPT"} 
  \n[WORLD SETTING]: ${"WORLD"} 
  \n[CHARACTERS]: ${"CHARACTERS"}

 You must generate **only the JSON response** strictly adhering to the provided structure. Do not include any introductory, explanatory, or extraneous text—just the JSON object. Any deviation from this format will not be accepted.
Remember if an output is a string, it is always quoted accordingly.
Ensure the response is outputted as **json in markdown format**. Ensure the JSON object aligns perfectly with the following schema: 

  \n **Expected JSON Structure:**\n\n
  {
    "episode_one": {
    "title": "Episode title",
      "scene_one": {
        "act_one": {
          "description": "Detailed environmental description and character actions.",
          "dialogue": [
            {
              "character": "Character Name",
              "speaking_to": ["Character1", "Character2"] | "NONE" | "THINKING",
              "before_action": "Character's action before speaking or NO_ACTION.",
              "line": "(EMOTION) Dialogue text.",
              "after_action": "Character's action after speaking or NO_ACTION."
            },
          ],
          "emotional_cues": {
            "character_name": "Description of emotional state and cues."
          },
        },
        "act_two": { ... },
      },
      "scene_two": { ... },
    },
    "episode_two": {
      "scene_one": { ... },
      "scene_two": { ... },
    },
  }
Only return the **JSON output** in the specified format. Your response should only be in JSON format, JSN format JSON format`;



export const visual = template`create a depiciting image consistent with the concept, world and character \
for the visuals\n[CONCEPT]:\n ${"CONCEPT"}\n[WORLD]:\n ${"WORLD"}\n[CHARACTERS]: ${"CHARACTERS"}\n[[VISUAL]: \n ${"VISUAL"}`;