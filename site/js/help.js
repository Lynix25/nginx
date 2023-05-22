import { forEach, goBack, isOwnerOrAdmin } from "./utils.js";

let helper = document.querySelector("#helper")

if (isOwnerOrAdmin()) {
    helper.innerHTML = `
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                aria-expanded="true" aria-controls="collapseOne">
                Bagaimana cara menambahkan user ?
            </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#helper">
            <div class="accordion-body">
                <div>1. Akses menu "Daftarkan User" untuk menambahkan user baru</div>
                <div>2. Isi data yang diperlukan</div>
                <div>3. Simpan data</div>
                <div>4. Apabila berhasil tersimpan, maka data akun akan otomatis terbuat juga</div>
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo"
                aria-expanded="true" aria-controls="collapseTwo">
                Bagaimana cara melihat tugas pengajuan yang harus dilakukan dalam seminggu ini?
            </button>
        </h2>
        <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#helper">
            <div class="accordion-body">
                <div>1. Buka menu "Agenda"</div>
                <div>2. Akan tampil kalender yang pada setiap tanggalnya berisi to do list berupa tugas pengajuan layanan yang harus dikerjakan pihak kos</div>
                <div>3. Dapat dilakukan filter berdasarkan tanggal jika diperlukan</div>
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree"
                aria-expanded="true" aria-controls="collapseThree">
                Bagaimana cara menginfokan update status pengajuan layanan yang diajukan penyewa?
            </button>
        </h2>
        <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#helper">
            <div class="accordion-body">
                <div>1. Buka detail pengajuan layanan yang ingin dikerjakan</div>
                <div>2. Akan terdapat kolom "Catatan Penyelesaian" yang dapat diisi jika ada informasi yang ingin disampaikan berkaitan dengan penyelesaian pengerjaan layanan</div>
                <div>3. Untuk melakukan perubahan status, dapat dilakukan klik  pada tombol "Terima" atau "Tolak" ketika status pengajuan layanan "Menunggu Konfirmasi". Atau dapat dilakukan dengan menekan tombol "Perbaharui Info" atau "Selesai" pada pengajuan layanan yang berstatus "Dalam Pengerjaan".</div>
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour"
                aria-expanded="true" aria-controls="collapseFour">
                Bagaimana cara melihat melihat layanan yang pernah diajukan oleh penyewa?
            </button>
        </h2>
        <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#helper">
            <div class="accordion-body">
                <div>1. Akses menu "Histori Layanan"</div>
                <div>2. Pengajuan layanan yang pernah diajukan akan tampil di sini</div>
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive"
                aria-expanded="true" aria-controls="collapseFive">
                Bagaimana cara melihat melihat pembayaran yang pernah diajukan oleh penyewa?
            </button>
        </h2>
        <div id="collapseFive" class="accordion-collapse collapse" data-bs-parent="#helper">
            <div class="accordion-body">
                <div>1. Akses menu "Histori Pembayaran"</div>
                <div>2. Pembayaran yang pernah dilakukan akan tampil di sini</div>
            </div>
        </div>
    </div>
    `;
} else {
    helper.innerHTML = `
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                aria-expanded="true" aria-controls="collapseOne">
                Bagaimana cara melakukan pengajuan layanan?
            </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#helper">
            <div class="accordion-body">
                <div>1. Akses menu "Ajukan Layanan"</div>
                <div>2. Isi form pengajuan layanan sesuai kebutuhan</div>
                <div>3. Submit pengajuan layanan</div>
                <div>4. Pengajuan layanan yang baru saja dibuat akan bersatatus "Menunggu Konfirmasi" untuk ditangin lebih lanjut oleh pihak kos.</div>
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo"
                aria-expanded="true" aria-controls="collapseTwo">
                Bagaimana cara melihat layanan yang pernah saya ajukan?
            </button>
        </h2>
        <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#helper">
            <div class="accordion-body">
                <div>1. Akses menu "Histori Layanan"</div>
                <div>2. Pengajuan layanan yang pernah diajukan akan tampil di sini</div>
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree"
                aria-expanded="true" aria-controls="collapseThree">
                Bagaimana cara melihat pembayaran yang pernah saya lakukan?
            </button>
        </h2>
        <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#helper">
            <div class="accordion-body">
                <div>1. Akses menu "Histori Pembayaran"</div>
                <div>2. Pembayaran yang pernah dilakukan akan tampil di sini</div>
            </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour"
                aria-expanded="true" aria-controls="collapseFour">
                Bagaimana cara melihat tagihan dan melakukan pembayaran?
            </button>
        </h2>
        <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#helper">
            <div class="accordion-body">
                <div>1. Akses menu "Bayar Tagihan"</div>
                <div>2. Akan ditampilkan daftarpengajuan layanan yang perlu dibayar beserta biaya sewa kos yang belum dibayar</div>
                <div>3. Pilih tagihan yang ingin di bayar dan aplikasi akan menampilkan total tagihan</div>
                <div>4. Tekan tombol "Bayar" untuk memproses pembayaran</div>
            </div>
        </div>
    </div>
    `;
}

document.querySelector("#back").addEventListener("click", e => {
    goBack();
});

