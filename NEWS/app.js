const apiKey = '6abfed3ab1224b379119ecbc48070cfe';
let currentPage = 1;
const pageSize = 12;
let currentCategory = '';
let currentCountry = 'us';
let searchQuery = '';

const newsContainer = document.getElementById('news-container');
const loader = document.getElementById('loader');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const backToTopBtn = document.getElementById('back-to-top');

// Event listeners for controls
document.getElementById('category').addEventListener('change', event => {
    currentCategory = event.target.value;
    currentPage = 1;
    fetchNews();
});

document.getElementById('country').addEventListener('change', event => {
    currentCountry = event.target.value;
    currentPage = 1;
    fetchNews();
});

document.getElementById('search-btn').addEventListener('click', () => {
    searchQuery = document.getElementById('search').value;
    currentPage = 1;
    fetchNews();
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchNews();
    }
});

nextPageBtn.addEventListener('click', () => {
    currentPage++;
    fetchNews();
});

// Dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.innerText = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// Back to Top button functionality
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.remove('hidden');
    } else {
        backToTopBtn.classList.add('hidden');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

function fetchNews() {
    loader.classList.remove('hidden');
    newsContainer.innerHTML = '';
    
    let apiUrl = `https://newsapi.org/v2/top-headlines?country=${currentCountry}&page=${currentPage}&pageSize=${pageSize}&apiKey=${apiKey}`;
    
    if (currentCategory) {
        apiUrl += `&category=${currentCategory}`;
    }
    
    if (searchQuery) {
        apiUrl += `&q=${encodeURIComponent(searchQuery)}`;
    }
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayNews(data.articles);
            updatePaginationButtons(data.totalResults);
        })
        .catch(error => {
            console.error('Error fetching news:', error);
        })
        .finally(() => {
            loader.classList.add('hidden');
        });
}

function displayNews(articles) {
    if (articles.length === 0) {
        newsContainer.innerHTML = '<p>No news articles found.</p>';
        return;
    }
    
    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('news-article');

        const articleImage = document.createElement('img');
        articleImage.src = article.urlToImage || '';
        articleImage.alt = article.title;
        articleDiv.appendChild(articleImage);

        const articleTitle = document.createElement('h2');
        articleTitle.innerText = article.title;
        articleDiv.appendChild(articleTitle);

        const articleDescription = document.createElement('p');
        articleDescription.innerText = article.description || 'No description available';
        articleDiv.appendChild(articleDescription);

        const articleLink = document.createElement('a');
        articleLink.href = article.url;
        articleLink.target = '_blank';
        articleLink.innerText = 'Read more';
        articleLink.classList.add('read-more');
        articleDiv.appendChild(articleLink);

        newsContainer.appendChild(articleDiv);
    });
}

function updatePaginationButtons(totalResults) {
    const totalPages = Math.ceil(totalResults / pageSize);

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// Initial fetch of news
fetchNews();

