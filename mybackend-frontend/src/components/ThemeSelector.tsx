import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";

interface BookTheme {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  category: string;
  popular?: boolean;
}

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeSelect: (themeId: string) => void;
  className?: string;
}

export const bookThemes: BookTheme[] = [
  // Fantasy & Adventure
  {
    id: "enchanted-forest",
    name: "Enchanted Forest",
    preview: "🌲🧚‍♀️✨",
    category: "Fantasy",
    popular: true,
    colors: {
      primary: "#10b981",
      secondary: "#84cc16",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      text: "#14532d",
      accent: "#fbbf24",
    },
  },
  {
    id: "magical-kingdom",
    name: "Magical Kingdom",
    preview: "🏰👸🐉",
    category: "Fantasy",
    popular: true,
    colors: {
      primary: "#8b5cf6",
      secondary: "#a78bfa",
      background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
      text: "#4c1d95",
      accent: "#f59e0b",
    },
  },
  {
    id: "underwater-world",
    name: "Underwater World",
    preview: "🌊🐠🐙",
    category: "Fantasy",
    colors: {
      primary: "#06b6d4",
      secondary: "#22d3ee",
      background: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
      text: "#164e63",
      accent: "#f97316",
    },
  },

  // Space & Science
  {
    id: "space-exploration",
    name: "Space Exploration",
    preview: "🚀🌟👽",
    category: "Science",
    popular: true,
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)",
      text: "#eff6ff",
      accent: "#fbbf24",
    },
  },
  {
    id: "science-lab",
    name: "Science Lab",
    preview: "🧪⚗️🔬",
    category: "Science",
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
      text: "#064e3b",
      accent: "#dc2626",
    },
  },

  // Animals & Nature
  {
    id: "jungle-adventure",
    name: "Jungle Adventure",
    preview: "🌴🦜🐆",
    category: "Animals",
    popular: true,
    colors: {
      primary: "#059669",
      secondary: "#84cc16",
      background: "linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)",
      text: "#14532d",
      accent: "#ea580c",
    },
  },
  {
    id: "safari-journey",
    name: "Safari Journey",
    preview: "🌍🦁🐘",
    category: "Animals",
    colors: {
      primary: "#ea580c",
      secondary: "#fb923c",
      background: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)",
      text: "#7c2d12",
      accent: "#0891b2",
    },
  },

  // Modern & Tech
  {
    id: "tech-future",
    name: "Tech Future",
    preview: "🤖💻🚄",
    category: "Technology",
    popular: true,
    colors: {
      primary: "#0891b2",
      secondary: "#06b6d4",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      text: "#134e4a",
      accent: "#be123c",
    },
  },
  {
    id: "coding-adventure",
    name: "Coding Adventure",
    preview: "💻⌨️🎮",
    category: "Technology",
    colors: {
      primary: "#be123c",
      secondary: "#f43f5e",
      background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      text: "#7f1d1d",
      accent: "#0ea5e9",
    },
  },

  // Arts & Creativity
  {
    id: "rainbow-art",
    name: "Rainbow Art",
    preview: "🌈🎨🖌️",
    category: "Art",
    popular: true,
    colors: {
      primary: "#db2777",
      secondary: "#ec4899",
      background: "linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%)",
      text: "#831843",
      accent: "#0891b2",
    },
  },
  {
    id: "music-world",
    name: "Music World",
    preview: "🎵🎸🎹",
    category: "Art",
    colors: {
      primary: "#7c3aed",
      secondary: "#a78bfa",
      background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
      text: "#4c1d95",
      accent: "#f59e0b",
    },
  },

  // Sports & Games
  {
    id: "sports-fun",
    name: "Sports Fun",
    preview: "⚽🏀🎾",
    category: "Sports",
    popular: true,
    colors: {
      primary: "#dc2626",
      secondary: "#ef4444",
      background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      text: "#7f1d1d",
      accent: "#0ea5e9",
    },
  },
  {
    id: "olympic-games",
    name: "Olympic Games",
    preview: "🏅🏃‍♀️🏊‍♂️",
    category: "Sports",
    colors: {
      primary: "#0891b2",
      secondary: "#06b6d4",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      text: "#134e4a",
      accent: "#fbbf24",
    },
  },

  // Nature & Environment
  {
    id: "climate-action",
    name: "Climate Action",
    preview: "🌍♻️🌱",
    category: "Environment",
    popular: true,
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
      text: "#064e3b",
      accent: "#dc2626",
    },
  },
  {
    id: "garden-paradise",
    name: "Garden Paradise",
    preview: "🌺🦋🌻",
    category: "Environment",
    colors: {
      primary: "#84cc16",
      secondary: "#a3e635",
      background: "linear-gradient(135deg, #f7fee7 0%, #dcfce7 100%)",
      text: "#14532d",
      accent: "#ea580c",
    },
  },
];

const categories = [
  "All",
  "Fantasy",
  "Science",
  "Animals",
  "Technology",
  "Art",
  "Sports",
  "Environment",
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeSelect,
  className = "",
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredThemes =
    selectedCategory === "All"
      ? bookThemes
      : bookThemes.filter((theme) => theme.category === selectedCategory);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-6 ${className}`}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-slate-900">
            Choose Your Book Theme
          </h3>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Select a beautiful theme that matches your story's mood and genre
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {filteredThemes.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onThemeSelect(theme.id)}
            className={`relative cursor-pointer rounded-xl border-2 transition-all ${
              selectedTheme === theme.id
                ? "border-primary shadow-lg shadow-primary/20"
                : "border-slate-200 hover:border-slate-300 hover:shadow-md"
            }`}
            style={{ background: theme.colors.background }}
          >
            {theme.popular && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                Popular
              </div>
            )}

            <div className="p-4">
              {/* Preview Emoji */}
              <div className="text-3xl mb-2 text-center">{theme.preview}</div>

              {/* Theme Name */}
              <div className="text-center">
                <div
                  className="font-semibold text-sm mb-1"
                  style={{ color: theme.colors.text }}
                >
                  {theme.name}
                </div>
                <div
                  className="text-xs opacity-75"
                  style={{ color: theme.colors.text }}
                >
                  {theme.category}
                </div>
              </div>

              {/* Color Palette Preview */}
              <div className="flex justify-center gap-1 mt-2">
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>
            </div>

            {/* Selected Indicator */}
            {selectedTheme === theme.id && (
              <div className="absolute top-2 left-2 bg-primary text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Custom Theme Option */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <Button variant="outline" className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          Create Custom Theme
        </Button>
      </div>
    </div>
  );
};

export const getThemeById = (themeId: string): BookTheme | undefined => {
  return bookThemes.find((theme) => theme.id === themeId);
};

export const applyThemeToElement = (themeId: string, element: HTMLElement) => {
  const theme = getThemeById(themeId);
  if (!theme) return;

  // Apply theme colors to CSS custom properties
  element.style.setProperty("--theme-primary", theme.colors.primary);
  element.style.setProperty("--theme-secondary", theme.colors.secondary);
  element.style.setProperty("--theme-accent", theme.colors.accent);
  element.style.setProperty("--theme-background", theme.colors.background);
  element.style.setProperty("--theme-text", theme.colors.text);
};
