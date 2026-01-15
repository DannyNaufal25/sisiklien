//buat object mahasiswa
const mahasiswa = {
    nim: "A11.2022.14492",
    nama: "Naufal Rizky Ramadhan",
    umur: 21,
    status: true,
    matKul:[
        {
            matkulId: 4704,
            matkulNama: "Pemsik",
            tugas: 85,
            uts: 100,
            uas: 90,
        },
        {
            matkulId: 4705,
            matkulNama: "PBO",
            tugas: 80,
            uts: 90,
            uas: 95,
        }
    ]
};

//buat array
const listMahasiswa = ["Naufal", "Rizky", "Ramadhan"];//array string

//array 2 object
const listMahasiswa2 = [
    {
    nim: "A11.2022.14492",
    nama: "Naufal Rizky Ramadhan",
    umur: 21,
    status: true,
    matKul:[
        {
            matkulId: 4704,
            matkulNama: "Pemsik",
            tugas: 85,
            uts: 100,
            uas: 90,
        },
        
    ]
},
{
    nim: "A11.2022.14493",
    nama: "Black Widow",
    umur: 21,
    status: true,
    matKul:[
        
        {
            matkulId: 4705,
            matkulNama: "PBO",
            tugas: 80,
            uts: 90,
            uas: 95,
        }
    ]
},
   
];

//tampilkan isi object mahasiswa
console.log(mahasiswa);

//tampilkan array
console.log(listMahasiswa);
console.log(listMahasiswa2);

//tampilkan index array 
console.log(listMahasiswa[0]);
console.log(listMahasiswa[1]);
console.log(listMahasiswa[2]);

//tampilkan key nama dari object mahasiswa
console.log(mahasiswa.nama);

//tampilkan umur dari listmahasiswa2 index ke 1
console.log(listMahasiswa2[1].umur);

//ES6 - Destructuring Object

//dest Object
const {nim, nama, umur, status, matKul} = mahasiswa;
console.log(nim);
console.log(nama);


//dest Array
const [dataNaufal, dataBlack] = listMahasiswa2;
console.log(dataNaufal);
console.log(dataBlack);

//destructuring array dari list matakuliah milik variable mahasiswa
const [dataPemsik, dataPBO] = matKul;
console.log(dataPemsik);
console.log(dataPBO);

const [matkul1, matkul2] = mahasiswa.matKul;
console.log(matkul1);
console.log(matkul2);

//ES6 - Spread Operator
const mhs2 = {
    nim: "A11.2022.14493",
    nama: "Black Widow",
    umur: 21,
    status: true,
    matKul:[
        
        {
            matkulId: 4705,
            matkulNama: "PBO",
            tugas: 80,
            uts: 90,
            uas: 95,
        }
    ]
};

const listMhs = {...mahasiswa, mhs2} 
console.log(listMhs);

//ES5 - Template literal
console.log("Nama saya " + nama + ", nim saya " + nim);
//ES6 - Template literal
console.log(`Nama saya ${nama}, nim saya ${nim}`);

//ES5 - function
function sum(a, b) {
    return a + b;
}
//ES6 - function
const jml=(a, b) => a + b;
console.log(`jumlah 10 + 9 = ${jml(10, 9)}`);

//ES6 - Array Method map, filter, reduce
//map
const listNamaMhs = listMahasiswa2.map((m) => m.nama);

console.log(listNamaMhs);

//filter
const mahasiswaAktif = listMahasiswa2.filter((m) => m.status === true);
console.log(mahasiswaAktif);

//reduce
const totalNilaiTugasAllMatkul= mahasiswa.matKul.reduce((total, m) => total + m.tugas, 0);
console.log(totalNilaiTugasAllMatkul);

//show all object mahasiswa
console.log(mahasiswa);

//add object mahasiswa baru

// 1. show() – Menampilkan semua data mahasiswa
function show() {
    listMahasiswa2.forEach((mhs, i) => {
        console.log(`Mahasiswa ke-${i + 1}:`);
        console.log(`NIM: ${mhs.nim}`);
        console.log(`Nama: ${mhs.nama}`);
        console.log(`Umur: ${mhs.umur}`);
        console.log(`Status: ${mhs.status ? "Aktif" : "Tidak Aktif"}`);
        console.log("Mata Kuliah:");
        mhs.matKul.forEach((mk) => {
            console.log(`  - ${mk.matkulNama} (Tugas: ${mk.tugas}, UTS: ${mk.uts}, UAS: ${mk.uas})`);
        });
        console.log("-----");
    });
}
// Contoh pemanggilan:
show();

// 2. add() – Menambah mahasiswa baru ke listMahasiswa2
function add(mahasiswaBaru) {
    listMahasiswa2.push(mahasiswaBaru);
    console.log('Mahasiswa baru berhasil ditambahkan:');
    console.log(mahasiswaBaru);
}
// Contoh pemanggilan:

add({
    nim: "A11.2022.14495",
    nama: "Peter Parker",
    umur: 20,
    status: true,
    matKul: [
        { matkulId: 4707, matkulNama: "Web Programming", tugas: 88, uts: 92, uas: 94 }
    ]
});

// 3. update() – Mengupdate informasi mahasiswa tertentu berdasarkan NIM
function update(nim, dataBaru) {
    const idx = listMahasiswa2.findIndex(mhs => mhs.nim === nim);
    if (idx !== -1) {
        listMahasiswa2[idx] = { ...listMahasiswa2[idx], ...dataBaru };
        console.log(`Data mahasiswa dengan NIM ${nim} berhasil diupdate.`);
        console.log(listMahasiswa2[idx]);
    } else {
        console.log(`Mahasiswa dengan NIM ${nim} tidak ditemukan.`);
    }
}
// Contoh pemanggilan:

update("A11.2022.14492", { nama: "Naufal Ramakkk", umur: 22 });

// 4. deleteById() – Menghapus mahasiswa berdasarkan NIM
function deleteById(nim) {
    const idx = listMahasiswa2.findIndex(mhs => mhs.nim === nim);
    if (idx !== -1) {
        const deleted = listMahasiswa2.splice(idx, 1);
        console.log(`Mahasiswa dengan NIM ${nim} berhasil dihapus.`);
        console.log(deleted[0]);
    } else {
        console.log(`Mahasiswa dengan NIM ${nim} tidak ditemukan.`);
    }
}
// Contoh pemanggilan:
deleteById("A11.2022.14495");




