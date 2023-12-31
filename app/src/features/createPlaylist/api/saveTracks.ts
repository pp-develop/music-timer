import { axios } from '../../../lib/axos';

export function SaveTracks() {
    axios.post('/tracks', { includeFavoriteArtists: true })
}
