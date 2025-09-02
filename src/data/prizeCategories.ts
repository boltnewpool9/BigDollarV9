import { PrizeCategory } from '../types';

export const prizeCategories: PrizeCategory[] = [
  {
    id: 'refrigerator',
    name: '1st Prize - Refrigerator',
    description: 'Premium Double Door Refrigerator',
    winnerCount: 1,
    image: '/src/img/fridge.jpg',
    gradient: 'from-blue-500 to-cyan-500',
    icon: '❄️'
  },
  {
    id: 'tablets',
    name: '2nd Prize - Samsung Tablets',
    description: 'Latest Samsung Galaxy Tablets',
    winnerCount: 2,
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
    gradient: 'from-purple-500 to-pink-500',
    icon: '📱'
  },
  {
    id: 'washing-machine',
    name: '3rd Prize - Washing Machine',
    description: 'Fully Automatic Washing Machine',
    winnerCount: 2,
    image: '/src/img/wm.jpg',
    gradient: 'from-green-500 to-teal-500',
    icon: '🧺'
  },
  {
    id: 'soundbars',
    name: '4th Prize - BOAT Sound Bars',
    description: 'Premium BOAT Sound Bar System',
    winnerCount: 8,
    image: '/src/img/boat.jpg',
    gradient: 'from-orange-500 to-red-500',
    icon: '🔊'
  },
  {
    id: 'iron-box',
    name: '5th Prize - Iron Box',
    description: 'Steam Iron with Advanced Features',
    winnerCount: 15,
    image: '/src/img/iron.jpg',
    gradient: 'from-yellow-500 to-orange-500',
    icon: '👔'
  }
];