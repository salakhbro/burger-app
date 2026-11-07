const canonicalCategories = [
    { name: "Pizza", description: "Freshly baked pizzas" },
    { name: "Fast Food", description: "Burgers, hot dogs, lavash and more" },
    { name: "Desserts", description: "Sweet cakes, donuts and cinnamon rolls" },
    { name: "Drinks", description: "Refreshing drinks and juices" },
    { name: "Snacks", description: "Crispy fries and chicken nuggets" },
];

const normalizeCategoryName = (name) =>
    String(name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

function getCanonicalCategory(name) {
    const normalized = normalizeCategoryName(name);

    if (normalized.includes("pizza") || normalized.includes("pitsa")) {
        return "Pizza";
    }
    if (
        normalized.includes("dessert") ||
        normalized.includes("desert") ||
        normalized.includes("shirin")
    ) {
        return "Desserts";
    }
    if (
        normalized.includes("drink") ||
        normalized.includes("cola") ||
        normalized.includes("ichimlik")
    ) {
        return "Drinks";
    }
    if (
        normalized.includes("snack") ||
        normalized.includes("snek") ||
        normalized.includes("gazak")
    ) {
        return "Snacks";
    }
    if (
        normalized.includes("fast food") ||
        normalized.includes("lavash") ||
        normalized.includes("burger") ||
        normalized.includes("hot dog")
    ) {
        return "Fast Food";
    }

    return null;
}

module.exports = {
    canonicalCategories,
    getCanonicalCategory,
    normalizeCategoryName,
};
