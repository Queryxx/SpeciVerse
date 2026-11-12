export type Species = {
  id: string;
  name: string;
  scientific: string;
  category: string;
  region: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  status: string;
  statusTone: string;
  introduction: string;
  habitat: string;
  diet: string;
  wildPopulation: string;
  facts: [string, string, string];
  fieldNote: string;
};

export const species: [Species, ...Species[]] = [
  {
    id: "snow-leopard",
    name: "Snow leopard",
    scientific: "Panthera uncia",
    category: "Mammals",
    region: "Central Asia",
    image: "/images/snow-leopard.jpg",
    imageWidth: 1600,
    imageHeight: 1056,
    imageAlt: "Snow leopard crossing a rugged, snow-covered mountain ledge",
    status: "Vulnerable",
    statusTone: "watch",
    introduction:
      "On the high, wind-cut ridges of Central Asia, a ghost moves almost without a sound. The snow leopard is made for a life above the tree line, where the air is thin and the slopes seem to fall away forever.",
    habitat: "High mountain ranges",
    diet: "Wild sheep & goats",
    wildPopulation: "Fewer than 10,000 adults",
    facts: ["Long, balancing tail", "Lives at high altitudes", "Active mostly at dawn"],
    fieldNote:
      "Look for rounded tracks along a ridge crest: these elusive cats often travel predictable routes between rocky outcrops.",
  },
  {
    id: "red-fox",
    name: "Red fox",
    scientific: "Vulpes vulpes",
    category: "Mammals",
    region: "North America & Eurasia",
    image: "/images/red-fox.jpg",
    imageWidth: 1200,
    imageHeight: 912,
    imageAlt: "Red fox standing among ferns in a green woodland clearing",
    status: "Least concern",
    statusTone: "safe",
    introduction:
      "A flash of russet at the forest edge, then stillness. The red fox is a quiet, adaptable neighbour, at home in deep woods, open farmland, and the margins of busy towns.",
    habitat: "Woodland & open country",
    diet: "Omnivore",
    wildPopulation: "Widespread",
    facts: ["Hears tiny movements", "Uses many different calls", "Dens called earths"],
    fieldNote:
      "Paw prints form a neat line in fresh snow or soft mud, a sign of the fox’s direct, purposeful walking gait.",
  },
  {
    id: "monarch-butterfly",
    name: "Monarch butterfly",
    scientific: "Danaus plexippus",
    category: "Insects",
    region: "The Americas",
    image: "/images/monarch-butterfly.jpg",
    imageWidth: 1200,
    imageHeight: 912,
    imageAlt: "Monarch butterfly resting on a purple wildflower in a sunny meadow",
    status: "Endangered",
    statusTone: "watch",
    introduction:
      "Painted orange and black, the monarch carries a remarkable map in its wings. Over generations, these delicate travellers cross whole continents, finding their way to sheltered winter forests.",
    habitat: "Meadows & open fields",
    diet: "Flower nectar",
    wildPopulation: "Falling in some regions",
    facts: ["Tastes with its feet", "Migration spans generations", "Caterpillars need milkweed"],
    fieldNote:
      "In summer, inspect milkweed leaves for tiny striped caterpillars and pale, jade-green chrysalises.",
  },
  {
    id: "green-sea-turtle",
    name: "Green sea turtle",
    scientific: "Chelonia mydas",
    category: "Reptiles",
    region: "Tropical oceans worldwide",
    image: "/images/sea-turtle.jpg",
    imageWidth: 1200,
    imageHeight: 912,
    imageAlt: "Green sea turtle gliding over a sunlit coral reef",
    status: "Endangered",
    statusTone: "watch",
    introduction:
      "A green sea turtle glides as if the current were carrying it. It may cross an ocean to return to the very beach where its own journey began, guided by a shoreline it has never forgotten.",
    habitat: "Tropical coastal waters",
    diet: "Seagrass & algae",
    wildPopulation: "Declining in many regions",
    facts: ["Returns to nesting beaches", "Can travel great distances", "Rests beneath reef ledges"],
    fieldNote:
      "Sea turtles need quiet, dark beaches to nest; even small changes in shoreline lighting can disorient hatchlings.",
  },
];

export const speciesPages = ["At a glance", "Range & habitat", "Field notes"] as const;
export type SpeciesPage = (typeof speciesPages)[number];

export const speciesCategories = ["All species", "Mammals", "Insects", "Reptiles"] as const;
export type SpeciesCategory = (typeof speciesCategories)[number];

export function categorySlug(category: SpeciesCategory) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function categoryFromSlug(slug: string): SpeciesCategory | null {
  return speciesCategories.find((category) => categorySlug(category) === slug) ?? null;
}
