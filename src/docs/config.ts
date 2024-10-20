const openApiConfig = {
  openapi: "3.0.0",
  info: {
    title: "Story API",
    version: "1.0.0",
    description:
      "API for creating and managing stories, characters, themes, worlds, and plots.",
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1/",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      Story: { type: 'object', properties: { id: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' } } },
      Theme: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' } } },
      World: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, description: { type: 'string' } } },
      Character: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, role: { type: 'string' } } },
      Plot: { type: 'object', properties: { id: { type: 'string' }, summary: { type: 'string' } } },
      Visual: { type: 'object', properties: { id: { type: 'string' }, imageUrl: { type: 'string' } } },
    },
  },
  paths: {
    "/stories": {
      post: {
        tags: ["stories"],
        summary: "Create a new story",
        operationId: "createStory",
        security: [{ bearerAuth: [] }],
        // requestBody: {
        //   required: true,
        //   content: {
        //     "application/json": {
        //       schema: {
        //         type: "object",
        //         properties: {
        //           title: { type: "string" },
        //           description: { type: "string" },
        //           // Add other properties as necessary
        //         },
        //         required: ["title"],
        //       },
        //     },
        //   },

        // },
        responses: {
          201: {
            description: "Story created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    storyId: { type: "string" },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    success: { type: "boolean" },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    success: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Get all stories for the logged-in user',
        operationId: 'getAllStories',
        tags: ['stories'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of stories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Story' },
                },
              },
            },
          },
        },
      },
    },
    "/stories/{storyId}/character": {
      post: {
        tags: ["stories"],
        summary: "Create a character for a story",
        operationId: "createCharacter",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            description: "ID of the story",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  traits: { type: "array", items: { type: "string" } },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Character created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    characterId: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input",
          },
        },
      },
    },
    "/stories/{storyId}/character/{characterId}/refine": {
      patch: {
        tags: ["stories"],
        summary: "Refine a character",
        operationId: "refineCharacter",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "characterId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  traits: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Character refined successfully",
          },
          404: {
            description: "Character not found",
          },
        },
      },
    },
    "/stories/{storyId}/character/{characterId}/save": {
      patch: {
        tags: ["stories"],
        summary: "Save a character",
        operationId: "saveCharacter",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "characterId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Character saved successfully",
          },
          404: {
            description: "Character not found",
          },
        },
      },
    },
    "/stories/{storyId}/plot": {
      post: {
        tags: ["stories"],
        summary: "Create a plot for a story",
        operationId: "createPlot",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                },
                required: ["title"],
              },
            },
          },
 
        },
        responses: {
          201: {
            description: "Plot created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    plotId: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input",
          },
        },
      },
    },
    "/stories/{storyId}/plot/{plotId}/refine": {
      patch: {
        tags: ["stories"],
        summary: "Refine a plot",
        operationId: "refinePlot",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "plotId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  details: { type: "string" },
                },
              },
            },
          },
 
        },
        responses: {
          200: {
            description: "Plot refined successfully",
          },
          404: {
            description: "Plot not found",
          },
        },
      },
    },
    "/stories/{storyId}/plot/{plotId}/save": {
      post: {
        tags: ["stories"],
        summary: "Save a plot",
        operationId: "savePlot",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "plotId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Plot saved successfully",
          },
          404: {
            description: "Plot not found",
          },
        },
      },
    },
    "/stories/{storyId}/theme": {
      post: {
        tags: ["stories"],
        summary: "Create a theme for a story",
        operationId: "createTheme",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                },
                required: ["title"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Theme created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    themeId: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input",
          },
        },
      },
    },
    "/stories/{storyId}/theme/{themeId}/refine": {
      patch: {
        tags: ["stories"],
        summary: "Refine a theme",
        operationId: "refineTheme",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "themeId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Theme refined successfully",
          },
          404: {
            description: "Theme not found",
          },
        },
      },
    },
    "/stories/{storyId}/theme/{themeId}/save": {
      patch: {
        tags: ["stories"],
        summary: "Save a theme",
        operationId: "saveTheme",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "themeId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Theme saved successfully",
          },
          404: {
            description: "Theme not found",
          },
        },
      },
    },
    "/stories/{storyId}/world": {
      post: {
        tags: ["stories"],
        summary: "Create a world for a story",
        operationId: "createWorld",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "World created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    worldId: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input",
          },
        },
      },
    },
    "/stories/{storyId}/world/{worldId}/refine": {
      patch: {
        tags: ["stories"],
        summary: "Refine a world",
        operationId: "refineWorld",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "worldId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  description: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "World refined successfully",
          },
          404: {
            description: "World not found",
          },
        },
      },
    },
    "/stories/{storyId}/world/{worldId}/save": {
      patch: {
        tags: ["stories"],
        summary: "Save a world",
        operationId: "saveWorld",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "storyId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "worldId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "World saved successfully",
          },
          404: {
            description: "World not found",
          },
        },
      },
    },
    // AUTH
    "/auth/login": {
      post: {
        tags: ["auth"],
        summary: "Login to the application",
        operationId: "login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    message: { type: "string" },
                    success: { type: "boolean" },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    success: { type: "boolean" },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    success: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/signup": {
      post: {
        tags: ["auth"],
        summary: "Sign up for a new account",
        operationId: "signup",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" },
                  email: { type: "string" },
                },
                required: ["username", "password", "email"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    message: { type: "string" },
                    success: { type: "boolean" },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    success: { type: "boolean" },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    success: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },

    // GET ENDPOINT
    
    '/stories/{storyId}': {
      get: {
        summary: 'Get a specific story by ID (owned by the user)',
        operationId: 'getStoryById',
        tags: ['stories'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'storyId',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Story details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Story' },
              },
            },
          },
        },
      },
    },
    '/stories/themes': {
      get: {
        summary: 'Get all themes for the logged-in user',
        operationId: 'getAllThemes',
        tags: ['stories'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of themes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Theme' },
                },
              },
            },
          },
        },
      },
    },
    '/stories/themes/{storyId}': {
      get: {
        summary: 'Get a specific theme by story ID (owned by the user)',
        operationId: 'getThemeByStoryId',
        tags: ['stories'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'storyId',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Theme details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Theme' },
              },
            },
          },
        },
      },
    },
    '/stories/worlds': {
      get: {
        summary: 'Get all worlds for the logged-in user',
        operationId: 'getAllWorlds',
        tags: ['stories'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of worlds',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/World' },
                },
              },
            },
          },
        },
      },
    },
    '/stories/worlds/{storyId}': {
      get: {
        summary: 'Get a specific world by story ID (owned by the user)',
        operationId: 'getWorldByStoryId',
        tags: ['stories'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'storyId',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'World details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/World' },
              },
            },
          },
        },
      },
    },
    '/stories/characters': {
      get: {
        summary: 'Get all characters for the logged-in user',
        operationId: 'getAllCharacters',
        tags: ['stories'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of characters',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Character' },
                },
              },
            },
          },
        },
      },
    },
    '/stories/characters/{storyId}': {
      get: {
        summary: 'Get a specific character by story ID (owned by the user)',
        operationId: 'getCharacterByStoryId',
        tags: ['stories'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'storyId',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Character details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Character' },
              },
            },
          },
        },
      },
    },
    '/stories/plots': {
      get: {
        summary: 'Get all plots (public access)',
        operationId: 'getAllPlots',
        security: [{ bearerAuth: [] }],
        tags: ['stories'],
        responses: {
          '200': {
            description: 'List of plots',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Plot' },
                },
              },
            },
          },
        },
      },
    },
    '/stories/plots/{storyId}': {
      get: {
        summary: 'Get a specific plot by story ID (public access)',
        operationId: 'getPlotByStoryId',
        security: [{ bearerAuth: [] }],
        tags: ['stories'],
        parameters: [
          {
            in: 'path',
            name: 'storyId',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Plot details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Plot' },
              },
            },
          },
        },
      },
    },
    '/stories/visuals': {
      get: {
        summary: 'Get all visuals (public access)',
        operationId: 'getAllVisuals',
        security: [{ bearerAuth: [] }],
        tags: ['stories'],
        responses: {
          '200': {
            description: 'List of visuals',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Visual' },
                },
              },
            },
          },
        },
      },
    },
    '/stories/visuals/{storyId}': {
      get: {
        summary: 'Get a specific visual by story ID (public access)',
        operationId: 'getVisualByStoryId',
        security: [{ bearerAuth: [] }],
        tags: ['stories'],
        parameters: [
          {
            in: 'path',
            name: 'storyId',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Visual details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Visual' },
              },
            },
          },
        },
      },
    }
  },

  tags: [
    { name: "auth", description: "Authentication operations" },
    { name: "stories", description: "Operations related to stories" },
  ],
};

export default openApiConfig;
