const categories = [
  { id: 1, name: 'Pizza', description: 'Freshly baked pizzas' },
  { id: 2, name: 'Fast Food', description: 'Burgers, hot dogs, lavash and more' },
  { id: 3, name: 'Desserts', description: 'Sweet cakes, donuts and cinnamon rolls' },
  { id: 4, name: 'Drinks', description: 'Refreshing drinks and juices' },
  { id: 5, name: 'Snacks', description: 'Crispy fries and chicken nuggets' },
];

const categoryMap = {
  pizza: 1,
  'fast-food': 2,
  desserts: 3,
  drinks: 4,
  snacks: 5,
};

const rawProducts = [
  // Pizzas
  { name: 'Texas Grill Pizza', desc: 'Kebab meat, pickled cucumbers, red onions, tomatoes, and BBQ sauce.', price: 85000, category: 'pizza' },
  { name: 'Pepperoni Pizza', desc: 'Pepperoni, mozzarella cheese, and tomato sauce.', price: 75000, category: 'pizza' },
  { name: 'Cheddar Doner Pizza', desc: 'Doner meat, cheddar sauce, bell peppers, and red onions.', price: 80000, category: 'pizza' },
  { name: 'Meat Mix Pizza', desc: 'A mix of doner, kebab, cheeseburger, and pepperoni flavors.', price: 95000, category: 'pizza' },
  { name: 'Cheese Pizza', desc: 'Mozzarella cheese and alfredo sauce.', price: 65000, category: 'pizza' },
  { name: 'Mr. Pep', desc: 'Pepperoni and mozzarella cheese.', price: 75000, category: 'pizza' },
  { name: 'Freeman Pizza', desc: 'French fries, sausage, tomato sauce, and mozzarella.', price: 70000, category: 'pizza' },
  { name: 'Four Seasons Pizza', desc: 'Four different pizza flavors in one.', price: 95000, category: 'pizza' },
  { name: 'Alfredo Pizza', desc: 'Chicken, mushrooms, and alfredo sauce.', price: 75000, category: 'pizza' },
  { name: 'Cheesy Chicken Pizza', desc: 'Chicken, tomatoes, and special cheese sauce.', price: 70000, category: 'pizza' },
  { name: 'Double Pepperoni Pizza', desc: 'Extra pepperoni and mozzarella cheese.', price: 90000, category: 'pizza' },
  { name: 'Ranch Chicken Pizza', desc: 'Chicken, tomatoes, and ranch sauce.', price: 75000, category: 'pizza' },

  // Fast Food
  { name: 'Hot Dog', desc: 'Classic hot dog with sausage.', price: 18000, category: 'fast-food' },
  { name: 'Cheese Hot Dog', desc: 'Hot dog with cheese and sausage.', price: 22000, category: 'fast-food' },
  { name: 'Royal Hot Dog', desc: 'Hot dog with special ingredients.', price: 28000, category: 'fast-food' },
  { name: 'Shawarma', desc: 'Meat shawarma.', price: 30000, category: 'fast-food' },
  { name: 'Chicken Shawarma', desc: 'Chicken shawarma.', price: 28000, category: 'fast-food' },
  { name: 'Cheesy Mini Lavash', desc: 'Mini lavash wrap with cheese.', price: 25000, category: 'fast-food' },
  { name: 'Tandir Cheese Lavash', desc: 'Cheese lavash baked in a traditional clay oven.', price: 35000, category: 'fast-food' },
  { name: 'Mini Lavash', desc: 'Mini sized lavash wrap.', price: 22000, category: 'fast-food' },
  { name: 'Large Lavash', desc: 'Large sized lavash wrap.', price: 30000, category: 'fast-food' },
  { name: 'Tandir Lavash', desc: 'Lavash wrap baked in a traditional clay oven.', price: 32000, category: 'fast-food' },
  { name: 'Large Cheese Lavash', desc: 'Large sized lavash wrap with cheese.', price: 38000, category: 'fast-food' },
  { name: 'Hamburger', desc: 'Burger with vegetables, cheese, and lettuce.', price: 28000, category: 'fast-food' },
  { name: 'Sandwich', desc: 'Meat sandwich.', price: 22000, category: 'fast-food' },
  { name: 'Crispy Chicken (KFC Style)', desc: 'Crispy fried chicken pieces.', price: 30000, category: 'fast-food' },

  // Desserts
  { name: 'Assorted Desserts', desc: 'Chocolate and fruit desserts.', price: 25000, category: 'desserts' },
  { name: 'Cinnamon Rolls (4 pcs) 👶', desc: '4 pieces of cinnamon rolls.', price: 18000, category: 'desserts' },
  { name: 'Cinnamon Rolls (8 pcs) 👶', desc: '8 pieces of cinnamon rolls.', price: 30000, category: 'desserts' },
  { name: 'Cinnamon Rolls (16 pcs) 👶', desc: '16 pieces of cinnamon rolls.', price: 45000, category: 'desserts' },
  { name: 'Chocolate Cheesecake', desc: 'Rich chocolate cheesecake.', price: 30000, category: 'desserts' },
  { name: 'Chocolate Fondant', desc: 'Warm chocolate lava cake.', price: 25000, category: 'desserts' },
  { name: 'Berry Donut', desc: 'Donut with berry glaze.', price: 12000, category: 'desserts' },
  { name: 'Hazelnut Donut', desc: 'Donut with hazelnut and chocolate.', price: 14000, category: 'desserts' },
  { name: 'Strawberry Donut', desc: 'Strawberry glazed donut.', price: 12000, category: 'desserts' },

  // Snacks
  { name: 'Small French Fries', desc: 'Small portion of French fries.', price: 10000, category: 'snacks' },
  { name: 'Medium French Fries', desc: 'Medium portion of French fries.', price: 16000, category: 'snacks' },
  { name: 'Large French Fries', desc: 'Large portion of French fries.', price: 30000, category: 'snacks' },
  { name: 'Country Wedges', desc: 'Rustic style potato wedges.', price: 18000, category: 'snacks' },
  { name: 'Giant French Fries', desc: 'Extra large portion of French fries.', price: 35000, category: 'snacks' },
  { name: 'Chicken Bites', desc: 'Crispy chicken bites snack.', price: 25000, category: 'snacks' },
  { name: 'Chicken Nuggets (5 pcs)', desc: '5 pieces of chicken nuggets.', price: 15000, category: 'snacks' },
  { name: 'Chicken Nuggets (8 pcs)', desc: '8 pieces of chicken nuggets.', price: 22000, category: 'snacks' },
  { name: 'Chicken Nuggets (15 pcs)', desc: '15 pieces of chicken nuggets.', price: 35000, category: 'snacks' },
  { name: 'Nuggets Box', desc: 'Special box of chicken nuggets.', price: 28000, category: 'snacks' },
  { name: 'Bread', desc: 'Fresh bread.', price: 3000, category: 'snacks' },

  // Drinks
  { name: 'Coca-Cola', desc: 'Carbonated cola drink', price: 10000, category: 'drinks' },
  { name: 'Coca-Cola Zero', desc: 'Sugar-free cola drink', price: 10000, category: 'drinks' },
  { name: 'Fanta Orange', desc: 'Orange flavored carbonated drink', price: 10000, category: 'drinks' },
  { name: 'Sprite', desc: 'Lemon and lime flavored drink', price: 10000, category: 'drinks' },
  { name: 'Pepsi', desc: 'Carbonated cola drink', price: 10000, category: 'drinks' },
  { name: 'Pepsi Zero Sugar', desc: 'Sugar-free cola drink', price: 10000, category: 'drinks' },
  { name: '7UP', desc: 'Lemon and lime flavored drink', price: 10000, category: 'drinks' },
  { name: 'Mirinda', desc: 'Orange flavored drink', price: 10000, category: 'drinks' },
  { name: 'Mountain Dew', desc: 'Citrus flavored drink', price: 12000, category: 'drinks' },
  { name: 'Dr Pepper', desc: 'Carbonated drink', price: 16000, category: 'drinks' },
  { name: 'Red Bull', desc: 'Energy drink', price: 18000, category: 'drinks' },
  { name: 'Monster Energy', desc: 'Energy drink', price: 22000, category: 'drinks' },
  { name: 'HELL Energy', desc: 'Energy drink', price: 14000, category: 'drinks' },
  { name: 'Flash Energy', desc: 'Energy drink', price: 10000, category: 'drinks' },
  { name: 'Gorilla Energy', desc: 'Energy drink', price: 12000, category: 'drinks' },
  { name: 'Adrenaline Rush', desc: 'Energy drink', price: 16000, category: 'drinks' },
  { name: '18+ Energy', desc: 'Energy drink', price: 12000, category: 'drinks' },
  { name: 'Ice Tea', desc: 'Iced tea', price: 12000, category: 'drinks' },
  { name: 'Mojito', desc: 'Mint and lime flavored drink', price: 15000, category: 'drinks' },
  { name: 'Rootiz', desc: 'Fruit drink', price: 15000, category: 'drinks' },
  { name: 'Chortoq', desc: 'Mineral water', price: 8000, category: 'drinks' },
  { name: 'Cappy', desc: 'Fruit juice', price: 14000, category: 'drinks' },
  { name: 'Montella', desc: 'Drinking water', price: 7000, category: 'drinks' },
  { name: 'Hydrolife', desc: 'Drinking water', price: 7000, category: 'drinks' },
  { name: 'Fuse Tea Lemon', desc: 'Lemon iced tea', price: 12000, category: 'drinks' },
  { name: 'Lal Anar', desc: 'Fruit drink', price: 15000, category: 'drinks' },
  { name: 'Micco', desc: 'Fruit drink', price: 12000, category: 'drinks' },
  { name: 'Flavis', desc: 'Fruit drink', price: 12000, category: 'drinks' },
  { name: 'Chernogolovka', desc: 'Carbonated drink', price: 16000, category: 'drinks' },
  { name: 'Lipton', desc: 'Iced tea', price: 12000, category: 'drinks' },
];

const products = rawProducts.map((p, index) => ({
  id: index + 1,
  name: p.name,
  description: p.desc,
  price: p.price,
  category_id: categoryMap[p.category] || 1,
  category_slug: p.category,
  image: '',
  stock: 100,
}));

module.exports = {
  categories,
  products,
};
