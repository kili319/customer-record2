// 获取DOM元素
const form = document.getElementById('record-form');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const amountInput = document.getElementById('amount');
const couponInput = document.getElementById('coupon');
const searchInput = document.getElementById('search');
const tableBody = document.querySelector('#records-table tbody');

// 读取本地存储的数据
function getRecords() {
    return JSON.parse(localStorage.getItem('records') || '[]');
}

// 保存数据到本地存储
function saveRecords(records) {
    localStorage.setItem('records', JSON.stringify(records));
}

// 金额格式化
function formatAmount(amount) {
    return '￥' + Number(amount).toLocaleString('zh-CN', {minimumFractionDigits: 2});
}

// 渲染表格
function renderTable(records) {
    tableBody.innerHTML = '';
    records.forEach((record, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${record.name}</td>
            <td>${record.phone}</td>
            <td>${formatAmount(record.amount)}</td>
            <td>${record.date}</td>
            <td>${record.coupon || ''}</td>
            <td>
                <button class="action-btn" onclick="editRecord(${idx})">编辑</button>
                <button class="action-btn" onclick="deleteRecord(${idx})">删除</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// 编辑相关变量
let editIndex = null; // 当前编辑的记录索引

// 修改表单按钮文本和添加取消按钮
function setEditMode(isEdit) {
    const submitBtn = form.querySelector('button[type="submit"]');
    let cancelBtn = form.querySelector('#cancel-edit');
    if (isEdit) {
        submitBtn.textContent = '保存修改';
        if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.id = 'cancel-edit';
            cancelBtn.textContent = '取消编辑';
            cancelBtn.style.background = '#bdbdbd';
            cancelBtn.style.marginLeft = '5px';
            cancelBtn.onclick = function() {
                editIndex = null;
                form.reset();
                setEditMode(false);
            };
            submitBtn.after(cancelBtn);
        }
    } else {
        submitBtn.textContent = '添加记录';
        if (cancelBtn) cancelBtn.remove();
    }
}

// 修改表单提交逻辑
form.onsubmit = function(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const amount = amountInput.value.trim();
    const coupon = couponInput.value.trim();
    if (!name || !phone || !amount) return;
    const records = getRecords();
    if (editIndex !== null) {
        // 编辑模式，更新记录
        records[editIndex] = {
            ...records[editIndex],
            name, phone, amount, coupon
            // 日期不变
        };
        editIndex = null;
        setEditMode(false);
    } else {
        // 添加模式
        const date = new Date().toLocaleString('zh-CN');
        records.push({ name, phone, amount, date, coupon });
    }
    saveRecords(records);
    renderTable(records);
    form.reset();
};

// 删除记录
function deleteRecord(idx) {
    if (!confirm('确定要删除这条记录吗？')) return;
    const records = getRecords();
    records.splice(idx, 1);
    saveRecords(records);
    renderTable(records);
}

// 编辑记录
function editRecord(idx) {
    const records = getRecords();
    const record = records[idx];
    nameInput.value = record.name;
    phoneInput.value = record.phone;
    amountInput.value = record.amount;
    couponInput.value = record.coupon || '';
    editIndex = idx;
    setEditMode(true);
}

// 搜索功能
searchInput.oninput = function() {
    const keyword = searchInput.value.trim();
    const records = getRecords();
    const filtered = records.filter(r =>
        r.name.includes(keyword) || r.phone.includes(keyword)
    );
    renderTable(filtered);
};

// 页面加载时渲染表格
window.onload = function() {
    renderTable(getRecords());
}; 