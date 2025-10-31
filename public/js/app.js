const API_BASE_URL = '/api';
const searchForm = document.getElementById('searchForm');
const artistNameInput = document.getElementById('artistName');
const genreSelect = document.getElementById('genre');
const searchBtn = document.getElementById('searchBtn');
const searchBtnText = document.getElementById('searchBtnText');
const searchSpinner = document.getElementById('searchSpinner');
const errorMessage = document.getElementById('errorMessage');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsSection = document.getElementById('resultsSection');
const similarArtistsContainer = document.getElementById('similarArtists');
const artistDetailsSection = document.getElementById('artistDetailsSection');
const albumsContainer = document.getElementById('albumsContainer');
const tracksSection = document.getElementById('tracksSection');
const tracksContainer = document.getElementById('tracksContainer');
let currentArtist = null;
let selectedArtistMbid = null;
function showError(message) {
    const errorText = errorMessage.querySelector('.error-text');
    if (errorText) {
        errorText.textContent = message;
    } else {
        errorMessage.textContent = message;
    }
    errorMessage.classList.remove('d-none');
    errorMessage.setAttribute('role', 'alert');
    setTimeout(() => {
        errorMessage.classList.add('d-none');
    }, 10000);
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function hideError() {
    errorMessage.classList.add('d-none');
}
function showLoading() {
    loadingIndicator.classList.remove('d-none');
    searchBtn.disabled = true;
    searchBtnText.textContent = 'Searching...';
    searchSpinner.classList.remove('d-none');
}
function hideLoading() {
    loadingIndicator.classList.add('d-none');
    searchBtn.disabled = false;
    searchBtnText.textContent = 'Search';
    searchSpinner.classList.add('d-none');
}
function validateInput(artistName, genre) {
    if (!artistName || artistName.trim() === '') {
        showError('Please enter an artist name');
        artistNameInput.focus();
        return false;
    }
    if (!genre || genre === '') {
        showError('Please select a genre');
        genreSelect.focus();
        return false;
    }
    return true;
}
async function searchArtist(name) {
    try {
        const response = await fetch(`${API_BASE_URL}/search-artist?name=${encodeURIComponent(name)}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to search for artist: ${error.message}`);
    }
}
async function getArtistDetails(mbid) {
    try {
        const response = await fetch(`${API_BASE_URL}/artist/${mbid}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to fetch artist details: ${error.message}`);
    }
}
async function getSimilarArtists(mbid, genre) {
    try {
        const response = await fetch(`${API_BASE_URL}/artist/${mbid}/similar?genre=${encodeURIComponent(genre)}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to find similar artists: ${error.message}`);
    }
}
async function getArtistAlbums(mbid) {
    try {
        const response = await fetch(`${API_BASE_URL}/artist/${mbid}/releases`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to fetch artist albums: ${error.message}`);
    }
}
async function getAlbumTracks(releaseId) {
    try {
        const response = await fetch(`${API_BASE_URL}/release/${releaseId}/recordings`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to fetch album tracks: ${error.message}`);
    }
}
function displaySimilarArtists(artists) {
    if (!artists || artists.length === 0) {
        similarArtistsContainer.innerHTML = '<div style="grid-column: 1 / -1;"><p style="text-align: center; color: var(--text-secondary);">No similar artists found.</p></div>';
        return;
    }
    similarArtistsContainer.innerHTML = artists.map((artist, index) => {
        const name = artist.name || 'Unknown Artist';
        const country = artist.country || '';
        const type = artist.type || '';
        const beginDate = artist['life-span']?.begin || '';
        return `
            <div class="artist-card" 
                 tabindex="0" 
                 data-mbid="${artist.id}"
                 aria-label="Artist: ${name}"
                 role="button"
                 onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectArtist('${artist.id}', '${name.replace(/'/g, "\\'")}'); }">
                <div class="card-body">
                    <h3 class="card-title artist-name" title="${name}">${name}</h3>
                    ${type ? `<p class="card-text" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">${type}</p>` : ''}
                    ${country ? `<p class="card-text" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">📍 ${country}</p>` : ''}
                    ${beginDate ? `<p class="card-text" style="color: var(--text-secondary); font-size: 0.875rem;">Started: ${beginDate.split('-')[0]}</p>` : ''}
                </div>
                <div class="card-footer">
                    <button class="btn" 
                            onclick="selectArtist('${artist.id}', '${name.replace(/'/g, "\\'")}')"
                            aria-label="View albums for ${name}">
                        View Albums
                    </button>
                </div>
            </div>
        `;
    }).join('');
}
function displayAlbums(releases) {
    console.log('displayAlbums called with:', releases);
    if (!releases || releases.length === 0) {
        console.log('No releases found. Releases:', releases);
        albumsContainer.innerHTML = '<div style="grid-column: 1 / -1;"><p style="text-align: center; color: var(--text-secondary);">No albums found for this artist.</p></div>';
        return;
    }
    const uniqueReleases = [];
    const seenTitles = new Set();
    releases.forEach(release => {
        const title = release.title || 'Unknown Album';
        const normalizedTitle = title.toLowerCase().trim();
        if (!seenTitles.has(normalizedTitle)) {
            seenTitles.add(normalizedTitle);
            uniqueReleases.push(release);
        }
    });
    albumsContainer.innerHTML = uniqueReleases.slice(0, 20).map((release, index) => {
        const title = release.title || 'Unknown Album';
        const date = release.date || '';
        const status = release.status || '';
        return `
            <div class="album-card" 
                 tabindex="0"
                 data-release-id="${release.id}"
                 aria-label="Album: ${title}"
                 role="button"
                 onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectAlbum('${release.id}', '${title.replace(/'/g, "\\'")}'); }">
                <div class="card-body">
                    <h4 class="card-title album-title" title="${title}">${title}</h4>
                    ${date ? `<p class="card-text" style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">📅 ${date.split('-')[0]}</p>` : ''}
                    ${status ? `<p class="card-text" style="color: var(--text-secondary); font-size: 0.875rem;">Status: ${status}</p>` : ''}
                </div>
                <div class="card-footer">
                    <button class="btn" 
                            onclick="selectAlbum('${release.id}', '${title.replace(/'/g, "\\'")}')"
                            aria-label="View tracks for ${title}">
                        View Tracks
                    </button>
                </div>
            </div>
        `;
    }).join('');
}
function displayTracks(release) {
    if (!release || !release.media || release.media.length === 0) {
        tracksContainer.innerHTML = '<p class="text-muted">No tracks available for this album.</p>';
        return;
    }
    let trackList = '';
    let trackNumber = 1;
    release.media.forEach(medium => {
        if (medium.tracks && medium.tracks.length > 0) {
            medium.tracks.forEach(track => {
                const recording = track.recording;
                const title = recording.title || 'Unknown Track';
                const length = recording.length ? formatDuration(recording.length) : '';
                trackList += `
                    <div class="track-item" 
                         role="listitem"
                         tabindex="0">
                        <span class="track-number" aria-label="Track ${trackNumber}">${trackNumber}.</span>
                        <div style="flex-grow: 1;">
                            <h5 style="margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-primary);">${title}</h5>
                            ${length ? `<small style="color: var(--text-light); font-size: 0.875rem;">${length}</small>` : ''}
                        </div>
                    </div>
                `;
                trackNumber++;
            });
        }
    });
    tracksContainer.innerHTML = trackList || '<p class="text-muted">No tracks available for this album.</p>';
}
function formatDuration(milliseconds) {
    if (milliseconds === null || milliseconds === undefined) return '';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
async function selectArtist(mbid, name) {
    try {
        selectedArtistMbid = mbid;
        hideError();
        showLoading();
        tracksSection.classList.add('d-none');
        artistDetailsSection.classList.remove('d-none');
        albumsContainer.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">Loading albums...</div>';
        artistDetailsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const releasesData = await getArtistAlbums(mbid);
        console.log('Releases response:', releasesData);
        let releases = [];
        
        if (Array.isArray(releasesData)) {
            releases = releasesData;
        } else if (releasesData && Array.isArray(releasesData.releases)) {
            releases = releasesData.releases;
        } else if (releasesData && Array.isArray(releasesData['release-list'])) {
            releases = releasesData['release-list'];
        } else if (releasesData && typeof releasesData === 'object') {
            for (const key in releasesData) {
                if (Array.isArray(releasesData[key]) && releasesData[key].length > 0) {
                    const firstItem = releasesData[key][0];
                    if (firstItem && (firstItem.id || firstItem.title || firstItem.date)) {
                        releases = releasesData[key];
                        break;
                    }
                }
            }
        }
        
        console.log('Extracted releases:', releases);
        console.log('Releases count:', releases ? releases.length : 0);
        displayAlbums(releases);
    } catch (error) {
        showError(`Failed to load albums: ${error.message}`);
    } finally {
        hideLoading();
    }
}
async function selectAlbum(releaseId, title) {
    try {
        hideError();
        showLoading();
        tracksSection.classList.remove('d-none');
        tracksContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">Loading tracks...</p>';
        tracksSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const release = await getAlbumTracks(releaseId);
        displayTracks(release);
    } catch (error) {
        showError(`Failed to load tracks: ${error.message}`);
    } finally {
        hideLoading();
    }
}
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    const artistName = artistNameInput.value.trim();
    const genre = genreSelect.value;
    if (!validateInput(artistName, genre)) {
        return;
    }
    try {
        showLoading();
        resultsSection.classList.add('d-none');
        artistDetailsSection.classList.add('d-none');
        tracksSection.classList.add('d-none');
        const searchResults = await searchArtist(artistName);
        const artists = searchResults.artists || [];
        if (artists.length === 0) {
            throw new Error(`No artists found matching "${artistName}". Please try a different name.`);
        }
        const baseArtist = artists[0];
        currentArtist = baseArtist;
        const similarData = await getSimilarArtists(baseArtist.id, genre);
        const similarArtists = similarData.artists || [];
        if (similarArtists.length === 0) {
            const genreSearchResults = await searchArtist(`tag:${genre}`);
            const genreArtists = genreSearchResults.artists || [];
            if (genreArtists.length > 0) {
                displaySimilarArtists(genreArtists.slice(0, 10));
            } else {
                similarArtistsContainer.innerHTML = `
                    <div style="grid-column: 1 / -1;">
                        <div style="background-color: #eff6ff; border: 2px solid var(--primary-blue); border-radius: 0.5rem; padding: 1rem; text-align: center; color: var(--text-primary);" role="alert">
                            No similar artists found for "${artistName}" in the "${genre}" genre. 
                            Please try a different artist or genre.
                        </div>
                    </div>
                `;
            }
        } else {
            displaySimilarArtists(similarArtists);
        }
        resultsSection.classList.remove('d-none');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        console.error('Search error:', error);
        showError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
        hideLoading();
    }
});
window.selectArtist = selectArtist;
window.selectAlbum = selectAlbum;
