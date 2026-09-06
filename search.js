let searchIndex = [];

// ページ読み込み時に自動生成された search.json を取得
fetch('search.json')
    .then(response => response.json())
    .then(data => {
        searchIndex = data;
    })
    .catch(err => console.error('検索インデックスの読み込みに失敗しました:', err));

function autoSearch(keyword) {
    const popup = document.getElementById("search-results-popup");
    const query = keyword.trim().toLowerCase();

    if (!query) {
        popup.style.display = "none";
        popup.innerHTML = "";
        return;
    }

    // タイトルや本文にキーワードが含まれているものを抽出
    const matches = searchIndex.filter(page => 
        page.title.toLowerCase().includes(query) || page.content.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        popup.style.display = "block";
        popup.innerHTML = `<div style="padding: 10px; font-size: 0.9rem; color: #54595d;">一致するページはありません</div>`;
        return;
    }

    let html = "<ul style='list-style: none; margin: 0; padding: 0;'>";
    matches.forEach(page => {
        html += `<li style='border-bottom: 1px solid #eaecf0; background: #fff;'>
            <a href="${page.url}" style='display: block; padding: 8px 10px; text-decoration: none; color: #0645ad; font-size: 0.9rem;'>
                <strong>${page.title}</strong>
            </a>
        </li>`;
    });
    html += "</ul>";

    popup.innerHTML = html;
    popup.style.display = "block";
}

function performSearch(event) {
    event.preventDefault();
}
