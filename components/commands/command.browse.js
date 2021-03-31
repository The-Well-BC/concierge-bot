const { ArtistDAO } = require('../daos/artists.dao');

module.exports = (payload, messenger, formatter, commands, useTestFile) => {
    if(!payload.command.params)
        return Promise.resolve(formatter.browse(messenger, commands));
    else {
        let artists = new ArtistDAO();
        if(useTestFile)
            artists.useTestFile = useTestFile;

        return artists.fetchArtists(3)
        .then(res => {
            return formatter.creatorSummary(res, messenger);
        });
    }
}
