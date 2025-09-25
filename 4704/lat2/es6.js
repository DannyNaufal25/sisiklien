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