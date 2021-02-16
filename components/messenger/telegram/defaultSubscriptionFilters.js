module.exports = [
    { events: ['drop'], platforms: ['superrare', 'foundation', 'zora'] },
    { txPriceGTE: '$1000', platforms: ['superrare', 'foundation'] },
    { txPriceGTE: '$300', platforms: ['zora'] },
    { txPriceGTE: '$3000', platforms: ['nifty'] },
    { priceGT: '$1000' }
]
