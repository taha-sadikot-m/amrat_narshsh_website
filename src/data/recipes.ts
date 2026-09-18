import type { Recipe } from '../types';
import { DISH_IMAGES } from './dishImages';

export const RECIPES: Recipe[] = [
  {
    id: 'batata-bhajiya',
    title: 'Batata Bhajiya',
    gujaratiTitle: 'બટાટા ભજીયા',
    slug: 'batata-bhajiya',
    productId: 'bhajiya',
    productName: 'Bhajiya Instant Mix',
    imageUrl: DISH_IMAGES.bhajiya,
    heroDishColor: '#C90018',
    prepTime: '8 min',
    cookTime: '10 min',
    totalTime: '18 min',
    servings: '3–4',
    difficulty: 'Quick',
    category: 'Monsoon snacks',
    description:
      'Thin potato slices coated in Bhajiya mix batter and deep-fried until golden. Served with kadhi chutney and fried green chilli.',
    ingredients: [
      {
        sectionTitle: 'From the pack',
        items: ['200g Amrat Narsih Bhajiya Instant Mix'],
      },
      {
        sectionTitle: 'From the kitchen',
        items: [
          '160ml cold water',
          '2 medium potatoes, sliced 2mm thin',
          'Oil for deep frying',
          'Pinch of ajwain, if you like extra',
        ],
      },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Whisk 200g mix with 160ml water until the batter coats a spoon and no dry lumps remain.',
        tip: 'Keep the batter thick enough to cling to the slices.',
      },
      {
        stepNumber: 2,
        instruction: 'Pat the potato slices dry. Dip each slice so both sides are coated.',
      },
      {
        stepNumber: 3,
        instruction: 'Fry in medium-hot oil, a few at a time, until the edges go deep gold — about 4 minutes.',
        tip: 'If the oil smokes, the outside browns before the potato cooks.',
      },
      {
        stepNumber: 4,
        instruction: 'Drain on a rack. Serve at once with kadhi chutney and fried green chilli.',
      },
    ],
    chefTips: [
      'Keep sliced potatoes in water until you batter them so they do not brown.',
      'Do not crowd the kadai — steam makes them soggy.',
    ],
    pairing: 'Sweet Gujarati kadhi chutney, fried salted chillies, masala chai',
    tags: ['bhajiya', 'monsoon', 'fried'],
  },
  {
    id: 'guvar-papdi',
    title: 'Guvar Papdi Fritters',
    gujaratiTitle: 'ગુવાર પાપડી',
    slug: 'guvar-papdi-fritters',
    productId: 'guvar-papdi',
    productName: 'Guvar Papdi Mix',
    imageUrl: DISH_IMAGES.bhajiya,
    heroDishColor: '#C90018',
    prepTime: '6 min',
    cookTime: '8 min',
    totalTime: '14 min',
    servings: '2',
    difficulty: 'Quick',
    category: 'Monsoon snacks',
    description:
      'Cluster beans coated in Guvar Papdi mix and fried until crisp. Ready in under 15 minutes.',
    ingredients: [
      {
        sectionTitle: 'From the pack',
        items: ['100g Amrat Narsih Guvar Papdi Mix'],
      },
      {
        sectionTitle: 'From the kitchen',
        items: [
          'About 80ml water',
          '150g tender cluster beans (guvar), strings removed, sliced',
          'Oil for frying',
        ],
      },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Mix 100g Guvar Papdi mix with just enough water to make a coating batter.',
      },
      {
        stepNumber: 2,
        instruction: 'Toss the sliced guvar until every piece is covered. The batter should cling to each piece.',
      },
      {
        stepNumber: 3,
        instruction: 'Fry on medium heat until the shells are crisp and the beans lose their raw bite — 5 to 6 minutes.',
        tip: 'Young beans cook faster. Woody ones need a minute more.',
      },
      {
        stepNumber: 4,
        instruction: 'Serve hot with fried chilli and a spoon of kadhi chutney.',
      },
    ],
    chefTips: [
      'If the beans are thick, slit them once so they cook through.',
      'Salt the beans lightly before coating if they taste grassy.',
    ],
    pairing: 'Fried green chilli and cutting chai',
    tags: ['bhajiya', 'guvar', 'monsoon'],
  },
  {
    id: 'chora-fali-bhajiya',
    title: 'Chora Fali Bhajiya',
    gujaratiTitle: 'ચોરાફળી ભજીયા',
    slug: 'chora-fali-bhajiya',
    productId: 'chora-fali',
    productName: 'Chora Fali Mix',
    imageUrl: DISH_IMAGES.bhajiya,
    heroDishColor: '#C90018',
    prepTime: '8 min',
    cookTime: '10 min',
    totalTime: '18 min',
    servings: '4–6',
    difficulty: 'Easy',
    category: 'Evening snacks',
    description:
      'Yard-long beans coated in Chora Fali mix and fried into crisp sticks. A 500g pack serves four to six.',
    ingredients: [
      {
        sectionTitle: 'From the pack',
        items: ['500g Amrat Narsih Chora Fali Mix (or 200g for a smaller batch)'],
      },
      {
        sectionTitle: 'From the kitchen',
        items: [
          'Water, added gradually',
          'Yard-long beans (chora fali), trimmed into 8–10cm lengths',
          'Oil for deep frying',
        ],
      },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Whisk the mix with water until it coats a bean and drips slowly.',
      },
      {
        stepNumber: 2,
        instruction: 'Dip each stick, shake off extra batter, and slide into medium-hot oil.',
      },
      {
        stepNumber: 3,
        instruction: 'Fry, turning once, until the coating is even gold. Drain on a rack.',
        tip: 'The tips brown first, so lift the sticks out before they darken.',
      },
    ],
    chefTips: [
      'A 200g mix batch is plenty for two people; save the rest of the pack dry.',
      'Serve immediately. These soften if they sit under a lid.',
    ],
    pairing: 'Sweet besan kadhi chutney',
    tags: ['bhajiya', 'chora-fali', 'fried'],
  },
  {
    id: 'dakor-gota',
    title: 'Dakor-Style Gota',
    gujaratiTitle: 'ડાકોર ના ગોટા',
    slug: 'dakor-gota',
    productId: 'gota',
    productName: 'Gota Instant Mix',
    imageUrl: DISH_IMAGES.gota,
    heroDishColor: '#006978',
    prepTime: '12 min',
    cookTime: '12 min',
    totalTime: '24 min',
    servings: '4',
    difficulty: 'Easy',
    category: 'Festive snacks',
    description:
      'Round gota made from the 400g mix, with whole coriander and methi in the batter. Crisp outside, soft inside.',
    ingredients: [
      {
        sectionTitle: 'From the pack',
        items: ['400g Amrat Narsih Gota Instant Mix'],
      },
      {
        sectionTitle: 'From the kitchen',
        items: [
          'About 360ml water',
          '2 tbsp oil, stirred into the batter',
          'Oil for frying',
        ],
      },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Whisk 400g mix with water and 2 tbsp oil. Rest 10 minutes so the gram flour hydrates.',
        tip: 'The batter should be thick enough to scoop.',
      },
      {
        stepNumber: 2,
        instruction: 'Heat oil on medium. Drop round spoonfuls. They should sink, then rise.',
      },
      {
        stepNumber: 3,
        instruction: 'Fry until even gold and cooked through — about 6 minutes. Drain.',
      },
    ],
    chefTips: [
      'If gota crack, the oil is too hot. Lower the flame.',
      'A 200g pack makes a smaller tea-time batch at the same ratio.',
    ],
    pairing: 'Yellow Dakor kadhi chutney',
    tags: ['gota', 'festive', 'fried'],
  },
  {
    id: 'gota-kadhi',
    title: 'Gota with Kadhi Chutney',
    gujaratiTitle: 'ગોટા અને કઢી ચટણી',
    slug: 'gota-with-kadhi-chutney',
    productId: 'gota',
    extraProductIds: ['chatni-kadhi'],
    productName: 'Gota Instant Mix',
    imageUrl: DISH_IMAGES.gota,
    heroDishColor: '#006978',
    prepTime: '15 min',
    cookTime: '18 min',
    totalTime: '33 min',
    servings: '4',
    difficulty: 'Easy',
    category: 'Festive snacks',
    description:
      'Gota served with sweet-tangy kadhi chutney made from the 50g Chutney/Kadhi mix. Both cook within the same half hour.',
    ingredients: [
      {
        sectionTitle: 'Gota',
        items: ['200g Amrat Narsih Gota Instant Mix', 'About 180ml water', '1 tbsp oil in the batter', 'Oil for frying'],
      },
      {
        sectionTitle: 'Kadhi chutney',
        items: ['50g Amrat Narsih Chutney / Kadhi Mix', '250ml water'],
      },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Make gota batter, rest 10 minutes, and fry as in the Dakor recipe until gold.',
      },
      {
        stepNumber: 2,
        instruction: 'Whisk 50g kadhi mix with 250ml water until smooth.',
      },
      {
        stepNumber: 3,
        instruction: 'Simmer on low, stirring, until the chutney turns glossy and slightly thick — about 5 minutes.',
        tip: 'It should be thin enough to coat a spoon.',
      },
      {
        stepNumber: 4,
        instruction: 'Serve hot gota with a bowl of warm kadhi chutney on the side.',
      },
    ],
    chefTips: [
      'Make the chutney while the last batch of gota fries.',
      'The mix is already tangy, so add lemon only if you want more.',
    ],
    pairing: 'Masala chai and fried green chilli',
    tags: ['gota', 'kadhi', 'festive'],
  },
  {
    id: 'dudhi-handwa',
    title: 'Dudhi Handwa',
    gujaratiTitle: 'દૂધી હાંડવો',
    slug: 'dudhi-handwa',
    productId: 'handwa',
    productName: 'Handwa Instant Mix',
    imageUrl: DISH_IMAGES.handwa,
    heroDishColor: '#8E0000',
    prepTime: '10 min',
    cookTime: '25 min',
    totalTime: '35 min',
    servings: '4',
    difficulty: 'Easy',
    category: 'Breakfast',
    description:
      'Lentil and rice handwa with grated bottle gourd and a sesame-mustard vaghar, cooked covered on a tawa until the crust browns.',
    ingredients: [
      {
        sectionTitle: 'From the pack',
        items: ['200g Amrat Narsih Handwa Instant Mix'],
      },
      {
        sectionTitle: 'From the kitchen',
        items: [
          '200ml water',
          '100g sour curd',
          '1 cup grated dudhi (bottle gourd), squeezed of extra water',
          '2 tbsp oil, mustard seeds, sesame, curry leaves for vaghar',
        ],
      },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Mix 200g Handwa mix with water, sour curd, and grated dudhi. The batter should be thick but spreadable.',
      },
      {
        stepNumber: 2,
        instruction: 'Heat 2 tbsp oil. Pop mustard, sesame, and curry leaves.',
      },
      {
        stepNumber: 3,
        instruction: 'Pour batter into a greased non-stick pan. Spoon the vaghar over the top. Cover and cook on low until the crust is brown and a knife comes out clean — about 20 minutes.',
        tip: 'You can bake at 180°C for the same time if you prefer the oven.',
      },
    ],
    chefTips: [
      'Squeeze the dudhi well or the centre stays wet.',
      'A 400g pack doubles the batter for a large family pan.',
    ],
    pairing: 'Coriander-mint chutney and raw peanut oil',
    tags: ['handwa', 'breakfast', 'baked'],
  },
  {
    id: 'moong-dalwada',
    title: 'Moong Dalwada',
    gujaratiTitle: 'મગ દાળવડા',
    slug: 'moong-dalwada',
    productId: 'dalwada',
    productName: 'Dalwada Instant Mix',
    imageUrl: DISH_IMAGES.dalwada,
    heroDishColor: '#7C4A27',
    prepTime: '12 min',
    cookTime: '10 min',
    totalTime: '22 min',
    servings: '3',
    difficulty: 'Easy',
    category: 'Evening snacks',
    description:
      'Moong dal wadas from the 200g mix, fried until the outside is deep amber and the inside stays soft. Served with sliced onion and green chilli.',
    ingredients: [
      {
        sectionTitle: 'From the pack',
        items: ['200g Amrat Narsih Dalwada Instant Mix'],
      },
      {
        sectionTitle: 'From the kitchen',
        items: ['220ml water', 'Oil for frying', 'Sliced onions and green chilli, to serve'],
      },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Stir 200g mix with 220ml water. Rest 10 minutes.',
      },
      {
        stepNumber: 2,
        instruction: 'Whip in one direction for 2 minutes so the batter holds air.',
        tip: 'A drop of batter should float in a cup of water when it is ready.',
      },
      {
        stepNumber: 3,
        instruction: 'Drop lemon-sized portions into medium-high oil. Fry until deep amber, about 5 minutes.',
      },
    ],
    chefTips: [
      'Do not flatten them in the oil; they should stay round.',
      'Serve at once. Dalwada toughens as it cools.',
    ],
    pairing: 'Coriander-mint chutney and ring onions',
    tags: ['dalwada', 'fried', 'tea-time'],
  },
  {
    id: 'gulab-jamun-saffron',
    title: 'Gulab Jamun in Saffron Syrup',
    gujaratiTitle: 'કેસર ગુલાબ જાંબુ',
    slug: 'gulab-jamun-saffron-syrup',
    productId: 'gulab-jamun',
    productName: 'Gulab Jamun Dessert Mix',
    imageUrl: DISH_IMAGES['gulab-jamun'],
    heroDishColor: '#880E4F',
    prepTime: '10 min',
    cookTime: '15 min',
    totalTime: '55 min',
    servings: '20–25 pieces',
    difficulty: 'Easy',
    category: 'Sweets',
    description:
      'Jamuns from the 200g dessert mix, fried on low heat and soaked in cardamom-saffron syrup. Makes 20 to 25 pieces.',
    ingredients: [
      {
        sectionTitle: 'From the pack',
        items: ['200g Amrat Narsih Gulab Jamun Dessert Mix'],
      },
      {
        sectionTitle: 'Syrup',
        items: [
          '250g sugar',
          '250ml water',
          '4–5 saffron strands',
          '3 green cardamom pods, crushed',
          '1 tsp rose water (optional)',
        ],
      },
      {
        sectionTitle: 'To fry',
        items: ['60ml milk or water for the dough', 'Ghee or oil, kept on a low flame'],
      },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Boil sugar and water until the syrup is one-thread. Stir in saffron, cardamom, and rose water. Keep warm, not boiling.',
      },
      {
        stepNumber: 2,
        instruction: 'Knead 200g mix with 60ml milk into a soft dough. Do not press hard. Rest 5 minutes.',
      },
      {
        stepNumber: 3,
        instruction: 'Roll 20–25 crack-free balls. Fry on low heat, turning, until even brown — about 6 minutes.',
        tip: 'High heat browns the outside and leaves a raw centre.',
      },
      {
        stepNumber: 4,
        instruction: 'Slide hot jamuns into warm syrup. Soak at least 30 minutes before serving.',
      },
    ],
    chefTips: [
      'If a ball cracks while rolling, wet your palms and roll again.',
      'Garnish with pistachio slivers.',
    ],
    pairing: 'Warm, with a spoon of the syrup',
    tags: ['sweet', 'festive', 'gulab-jamun'],
  },
  {
    id: 'street-khichu',
    title: 'Street-Style Khichu',
    gujaratiTitle: 'સ્ટ્રીટ ખીચુ',
    slug: 'street-style-khichu',
    productId: 'khichu',
    productName: 'Khichu Instant Mix',
    imageUrl: DISH_IMAGES.khichu,
    heroDishColor: '#EF6C00',
    prepTime: '3 min',
    cookTime: '8 min',
    totalTime: '11 min',
    servings: '2',
    difficulty: 'Quick',
    category: 'Breakfast',
    description:
      'Rice-flour khichu from the 140g mix, steamed until translucent and finished with cold-pressed peanut oil.',
    ingredients: [
      {
        sectionTitle: 'From the pack',
        items: ['140g Amrat Narsih Khichu Instant Mix'],
      },
      {
        sectionTitle: 'From the kitchen',
        items: [
          'About 350ml water',
          '1 tsp oil in the water',
          'Cold-pressed peanut oil, to finish',
        ],
      },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Boil the water with 1 tsp oil.',
      },
      {
        stepNumber: 2,
        instruction: 'Lower the heat. Rain in 140g mix, stirring with a wooden spoon so it does not lump.',
      },
      {
        stepNumber: 3,
        instruction: 'Cover and steam 4 minutes on low until the dough looks translucent and shiny.',
        tip: 'If it looks dry, splash a tablespoon of hot water and stir.',
      },
      {
        stepNumber: 4,
        instruction: 'Spoon into a bowl. Pour peanut oil over the top.',
      },
    ],
    chefTips: [
      'A 50g pack is a single serve — use about 125ml water.',
      'Serve immediately. Khichu skins over as it cools.',
    ],
    pairing: 'Raw peanut oil; green chilli on the side',
    tags: ['khichu', 'breakfast', 'steamed'],
  },
  {
    id: 'khichu-methi',
    title: 'Khichu with Methi Masala',
    gujaratiTitle: 'મેથી મસાલા ખીચુ',
    slug: 'khichu-methi-masala',
    productId: 'khichu',
    productName: 'Khichu Instant Mix',
    imageUrl: DISH_IMAGES.khichu,
    heroDishColor: '#EF6C00',
    prepTime: '3 min',
    cookTime: '8 min',
    totalTime: '11 min',
    servings: '2',
    difficulty: 'Quick',
    category: 'Breakfast',
    description:
      'Steamed khichu topped with peanut oil and methi sambharo, folded through just before serving.',
    ingredients: [
      {
        sectionTitle: 'From the pack',
        items: ['140g Amrat Narsih Khichu Instant Mix'],
      },
      {
        sectionTitle: 'Finish',
        items: [
          'About 350ml water and 1 tsp oil, for cooking',
          '2 tbsp peanut or sesame oil',
          '1–2 tsp methi sambharo / pickle masala',
          'Chopped coriander (optional)',
        ],
      },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Cook the khichu exactly as in the street-style recipe until glossy.',
      },
      {
        stepNumber: 2,
        instruction: 'Turn into a serving bowl while hot.',
      },
      {
        stepNumber: 3,
        instruction: 'Pour oil over the centre, then dust methi masala and coriander. Fold once so every spoonful gets oil and spice.',
        tip: 'Add masala at the table. Cooking it in the pan turns it bitter.',
      },
    ],
    chefTips: [
      'Add the methi masala a little at a time; it is salty.',
      'Serve whole green chillies on the side.',
    ],
    pairing: 'Peanut oil and methi sambharo',
    tags: ['khichu', 'methi', 'monsoon'],
  },
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((recipe) => recipe.slug === slug);
}

export function getRelatedRecipes(recipe: Recipe, limit = 3): Recipe[] {
  const same = RECIPES.filter(
    (item) => item.id !== recipe.id && (item.productId === recipe.productId || item.category === recipe.category),
  );
  const rest = RECIPES.filter((item) => item.id !== recipe.id && !same.includes(item));
  return [...same, ...rest].slice(0, limit);
}
