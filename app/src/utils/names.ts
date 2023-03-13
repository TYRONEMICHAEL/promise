import { PublicKey } from '@solana/web3.js'

const matchNames = [
  'Stunningplay',
  'Two Times Stunning',
  "The Delightful Footballers's Club",
  'Head Fighters',
  'McHead',
  'Tortoisesica',
  'Iron Filings and a Head',
  'King Yellow',
  'One Girl, Two Iron Filings',
  'The Delightful Iron Filings',
  'No Footballers',
  'Yellow Tortoises',
  'Purely Yellow',
  'Taking Back May',
  'Two Seconds to New York',
  'Stunning Head Cult',
  'The New York Strippers',
  'The Stunning Nigel Project',
  'Two Shouting Iced Tortoises',
  'Deaf Tortoises',
  'Puddle of Head',
  'Disciples Of New York',
  'Shouting at the Disco',
  'Limp Head',
  'Two Odd Tortoises',
  'Super Stunning Tortoises',
  'Head, Iron Filings and Tortoises',
  'Stunning Head Brigade',
  'Head of the Delightful Iron Filings',
  'Shouting in New York',
  'Au Revior Arms',
]

export const squadNames = [
  'Samurai Mavericks',
  'The Raving Lunatics',
  'American Assassins',
  'New York Pirates',
  'Red Geckos',
  'Awesome Fighters',
  'The Flying Monkeys',
  'GodsFavouriteTeam',
  'Master Spinners',
  'Nans Lads',
  'Debuggers',
  'Outliers',
  'Un-De-Feet-able',
  'Gone with the Wind',
  'Charging Hulks',
  'Eagle Eyed',
  'Rey-eye Beast',
  'Jets of Giants',
  'Crispy Fried Chickens',
  'Pro Performers',
  'Raven Raiders',
  'Hawkeye Hornets',
  'Beast Bulls',
  'Red Bull Wings',
  'No Caveat Cavaliers',
  'The Avengers',
  'MVPs',
  'Best in the Game',
  'The Kings',
  'Hustlers',
  'Iconic',
  'Bulletproof',
  'The Justice League',
  'Lightning Legends',
  'Mister Maniacs',
  'Born to Win',
  'Ninja Bros',
  'The Elite Team',
  'Dominatrix',
  'Big Shots',
  'Unstoppable Force',
  'Crew X',
  'Rule Breakers',
  'The Squad',
  'United Army',
]

const userNames = [
  'Tuesday Mcgee',
  'Morgan Mccarthy',
  'Mason Mccarty',
  'Neville Elledge',
  'Len Romero',
  'Willette Wheeler',
  'Lavonne Mccarthy',
  'Winifred Bradley',
  'Minerva Jackson',
  'Celeste Richards',
  'Manfred Page',
  'Humphrey Shepherd',
  'Gresham Franklin',
]

// utility function to convert a base 58 string to base 10 integer
const decodeBase58 = (base58: string) => {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let base10 = 0n
  for (let i = 0; i < base58.length; i++) {
    base10 = base10 * BigInt(alphabet.length) + BigInt(alphabet.indexOf(base58[i]))
  }
  return base10
}

export const getMatchName = (publicKey: PublicKey) => {
  const base10 = decodeBase58(publicKey.toBase58())
  const index = Number(base10 % BigInt(matchNames.length))
  return matchNames[index]
}

export const getSquadName = (publicKey: PublicKey) => {
  const base10 = decodeBase58(publicKey.toBase58())
  const index = Number(base10 % BigInt(squadNames.length))
  return squadNames[index]
}

export const getUsername = (publicKey: PublicKey) => {
  const base10 = decodeBase58(publicKey.toBase58())
  const index = Number(base10 % BigInt(userNames.length))
  return userNames[index]
}
