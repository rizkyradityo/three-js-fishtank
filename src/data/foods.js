export const FOODS = [
    {
        id: 1,
        name: 'Pelet Dasar',
        hungerRelief: 20,
        moodBonus: 5,
        cost: 0,
        color: 0x8B4513,
        size: 0.08,
        description: 'Makanan standar untuk ikan'
    },
    {
        id: 2,
        name: 'Udang Kecil',
        hungerRelief: 35,
        moodBonus: 10,
        cost: 5,
        color: 0xFF6B6B,
        size: 0.1,
        description: 'Favorit ikan predator'
    },
    {
        id: 3,
        name: 'Cacing Sutra',
        hungerRelief: 30,
        moodBonus: 8,
        cost: 3,
        color: 0xCD853F,
        size: 0.12,
        description: 'Kaya protein untuk ikan'
    },
    {
        id: 4,
        name: 'Alga Premium',
        hungerRelief: 15,
        moodBonus: 15,
        cost: 8,
        color: 0x228B22,
        size: 0.09,
        description: 'Makanan sehat untuk ikan herbivora'
    },
    {
        id: 5,
        name: 'Jelly Emas',
        hungerRelief: 50,
        moodBonus: 25,
        cost: 15,
        color: 0xFFD700,
        size: 0.14,
        description: 'Makanan langka yang sangat bergizi'
    }
];

export function getFoodById(id) {
    return FOODS.find(f => f.id === id);
}
