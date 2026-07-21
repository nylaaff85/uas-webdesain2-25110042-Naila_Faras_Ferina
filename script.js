// =========================
// TOMBOL BACK TO TOP
// =========================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// =========================
// KERANJANG
// =========================

let cart = [];

// Fungsi format Rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

// Tambah ke keranjang
function addToCart(itemName, itemPrice) {
    const existing = cart.find(item => item.name === itemName);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: itemName, price: itemPrice, qty: 1 });
    }
    updateCartUI();
    showToast(`${itemName} ditambahkan ke keranjang!`, 'success');
}

// Kurangi dari keranjang
function removeFromCart(itemName) {
    const index = cart.findIndex(item => item.name === itemName);
    if (index !== -1) {
        if (cart[index].qty > 1) {
            cart[index].qty -= 1;
        } else {
            cart.splice(index, 1);
        }
    }
    updateCartUI();
}

// Hapus item dari keranjang
function deleteFromCart(itemName) {
    const index = cart.findIndex(item => item.name === itemName);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    updateCartUI();
}

// Kosongkan keranjang
function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Yakin ingin mengosongkan keranjang?')) {
        cart = [];
        updateCartUI();
        showToast('Keranjang telah dikosongkan', 'info');
    }
}

// Hitung total
function getTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// Hitung total item
function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

// Update UI Keranjang
function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    const cartCount = document.getElementById('cartCount');

    // Update badge
    const totalItems = getTotalItems();
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x" style="font-size: 48px; color: #d4c5b2;"></i>
                <p class="text-muted mt-3">Keranjang kosong</p>
            </div>
        `;
        totalPrice.textContent = 'Rp 0';
        return;
    }

    // Render item
    let html = '';
    cart.forEach(item => {
        const totalItemPrice = item.price * item.qty;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatRupiah(item.price)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-minus" onclick="removeFromCart('${item.name}')">−</button>
                    <span class="cart-item-qty">${item.qty}</span>
                    <button class="btn-plus" onclick="addToCart('${item.name}', ${item.price})">+</button>
                    <button class="btn-remove" onclick="deleteFromCart('${item.name}')">✕</button>
                </div>
            </div>
        `;
    });

    cartItems.innerHTML = html;

    // Update total
    const total = getTotal();
    totalPrice.textContent = formatRupiah(total);
}

// Toggle Keranjang
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('open');
}

// Checkout via WhatsApp
function checkout() {
    if (cart.length === 0) {
        showToast('Keranjang masih kosong!', 'error');
        return;
    }

    let message = '🍳 *Pesanan Kedai Nasi Goreng Petai Simpang Uka* 🍳\n\n';
    message += '📋 *Daftar Pesanan:*\n';
    cart.forEach(item => {
        message += `- ${item.name} x${item.qty} = ${formatRupiah(item.price * item.qty)}\n`;
    });
    message += `\n💰 *Total: ${formatRupiah(getTotal())}*\n\n`;
    message += '📌 *Catatan:* (tambahkan catatan jika ada)\n\n';
    message += 'Terima kasih! 🙏';

    const phone = '6281275551075';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// =========================
// NOTIFIKASI TOAST
// =========================

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
        <div class="toast-content ${type}">
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}