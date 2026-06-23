import * as l from 'lucide-vue-next'
const names = ['UserRound','PackageOpen','SearchX','Menu','Heart','Check','Ticket','Shirt','Gift','BadgeCheck','PartyPopper','ShoppingBag','ArrowRight','X','Truck','Star','Award','Sparkles','Scissors','Gem','Crown','Layers','Smile']
const missing = names.filter(n => !l[n])
console.log(missing.length ? 'MISSING: ' + missing.join(', ') : 'ALL OK')
