import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { postSchema } from './schemas/post';

export default defineConfig({
  name: 'virtusoperandi',
  title: 'Virtus Operandi',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset:   process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [
    structureTool(),
    visionTool(),   // GROQ playground — remove in production if desired
  ],

  schema: {
    types: [postSchema],
  },
});
