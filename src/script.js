async function downloadMedia() {
    const url = document.getElementById('url').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch(`/download?url=${encodeURIComponent(url)}`, { method: 'POST' });
        const responseData = await response.json();
        let i = 1;
        if (response.ok) {
            resultDiv.innerHTML = `<h3 class="text-xl font-semibold mb-4">Downloaded from ${responseData.platform}</h3>`;
            responseData.data.forEach(mediaData => {
                if (mediaData.type === 'image') {
                    resultDiv.innerHTML += `
                        <a href="${mediaData.url}" target="_blank" class="block mt-4 rounded-lg shadow-lg">
                            gambar ${i++}
                        </a>`;
                } else if (mediaData.type === 'video') {
                    resultDiv.innerHTML += `
                        <video controls class="media-container rounded-lg shadow-lg">
                            <source src="${mediaData.url}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>`;
                }
            });
        } else {
            resultDiv.innerHTML = `<p class="text-red-500">Error: ${responseData.error}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
}