module.exports = (messenger) => {
    let filePath = `../messenger/${ messenger }/defaultSubscriptionFilters`;

    return require(filePath);
}
