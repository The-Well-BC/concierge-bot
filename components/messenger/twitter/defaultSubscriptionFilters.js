module.exports = [
    { events: ['drop'], platforms: ['superrare', 'foundation', 'zora'] },
    { txPriceGTE: '$1000', platforms: ['superrare', 'foundation'] },
    { txPriceGTE: '$300', platforms: ['zora'] },
    { events: ['sale'], platforms: ['zora'] },
    { txPriceGTE: '$3300', platforms: ['nifty'] },
    { priceGT: '$1000' }
]
