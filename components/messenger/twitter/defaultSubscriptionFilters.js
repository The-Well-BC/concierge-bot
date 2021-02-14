module.exports = [
    { events: ['drop'] },
    { txPriceGTE: '$1000', platforms: ['superrare', 'foundation'] },
    { txPriceGTE: '$500', platforms: ['zora'] },
    { txPriceGTE: '$3300', platforms: ['nifty'] },
    { priceGT: '$1000' }
]
