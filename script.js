// =========================
// SISTEM PER SLIDE
// =========================

// Navigasi antar section
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {

        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;

            const targetPosition =
                targetSection.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        }

    });
});

const navLinks = document.querySelectorAll(".nav-link");
const pageSections = document.querySelectorAll(
    "#home, #about, #produk, #kontak"
);
const menuFavorit = document.getElementById("menu-favorit");

// Fungsi untuk menampilkan halaman
function showPage(pageId) {

    // Sembunyikan semua halaman
    pageSections.forEach(section => {
        section.style.display = "none";
    });

    // Sembunyikan Menu Favorit
    menuFavorit.style.display = "none";

    // Tampilkan halaman yang dipilih
    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.style.display = "block";
    }

    // Menu Favorit hanya muncul di Home
    if (pageId === "home") {
        menuFavorit.style.display = "block";
    }

    // Kembali ke atas
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// =========================
// NAVBAR
// =========================

navLinks.forEach(link => {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        const pageId = this.getAttribute("href").replace("#", "");

        showPage(pageId);

        // Mengubah menu yang aktif
        navLinks.forEach(nav => {
            nav.classList.remove("active");
        });

        this.classList.add("active");

    });

});

// =========================
// BACK TO TOP
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
// SISTEM KERANJANG
// =========================

let keranjang = [];

// Fungsi untuk menampilkan toast
function showToast(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    
    const toast = document.createElement('div');
    toast.className = `toast-custom ${type === 'error' ? 'toast-error' : ''}`;
    toast.innerHTML = `
        <i class="bi ${type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'} me-2"></i>
        ${message}
    `;
    
    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);
    
    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}

// Fungsi untuk menambah ke keranjang
function tambahKeKeranjang(nama, harga) {
    const existingItem = keranjang.find(item => item.nama === nama);
    
    if (existingItem) {
        existingItem.qty += 1;
        showToast(`Jumlah ${nama} bertambah!`);
    } else {
        keranjang.push({
            nama: nama,
            harga: harga,
            qty: 1
        });
        showToast(`${nama} berhasil ditambahkan ke keranjang!`);
    }
    
    updateKeranjang();
}

// Fungsi untuk menghapus dari keranjang
function hapusDariKeranjang(nama) {
    keranjang = keranjang.filter(item => item.nama !== nama);
    updateKeranjang();
    showToast(`${nama} dihapus dari keranjang`, 'error');
}

// Fungsi untuk update tampilan keranjang
function updateKeranjang() {
    const listElement = document.getElementById('keranjangList');
    const totalElement = document.getElementById('totalHarga');
    const countElement = document.getElementById('keranjangCount');
    
    let total = 0;
    let totalItem = 0;
    
    if (keranjang.length === 0) {
        listElement.innerHTML = '<p class="text-muted text-center">Belum ada pesanan</p>';
        totalElement.textContent = 'Rp 0';
        countElement.textContent = '0';
        return;
    }
    
    let html = '';
    keranjang.forEach(item => {
        const subtotal = item.harga * item.qty;
        total += subtotal;
        totalItem += item.qty;
        
        html += `
            <div class="keranjang-item">
                <div class="item-info">
                    <div class="item-nama">${item.nama}</div>
                    <div class="item-harga">Rp ${item.harga.toLocaleString()}</div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="fw-bold">x${item.qty}</span>
                    <span class="fw-bold text-danger">Rp ${subtotal.toLocaleString()}</span>
                    <button class="btn-hapus" onclick="hapusDariKeranjang('${item.nama}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    listElement.innerHTML = html;
    totalElement.textContent = `Rp ${total.toLocaleString()}`;
    countElement.textContent = totalItem;
}

// Fungsi untuk kosongkan keranjang
function kosongkanKeranjang() {
    if (keranjang.length === 0) return;
    
    if (confirm('Yakin ingin mengosongkan keranjang?')) {
        keranjang = [];
        updateKeranjang();
        showToast('Keranjang telah dikosongkan', 'error');
    }
}

// Fungsi checkout
function checkout() {
    if (keranjang.length === 0) {
        showToast('Keranjang masih kosong!', 'error');
        return;
    }
    
    const total = keranjang.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const pesanan = keranjang.map(item => 
        `${item.nama} x${item.qty} = Rp ${(item.harga * item.qty).toLocaleString()}`
    ).join('\n');
    
    const message = `Halo Kak, saya mau pesan:\n\n${pesanan}\n\nTotal: Rp ${total.toLocaleString()}`;
    const waNumber = '081275551075';
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    showToast('Terima kasih! Pesanan akan diproses.');
}

// Event listener untuk tombol pesan
document.querySelectorAll('.btn-pesan').forEach(button => {
    button.addEventListener('click', function() {
        const nama = this.dataset.nama;
        const harga = parseInt(this.dataset.harga);
        tambahKeKeranjang(nama, harga);
        
        // Animasi tombol
        this.innerHTML = '<i class="bi bi-check-circle"></i> Ditambahkan!';
        setTimeout(() => {
            this.innerHTML = '<i class="bi bi-cart-plus"></i> Pesan';
        }, 1000);
    });
});

// Inisialisasi keranjang
updateKeranjang();
