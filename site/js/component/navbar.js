import { logout } from "../main.js";
import { addCustomEventListener, createElementFromString, getCurrentPath, getElementUntilElementAvailable, isMobileDevice, isOwnerOrAdmin } from "../utils.js";

const noNavbarPage = ["login", "forgotpassword", "initialdata"].map(item => `/${item}.html`);

let currentPath = getCurrentPath();
if (!noNavbarPage.includes(currentPath)) {
    const adminMenu = `
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Pengumuman 
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="/announcementmenu.html">Lihat Daftar Pengumuman</a></li>
                <li><a class="dropdown-item" href="/createannouncement.html">Buat Pengumuman</a></li>
            </ul>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Kamar 
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="/roomlist.html">Lihat Daftar Kamar</a></li>
                <li><a class="dropdown-item" href="/createroom.html">Tambah Data Kamar</a></li>
            </ul>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                Layanan Kos 
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="/agenda.html">Lihat Agenda</a></li>
                <li><a class="dropdown-item" href="/requesthistory.html">Lihat Histori Pengajuan Layanan</a></li>
                <li><a class="dropdown-item" href="/service.html">Tambah Layanan Baru</a></li>
            </ul>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                User 
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="/listuser.html">Lihat Daftar User</a></li>
                <li><a class="dropdown-item" href="/registeruser.html">Daftarkan User</a></li>
            </ul>
        </li>`;

    const tenantMenu = `
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
                Layanan Kos
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="/servicerequest.html">Ajukan Layanan</a></li>
                <li><a class="dropdown-item" href="/requesthistory.html">Lihat Histori Pengajuan</a></li>
            </ul>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
                Pembayaran
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="/payment.html">Bayar Tagihan</a></li>
                <li><a class="dropdown-item" href="/paymenthistory.html">Lihat Histori Pembayaran</a></li>
            </ul>
        </li>`;

    let adminMobile = `
        <nav class="row bottom-navbar-card fixed-bottom rounded border-0 mt-4">
            <a href="./home.html" class="menu hover-text">
                <span class="tooltip-text tooltip-top">Beranda</span>
                <i class="fa-solid fa-home"></i>
            </a>
            <a href="./announcementmenu.html" class="menu hover-text">
                <span class="tooltip-text tooltip-top">Pengumuman</span>
                <i class="fa-solid fa-newspaper"></i>
            </a>
            <a href="./roomlist.html" class="menu hover-text">
                <span class="tooltip-text tooltip-top">Kamar</span>
                <i class="fa-solid fa-door-open"></i>
            </a>
            <a href="./profile.html" class="menu hover-text">
                <span class="tooltip-text tooltip-top">Profil</span>
                <i class="fa-solid fa-circle-user"></i>
            </a>
        </nav>
    `;

    let tenantMobile = `
        <nav class="row bottom-navbar-card fixed-bottom rounded border-0 mt-4">
            <a href="./announcementmenu.html" class="menu hover-text">
                <span class="tooltip-text tooltip-top">Pengumuman</span>
                <i class="fa-solid fa-newspaper"></i>
            </a>
            <a href="./home.html" class="menu hover-text">
                <span class="tooltip-text tooltip-top">Beranda</span>
                <i class="fa-solid fa-home"></i>
            </a>
            <a href="./profile.html" class="menu hover-text">
                <span class="tooltip-text tooltip-top">Profil</span>
                <i class="fa-solid fa-circle-user"></i>
            </a>
        </nav>
    `;

    const navBar = !isMobileDevice() ? `
        <nav class="navbar navbar-expand-lg sticky-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="./home.html">
                    <img src="./asset/image/Logo.png" alt="In D'Kos" height="28em">
                </a>
                <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
    
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link fw-bolder" aria-current="page" href="/home.html">Beranda</a>
                        </li>
                        ${isOwnerOrAdmin() ? adminMenu : tenantMenu}
                        <li class="nav-item dropdown">
                            <a class="nav-link" href="#" data-bs-toggle="dropdown">
                                <i class="fa-solid fa-circle-user fs-4"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="/profile.html">
                                    <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Profil
                                </a>
                                <a class="dropdown-item" href="/notification.html">
                                    <i class="fas fa-bell fa-sm fa-fw mr-2"></i>
                                    Notifikasi
                                </a>
                                <a class="dropdown-item" href="/settings.html">
                                    <i class="fad fa-cogs fa-sm fa-fw mr-2"></i>
                                    Pengaturan
                                </a>
                                <hr class="dropdown-divider">
                                <a type="logout1" class="dropdown-item" href="#">
                                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2"></i>
                                    Keluar
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>` :
        `${isOwnerOrAdmin() ? adminMobile : tenantMobile}`;
    
    let body = await getElementUntilElementAvailable("body");
    body.insertBefore(createElementFromString(navBar), document.body.firstChild);
        
    addCustomEventListener("logout1", e => {
        logout();
    });
}

