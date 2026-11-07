export const initialState = {
  cart: [],
  favorites: [],
}

export function cartReducer(state, action) {
  switch (action.type) {
    // Add product to cart
    case 'ADD': {
      const existing = state.cart.find(
        (item) => Number(item.id) === Number(action.id)
      )

      const qty = Number(action.qty) || 1

      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            Number(item.id) === Number(action.id)
              ? {
                ...item,
                qty: item.qty + qty,
              }
              : item
          ),
        }
      }

      return {
        ...state,
        cart: [
          ...state.cart,
          {
            id: action.id,
            qty,
          },
        ],
      }
    }

    // Change product quantity
    case 'SET_QTY': {
      return {
        ...state,
        cart: state.cart.map((item) =>
          Number(item.id) === Number(action.id)
            ? {
              ...item,
              qty: Math.max(1, Number(action.qty) || 1),
            }
            : item
        ),
      }
    }

    // Remove product from cart
    case 'REMOVE': {
      return {
        ...state,
        cart: state.cart.filter(
          (item) => Number(item.id) !== Number(action.id)
        ),
      }
    }

    // Clear cart
    case 'CLEAR': {
      return {
        ...state,
        cart: [],
      }
    }

    // Toggle favorite
    case 'TOGGLE_FAVORITE': {
      const isFavorite = state.favorites.includes(action.id)

      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter((id) => id !== action.id)
          : [...state.favorites, action.id],
      }
    }

    // Set favorites from backend
    case 'SET_FAVORITES': {
      return {
        ...state,
        favorites: action.ids,
      }
    }

    default:
      return state
  }
}

// Pizza images
import pizzaImage from '../assets/images/pitsa.png'
import Pepperoni from '../assets/images/pitsa.pepperoni.png'
import CheddarDonar from '../assets/images/cheddar.donar.png'
import GoshtliMiks from '../assets/images/goshtlimiks.png'
import Pishloqli from '../assets/images/pishloqli.png'
import MrPep from '../assets/images/mrpep.png'
import Frimen from '../assets/images/frimen.png'
import Tortfasl from '../assets/images/tortfasl.png'
import AlFredo from '../assets/images/alfredo.png'
import PishloqliJoja from '../assets/images/pishloqlijoja.png'
import DablPepperoni from '../assets/images/dabl.png'
import RunchPizza from '../assets/images/ranch.png'

// Fast food images
import HotDog from '../assets/images/hotdog.png'
import Shawarma from '../assets/images/Shawarma.png'
import Hamburger from '../assets/images/hamburger.png'
import TovuqliShawarma from '../assets/images/shawarmaa.png'
import PishloqliHotDog from '../assets/images/pishloqli.hot.dog.png'
import ShoxonaHotDog from '../assets/images/shoxona.png'
import Lavash from '../assets/images/lavash.png'
import TandirLavash from '../assets/images/tandir-lavash.png'
import MiniLavash from '../assets/images/mini-lavash.png'
import KattaLavash from '../assets/images/katta-lavash.png'
import tandirLavash from '../assets/images/tandir-lavashh.png'
import KattaPishloqliLavash from '../assets/images/katta-pishloqli.png'

// KFC & sandwich images
import Kfc from '../assets/images/kfc.png'
import Sandwich from '../assets/images/sandwich.png'

// Dessert images
import Dessert from '../assets/images/desert.png'
import Sinnamonchalar from '../assets/images/sinnamonchalar.png'
import SinnamonchalarEight from '../assets/images/sinnamonchalar.eight.png'
import SinnamonchalarTwo from '../assets/images/sinnamonchalar.two.png'
import Chizkeyk from '../assets/images/chizkeyk.png'
import Fondan from '../assets/images/fondan.png'
import Donat from '../assets/images/donat.png'
import Findiqli from '../assets/images/findiqli.png'
import Strawberry from '../assets/images/strawberry.png'

// Drink images
import Drinks from '../assets/images/drinks.png'
import Cola from '../assets/images/cola.png'
import ColaZero from '../assets/images/cola.zero.png'
import Fanta from '../assets/images/fanta.png'
import Sprite from '../assets/images/sprite.png'
import Pepsi from '../assets/images/pepsi.png'
import PepsiZero from '../assets/images/pepsi.zero.png'
import up from '../assets/images/7up.png'
import Mirinda from '../assets/images/mirinda.png'
import MountainDew from '../assets/images/mountain.dew.png'
import DrPepper from '../assets/images/drpepper.png'
import RedBul from '../assets/images/redbul.png'
import Monster from '../assets/images/monster.png'
import Hell from '../assets/images/hell.png'
import Flash from '../assets/images/flash.png'
import Gorilla from '../assets/images/gorilla.png'
import Adrinalin from '../assets/images/adrinalin.png'
import AysTea from '../assets/images/ays.png'
import Moxito from '../assets/images/moxito.png'
import Rootiz from '../assets/images/rootiz.png'
import Chortoq from '../assets/images/chortoq.png'
import Cappy from '../assets/images/cappy.png'
import Montella from '../assets/images/montella.png'
import Hydrolife from '../assets/images/hydrolife.png'
import FuseTea from '../assets/images/fuse.tea.png'
import LalAnar from '../assets/images/lal.anar.png'
import Micco from '../assets/images/micco.png'
import Flavis from '../assets/images/flavis.png'
import Chernagalovka from '../assets/images/chernagalovka.png'
import OnsakkizPlus from '../assets/images/onsakkizplus.png'
import Lipton from '../assets/images/lipton.png'

// Snack images
import KichkinaFri from '../assets/images/kichkina-fri.png'
import OrtaFri from '../assets/images/ortafri.png'
import KattaFri from '../assets/images/kattafri.png'
import Kartoshka from '../assets/images/kartoshka.png'
import FriGigant from '../assets/images/frigigant.png'
import JojaBooks from '../assets/images/jojabooks.png'
import Naggets from '../assets/images/naggets.png'
import NaggetsEight from '../assets/images/naggetss.png'
import Naggetts from '../assets/images/naggettss.png'
import NaggetsBooks from '../assets/images/naggets-books.png'
import Non from '../assets/images/non.png'

// Categories
export const categories = [
  { slug: 'all', label: 'All' },
  { slug: 'pizza', label: 'Pizza' },
  { slug: 'fast-food', label: 'Fast Food' },
  { slug: 'desserts', label: 'Desserts' },
  { slug: 'drinks', label: 'Drinks' },
  { slug: 'snacks', label: 'Snacks' },
]

export function getCategorySlug(category) {
  const name = String(category?.name || category || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

  if (name.includes('pizza') || name.includes('pitsa')) return 'pizza'
  if (name.includes('dessert') || name.includes('desert') || name.includes('shirin')) {
    return 'desserts'
  }
  if (
    name.includes('drink') ||
    name.includes('ichimlik')
  ) {
    return 'drinks'
  }
  if (
    name.includes('snack') ||
    name.includes('snek') ||
    name.includes('gazak')
  ) {
    return 'snacks'
  }
  if (
    name.includes('fast food') ||
    name.includes('burger') ||
    name.includes('hot dog')
  ) {
    return 'fast-food'
  }

  return null
}

// Drinks: prices in UZS
const drinkNames = [
  // Carbonated drinks
  ['Coca-Cola', 'Carbonated cola drink', 10000, Cola],
  ['Coca-Cola Zero', 'Sugar-free cola drink', 10000, ColaZero],
  ['Fanta Orange', 'Orange flavored carbonated drink', 10000, Fanta],
  ['Sprite', 'Lemon and lime flavored drink', 10000, Sprite],
  ['Pepsi', 'Carbonated cola drink', 10000, Pepsi],
  ['Pepsi Zero Sugar', 'Sugar-free cola drink', 10000, PepsiZero],
  ['7UP', 'Lemon and lime flavored drink', 10000, up],
  ['Mirinda', 'Orange flavored drink', 10000, Mirinda],
  ['Mountain Dew', 'Citrus flavored drink', 12000, MountainDew],
  ['Dr Pepper', 'Carbonated drink', 16000, DrPepper],

  // Energy drinks
  ['Red Bull', 'Energy drink', 18000, RedBul],
  ['Monster Energy', 'Energy drink', 22000, Monster],
  ['HELL Energy', 'Energy drink', 14000, Hell],
  ['Flash Energy', 'Energy drink', 10000, Flash],
  ['Gorilla Energy', 'Energy drink', 12000, Gorilla],
  ['Adrenaline Rush', 'Energy drink', 16000, Adrinalin],
  ['18+ Energy', 'Energy drink', 12000, OnsakkizPlus],

  // Tea, water & fruit drinks
  ['Ice Tea', 'Iced tea', 12000, AysTea],
  ['Mojito', 'Mint and lime flavored drink', 15000, Moxito],
  ['Rootiz', 'Fruit drink', 15000, Rootiz],
  ['Chortoq', 'Mineral water', 8000, Chortoq],
  ['Cappy', 'Fruit juice', 14000, Cappy],
  ['Montella', 'Drinking water', 7000, Montella],
  ['Hydrolife', 'Drinking water', 7000, Hydrolife],
  ['Fuse Tea Lemon', 'Lemon iced tea', 12000, FuseTea],
  ['Lal Anar', 'Fruit drink', 15000, LalAnar],
  ['Micco', 'Fruit drink', 12000, Micco],
  ['Flavis', 'Fruit drink', 12000, Flavis],
  ['Chernogolovka', 'Carbonated drink', 16000, Chernagalovka],
  ['Lipton', 'Iced tea', 12000, Lipton],
]

// All products
const productList = [
  // PIZZAS
  {
    name: 'Texas Grill Pizza',
    desc: 'Kebab meat, pickled cucumbers, red onions, tomatoes, and BBQ sauce.',
    price: 85000,
    category: 'pizza',
    image: pizzaImage,
  },
  {
    name: 'Pepperoni Pizza',
    desc: 'Pepperoni, mozzarella cheese, and tomato sauce.',
    price: 75000,
    category: 'pizza',
    image: Pepperoni,
  },
  {
    name: 'Cheddar Doner Pizza',
    desc: 'Doner meat, cheddar sauce, bell peppers, and red onions.',
    price: 80000,
    category: 'pizza',
    image: CheddarDonar,
  },
  {
    name: 'Meat Mix Pizza',
    desc: 'A mix of doner, kebab, cheeseburger, and pepperoni flavors.',
    price: 95000,
    category: 'pizza',
    image: GoshtliMiks,
  },
  {
    name: 'Cheese Pizza',
    desc: 'Mozzarella cheese and alfredo sauce.',
    price: 65000,
    category: 'pizza',
    image: Pishloqli,
  },
  {
    name: 'Mr. Pep',
    desc: 'Pepperoni and mozzarella cheese.',
    price: 75000,
    category: 'pizza',
    image: MrPep,
  },
  {
    name: 'Freeman Pizza',
    desc: 'French fries, sausage, tomato sauce, and mozzarella.',
    price: 70000,
    category: 'pizza',
    image: Frimen,
  },
  {
    name: 'Four Seasons Pizza',
    desc: 'Four different pizza flavors in one.',
    price: 95000,
    category: 'pizza',
    image: Tortfasl,
  },
  {
    name: 'Alfredo Pizza',
    desc: 'Chicken, mushrooms, and alfredo sauce.',
    price: 75000,
    category: 'pizza',
    image: AlFredo,
  },
  {
    name: 'Cheesy Chicken Pizza',
    desc: 'Chicken, tomatoes, and special cheese sauce.',
    price: 70000,
    category: 'pizza',
    image: PishloqliJoja,
  },
  {
    name: 'Double Pepperoni Pizza',
    desc: 'Extra pepperoni and mozzarella cheese.',
    price: 90000,
    category: 'pizza',
    image: DablPepperoni,
  },
  {
    name: 'Ranch Chicken Pizza',
    desc: 'Chicken, tomatoes, and ranch sauce.',
    price: 75000,
    category: 'pizza',
    image: RunchPizza,
  },

  // FAST FOOD
  {
    name: 'Hot Dog',
    desc: 'Classic hot dog with sausage.',
    price: 18000,
    category: 'fast-food',
    image: HotDog,
  },
  {
    name: 'Cheese Hot Dog',
    desc: 'Hot dog with cheese and sausage.',
    price: 22000,
    category: 'fast-food',
    image: PishloqliHotDog,
  },
  {
    name: 'Royal Hot Dog',
    desc: 'Hot dog with special ingredients.',
    price: 28000,
    category: 'fast-food',
    image: ShoxonaHotDog,
  },
  {
    name: 'Shawarma',
    desc: 'Meat shawarma.',
    price: 30000,
    category: 'fast-food',
    image: Shawarma,
  },
  {
    name: 'Chicken Shawarma',
    desc: 'Chicken shawarma.',
    price: 28000,
    category: 'fast-food',
    image: TovuqliShawarma,
  },
  {
    name: 'Cheesy Mini Lavash',
    desc: 'Mini lavash wrap with cheese.',
    price: 25000,
    category: 'fast-food',
    image: Lavash,
  },
  {
    name: 'Tandir Cheese Lavash',
    desc: 'Cheese lavash baked in a traditional clay oven.',
    price: 35000,
    category: 'fast-food',
    image: TandirLavash,
  },
  {
    name: 'Mini Lavash',
    desc: 'Mini sized lavash wrap.',
    price: 22000,
    category: 'fast-food',
    image: MiniLavash,
  },
  {
    name: 'Large Lavash',
    desc: 'Large sized lavash wrap.',
    price: 30000,
    category: 'fast-food',
    image: KattaLavash,
  },
  {
    name: 'Tandir Lavash',
    desc: 'Lavash wrap baked in a traditional clay oven.',
    price: 32000,
    category: 'fast-food',
    image: tandirLavash,
  },
  {
    name: 'Large Cheese Lavash',
    desc: 'Large sized lavash wrap with cheese.',
    price: 38000,
    category: 'fast-food',
    image: KattaPishloqliLavash,
  },
  {
    name: 'Hamburger',
    desc: 'Burger with vegetables, cheese, and lettuce.',
    price: 28000,
    category: 'fast-food',
    image: Hamburger,
  },
  {
    name: 'Sandwich',
    desc: 'Meat sandwich.',
    price: 22000,
    category: 'fast-food',
    image: Sandwich,
  },
  {
    name: 'Crispy Chicken (KFC Style)',
    desc: 'Crispy fried chicken pieces.',
    price: 30000,
    category: 'fast-food',
    image: Kfc,
  },

  // DESSERTS
  {
    name: 'Assorted Desserts',
    desc: 'Chocolate and fruit desserts.',
    price: 25000,
    category: 'desserts',
    image: Dessert,
  },
  {
    name: 'Cinnamon Rolls (4 pcs) 👶',
    desc: '4 pieces of cinnamon rolls.',
    price: 18000,
    category: 'desserts',
    image: Sinnamonchalar,
  },
  {
    name: 'Cinnamon Rolls (8 pcs) 👶',
    desc: '8 pieces of cinnamon rolls.',
    price: 30000,
    category: 'desserts',
    image: SinnamonchalarEight,
  },
  {
    name: 'Cinnamon Rolls (16 pcs) 👶',
    desc: '16 pieces of cinnamon rolls.',
    price: 45000,
    category: 'desserts',
    image: SinnamonchalarTwo,
  },
  {
    name: 'Chocolate Cheesecake',
    desc: 'Rich chocolate cheesecake.',
    price: 30000,
    category: 'desserts',
    image: Chizkeyk,
  },
  {
    name: 'Chocolate Fondant',
    desc: 'Warm chocolate lava cake.',
    price: 25000,
    category: 'desserts',
    image: Fondan,
  },
  {
    name: 'Berry Donut',
    desc: 'Donut with berry glaze.',
    price: 12000,
    category: 'desserts',
    image: Donat,
  },
  {
    name: 'Hazelnut Donut',
    desc: 'Donut with hazelnut and chocolate.',
    price: 14000,
    category: 'desserts',
    image: Findiqli,
  },
  {
    name: 'Strawberry Donut',
    desc: 'Strawberry glazed donut.',
    price: 12000,
    category: 'desserts',
    image: Strawberry,
  },

  // SNACKS
  {
    name: 'Small French Fries',
    desc: 'Small portion of French fries.',
    price: 10000,
    category: 'snacks',
    image: KichkinaFri,
  },
  {
    name: 'Medium French Fries',
    desc: 'Medium portion of French fries.',
    price: 16000,
    category: 'snacks',
    image: OrtaFri,
  },
  {
    name: 'Large French Fries',
    desc: 'Large portion of French fries.',
    price: 30000,
    category: 'snacks',
    image: KattaFri,
  },
  {
    name: 'Country Wedges',
    desc: 'Rustic style potato wedges.',
    price: 18000,
    category: 'snacks',
    image: Kartoshka,
  },
  {
    name: 'Giant French Fries',
    desc: 'Extra large portion of French fries.',
    price: 35000,
    category: 'snacks',
    image: FriGigant,
  },
  {
    name: 'Chicken Bites',
    desc: 'Crispy chicken bites snack.',
    price: 25000,
    category: 'snacks',
    image: JojaBooks,
  },
  {
    name: 'Chicken Nuggets (5 pcs)',
    desc: '5 pieces of chicken nuggets.',
    price: 15000,
    category: 'snacks',
    image: Naggets,
  },
  {
    name: 'Chicken Nuggets (8 pcs)',
    desc: '8 pieces of chicken nuggets.',
    price: 22000,
    category: 'snacks',
    image: NaggetsEight,
  },
  {
    name: 'Chicken Nuggets (15 pcs)',
    desc: '15 pieces of chicken nuggets.',
    price: 35000,
    category: 'snacks',
    image: Naggetts,
  },
  {
    name: 'Nuggets Box',
    desc: 'Special box of chicken nuggets.',
    price: 28000,
    category: 'snacks',
    image: NaggetsBooks,
  },
  {
    name: 'Bread',
    desc: 'Fresh bread.',
    price: 3000,
    category: 'snacks',
    image: Non,
  },

  // DRINKS
  ...drinkNames.map(([name, desc, price, image]) => ({
    name,
    desc,
    price,
    category: 'drinks',
    image: image || Drinks,
  })),
]

// Generate product IDs
export const products = productList.map((product, index) => ({
  id: index + 1,
  ...product,
}))