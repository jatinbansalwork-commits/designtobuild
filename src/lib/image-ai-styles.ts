export type ImageAiStyleOption = {
  id: string;
  label: string;
  preview: string;
};

export const IMAGE_AI_STYLES: readonly ImageAiStyleOption[] = [
  { id: "photo", label: "Surprise me", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/surprise.svg" },
  { id: "illustration", label: "Text Based", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/Kappa%20Alpha%20Theta%20Tie%20Graphic%20PR%20Shirt.jpg" },
  { id: "sketch", label: "Photorealistic", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/1zjWPuAEowfr83L48QYee3eFdfWxIJGqa.jpg" },
  { id: "anime", label: "60s & 70s", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/Alpha%20Delta%20Pi%20Concert%20Scene%20Mixer%20Shirt.jpg" },
  { id: "3d", label: "80s & 90s", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/Sigma%20Delta%20Tau%20Denim%20Stars%20Stitched%20Patch%20PR%20Hoodie.jpg" },
  { id: "minimal", label: "Cartoons", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/Discoball%20And%20CD%20Date%20Party%20Shirt_1.jpg" },
  { id: "retro", label: "Classic", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/Sigma%20Chi%20Ripped%20Paper%20Receipt%20Illustration%20Recruitment%20Sweater.jpg" },
  { id: "neon", label: "Grunge", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/Sigma%20Phi%20Epsilon%20American%20Flag%20with%20Distress%20Effect%20PR%20Shirt.jpg" },
  { id: "line-art", label: "Handdrawn", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/Tau%20Kappa%20Epsilon%20Golf%20Bear%20Fall%20Rush%20Sweater.jpg" },
  { id: "oil-painting", label: "Minimalist", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/FPS247286%20CU%20AI.jpg" },
  { id: "varsity", label: "Varsity", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/Chi%20Omega%20Navy%20Text%20and%20Hearts%20PR%20Tank.jpg" },
  { id: "y2k", label: "Y2k", preview: "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/design%20to%20build/FP%20image/FPS247870%20CU%20AI.jpg" },
] as const;

export function getImageAiStyle(styleId: string) {
  return IMAGE_AI_STYLES.find((style) => style.id === styleId) ?? IMAGE_AI_STYLES[0];
}
