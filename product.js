function switchproductType(name_type) {
    if (name_type == "soft") {
        var search_key = document.getElementById('s_type');
    } else {
        var search_key = document.getElementById('p_type');
    } 
    
    switch (search_key.value) {
        case 'pc': return '/json/product.json';
        case 'monitor': return '/json/monitor.json';
        case 'laptop': return '/json/laptop.json';
        case 'minipc': return '/json/minipc.json';
        case 'graphics': return '/json/graphics.json';
        case 'notepad': return '/json/notepad.json';
        case 'camera': return '/json/camera.json';
        case 'drawing': return '/json/drawing.json';
        case 'virtual': return '/json/virtual.json';
        case 'sec_iden': return '/json/sec_iden.json';
        case 'sec_net': return '/json/sec_net.json';
        case 'sec_end': return '/json/sec_end.json';
        case 'sec_info': return '/json/sec_info.json';
        case 'sec_host': return '/json/sec_host.json';
        case 'sec': return '/json/sec.json';
        case 'sec_file': return '/json/sec_file.json';
        case 'ai': return '/json/ai.json';
        case 'microsoft': return '/json/microsoft.json';
        case 'free': return '/json/free.json';
        default: return '';
    }
}

function insertLineBreaks(str) {
    return str.replace(/</g, '<br><');
}

// 搜尋功能：過濾資料並重置頁數
function searchKeyword(keyword) {
    if (!keyword.trim()) {
        filteredData = [...allData]; // 如果沒有搜尋關鍵字，顯示所有資料
    } else {
        filteredData = allData.filter(item =>
            item.品項名稱.includes(keyword) || item.廠牌型號.includes(keyword) // 根據品項名稱搜尋
        );
    }
    currentPage = 1; // 搜尋後重置回第1頁
    renderPage(currentPage, filteredData, document.getElementById('listTable'));
}

// 監聽搜尋框的輸入事件
document.getElementById('search-input').addEventListener('input', (e) => {
    searchKeyword(e.target.value);
});

//  分頁參數
const ITEMS_PER_PAGE = 50;
let currentPage = 1;
let allData = [];

function renderPage(page, data, tableBody) {
    tableBody.innerHTML = ''; // 清空舊內容

    // 表頭
    const trHead = document.createElement('tr');
    trHead.innerHTML = `<th>編號</th>
        <th>項次</th>
        <th>品項名稱</th>
        <th>單位</th>
        <th>決標單價</th>
        <th>廠牌型號</th>
        <th>顏色</th>
        <th>產地</th>`;
    tableBody.appendChild(trHead);

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageData = data.slice(start, end);

    pageData.forEach(item => {
        if (item.品項名稱 !== "") {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.編號}</td>
                <td>${item.項次}</td>
                <td>${insertLineBreaks(item.品項名稱)}</td>
                <td>${item.單位}</td>
                <td>${item.決標單價}</td>
                <td>${item.廠牌型號}</td>
                <td>${item.顏色 || '—'}</td>
                <td>${item.產地}</td>`;
            tableBody.appendChild(tr);
        }
    });

    renderPagination(data);
}

function renderPagination(data) {
    let pagination = document.getElementById('pagination');
    if (!pagination) {
        pagination = document.createElement('div');
        pagination.id = 'pagination';
        document.body.appendChild(pagination);
    }
    pagination.innerHTML = '';

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.disabled = i === currentPage;
        btn.addEventListener('click', () => {
            currentPage = i;
            const tb = document.getElementById('listTable');
            renderPage(currentPage, allData, tb);
        });
        pagination.appendChild(btn);
    }
}

//  保持原本的載入流程
document.addEventListener('DOMContentLoaded', async () => {
    const tb = document.getElementById('listTable');
    const data = await fetch(switchproductType());
    if (!data.ok) throw new Error('資料載入失敗');
    allData = await data.json();
    renderPage(currentPage, allData, tb);

    document.getElementById('p_type').addEventListener('change', async () => {
        const data = await fetch(switchproductType());
        if (!data.ok) throw new Error('資料載入失敗');
        allData = await data.json();
        renderPage(currentPage, allData, tb);
    })

    document.getElementById('s_type').addEventListener('change', async () => {
        const data = await fetch(switchproductType('soft'));
        if (!data.ok) throw new Error('資料載入失敗');
        allData = await data.json();
        renderPage(currentPage, allData, tb);
    })
});
