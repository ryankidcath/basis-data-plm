/**
 * Data wilayah Kabupaten Cirebon (kecamatan dan kelurahan/desa).
 * Sumber: Wikipedia - Daftar kecamatan dan kelurahan di Kabupaten Cirebon.
 */

export const KABUPATEN_CIREBON = "Kabupaten Cirebon";

export interface WilayahKecamatan {
  kecamatan: string;
  desa: string[];
}

export const WILAYAH_CIREBON: WilayahKecamatan[] = [
  { kecamatan: "Arjawinangun", desa: ["Arjawinangun", "Bulak", "Geyongan", "Jungjang", "Jungjang Wetan", "Karangsambung", "Kebonturi", "Rawagatel", "Sende", "Tegalgubug", "Tegalgubug Lor"] },
  { kecamatan: "Astanajapura", desa: ["Astanajapura", "Buntet", "Japura Kidul", "Japurabakti", "Kanci", "Kanci Kulon", "Kendal", "Mertapada Kulon", "Mertapada Wetan", "Munjul", "Sidamulya"] },
  { kecamatan: "Babakan", desa: ["Babakan", "Babakangebang", "Bojonggebang", "Cangkuang", "Gembongan", "Gembonganmekar", "Karangwangun", "Kudukeras", "Kudumulya", "Pakusamben", "Serang Kulon", "Serang Wetan", "Sumber Kidul", "Sumber Lor"] },
  { kecamatan: "Beber", desa: ["Beber", "Ciawigajah", "Cikancas", "Cipinang", "Halimpu", "Kondangsari", "Patapan", "Sindanghayu", "Sindangkasih", "Wanayasa"] },
  { kecamatan: "Ciledug", desa: ["Bojongnegara", "Ciledug Kulon", "Ciledug Lor", "Ciledug Tengah", "Ciledug Wetan", "Damarguna", "Jatiseeng", "Jatiseeng Kidul", "Leuweunggajah", "Tenjomaya"] },
  { kecamatan: "Ciwaringin", desa: ["Babakan", "Bringin", "Budur", "Ciwaringin", "Galagamba", "Gintung Kidul", "Gintung Tengah", "Gintungranjeng"] },
  { kecamatan: "Depok", desa: ["Cikeduk", "Depok", "Getasan", "Karangwangi", "Kasugengan Kidul", "Kasugengan Lor", "Keduanan", "Kejuden", "Warugede", "Warujaya", "Warukawung", "Waruroyom"] },
  { kecamatan: "Dukupuntang", desa: ["Balad", "Bobos", "Cangkoak", "Cikalahang", "Cipanas", "Cisaat", "Dukupuntang", "Girinata", "Kedongdong Kidul", "Kepunduan", "Mandala", "Sindangjawa", "Sindangmekar"] },
  { kecamatan: "Gebang", desa: ["Dompyong Kulon", "Dompyong Wetan", "Gagasari", "Gebang", "Gebangilir", "Gebangkulon", "Gebangmekar", "Gebangudik", "Kalimaro", "Kalimekar", "Kalipasung", "Melakasari", "Pelayangan"] },
  { kecamatan: "Gegesik", desa: ["Bayalangu Kidul", "Bayalangu Lor", "Gegesik Kidul", "Gegesik Kulon", "Gegesik Lor", "Gegesik Wetan", "Jagapura Kidul", "Jagapura Kulon", "Jagapura Lor", "Jagapura Wetan", "Kedungdalem", "Panunggul", "Sibubut", "Slendra"] },
  { kecamatan: "Gempol", desa: ["Cikeusal", "Cupang", "Gempol", "Kedungbunder", "Kempek", "Palimanan Barat", "Walahar", "Winong"] },
  { kecamatan: "Greged", desa: ["Durajaya", "Greged", "Gumulunglebak", "Gumulungtonggoh", "Jatipancur", "Kamarang", "Kamarang Lebak", "Lebakmekar", "Nanggela", "Sindangkempeng"] },
  { kecamatan: "Gunungjati", desa: ["Adidharma", "Astana", "Babadan", "Buyut", "Grogol", "Jadimulya", "Jatimerta", "Kalisapu", "Klayan", "Mayung", "Mertasinga", "Pasindangan", "Sambeng", "Sirnabaya", "Wanakaya"] },
  { kecamatan: "Jamblang", desa: ["Bakung Kidul", "Bakung Lor", "Bojong Lor", "Bojong Wetan", "Jamblang", "Orimalang", "Sitiwinangun", "Wangunharja"] },
  { kecamatan: "Kaliwedi", desa: ["Guwa Kidul", "Guwa Lor", "Kalideres", "Kaliwedi Kidul", "Kaliwedi Lor", "Prajawinangun Kulon", "Prajawinangun Wetan", "Ujungsemi", "Wargabinangun"] },
  { kecamatan: "Kapetakan", desa: ["Bungko", "Bungko Lor", "Dukuh", "Grogol", "Kapetakan", "Karangkendal", "Kertasura", "Pegagan Kidul", "Pegagan Lor"] },
  { kecamatan: "Karangsembung", desa: ["Kalimeang", "Karangmalang", "Karangmekar", "Karangsembung", "Karangsuwung", "Karangtengah", "Kubangkarang", "Tambelang"] },
  { kecamatan: "Karangwareng", desa: ["Blender", "Jatipiring", "Karanganyar", "Karangasem", "Karangwangi", "Karangwareng", "Kubangdeleg", "Seuseupan", "Sumurkondang"] },
  { kecamatan: "Kedawung", desa: ["Kalikoa", "Kedawung", "Kedungdawa", "Kedungjaya", "Kertawinangun", "Pilangsari", "Sutawinangun", "Tuk"] },
  { kecamatan: "Klangenan", desa: ["Bangodua", "Danawinangun", "Jemaras Kidul", "Jemaras Lor", "Klangenan", "Kreyo", "Pekantingan", "Serang", "Slangit"] },
  { kecamatan: "Lemahabang", desa: ["Asem", "Belawa", "Cipeujeuh Kulon", "Cipeujeuh Wetan", "Lemahabang", "Lemahabang Kulon", "Leuwidingding", "Picungpugur", "Sarajaya", "Sigong", "Sindanglaut", "Tuk Karangsuwung", "Wangkelang"] },
  { kecamatan: "Losari", desa: ["Ambulu", "Astanalanggar", "Barisan", "Kalirahayu", "Kalisari", "Losari Kidul", "Losari Lor", "Mulyasari", "Panggangsari", "Tawangsari"] },
  { kecamatan: "Mundu", desa: ["Bandengan", "Banjarwangunan", "Citemu", "Luwung", "Mundumesigit", "Mundupesisir", "Pamengkang", "Penpen", "Setupatok", "Sinarancang", "Suci", "Waruduwur"] },
  { kecamatan: "Pabedilan", desa: ["Babakan Losari", "Babakan Losari Lor", "Dukuhwidara", "Kalibuntu", "Kalimukti", "Pabedilan Kaler", "Pabedilan Kidul", "Pabedilan Kulon", "Pabedilan Wetan", "Pasuruan", "Sidaresmi", "Silihasih", "Tersana"] },
  { kecamatan: "Pabuaran", desa: ["Hulubanteng", "Hulubanteng Lor", "Jatirenggang", "Pabuaran Kidul", "Pabuaran Lor", "Pabuaran Wetan", "Sukadana"] },
  { kecamatan: "Palimanan", desa: ["Balerante", "Beberan", "Cengkuang", "Ciawi", "Cilukrak", "Kepuh", "Lungbenda", "Palimanan Timur", "Panongan", "Pegagan", "Semplo", "Tegalkarang"] },
  { kecamatan: "Pangenan", desa: ["Astanamukti", "Bendungan", "Beringin", "Ender", "Getrakmoyan", "Japura Lor", "Pangenan", "Pangarengan", "Rawaurip"] },
  { kecamatan: "Panguragan", desa: ["Gujeg", "Kalianyar", "Karanganyar", "Kroya", "Lemahtamba", "Panguragan", "Panguragan Kulon", "Panguragan Lor", "Panguragan Wetan"] },
  { kecamatan: "Pasaleman", desa: ["Cigobang", "Cigobangwangi", "Cilengkrang", "Cilengkranggirang", "Pasaleman", "Tanjunganom", "Tonjong"] },
  { kecamatan: "Plered", desa: ["Cangkring", "Gamel", "Kaliwulu", "Panembahan", "Pangkalan", "Sarabau", "Tegalsari", "Trusmi Kulon", "Trusmi Wetan", "Wotgali"] },
  { kecamatan: "Plumbon", desa: ["Bodelor", "Bodesari", "Cempaka", "Danamulya", "Gombang", "Karangasem", "Karangmulya", "Kebarepan", "Kedungsana", "Lurah", "Marikangen", "Pamijahan", "Pasanggrahan", "Plumbon", "Purbawinangun"] },
  { kecamatan: "Sedong", desa: ["Karangwuni", "Kertawangun", "Panambangan", "Panongan", "Panongan Lor", "Putat", "Sedong Kidul", "Sedong Lor", "Winduhaji", "Windujaya"] },
  { kecamatan: "Sumber", desa: ["Babakan", "Gegunung", "Kaliwadas", "Kemantren", "Kenanga", "Matangaji", "Pasalakan", "Pejambon", "Perbutulan", "Sendang", "Sidawangi", "Sumber", "Tukmudal", "Watubelah"] },
  { kecamatan: "Suranenggala", desa: ["Karangreja", "Keraton", "Muara", "Purwawinangun", "Surakarta", "Suranenggala", "Suranenggala Kidul", "Suranenggala Kulon", "Suranenggala Lor"] },
  { kecamatan: "Susukan", desa: ["Bojong Kulon", "Bunder", "Gintung Lor", "Jatianom", "Jatipura", "Kedongdong", "Kejiwan", "Luwungkencana", "Susukan", "Tangkil", "Ujunggebang", "Wiyong"] },
  { kecamatan: "Susukanlebak", desa: ["Ciawiasih", "Ciawijapura", "Curug", "Curug Wetan", "Kaligawe", "Kaligawe Wetan", "Karangmanggu", "Pasawahan", "Sampih", "Susukanagung", "Susukanlebak", "Susukantonggoh", "Wilulang"] },
  { kecamatan: "Talun", desa: ["Cempaka", "Ciperna", "Cirebon Girang", "Kecomberan", "Kepongpongan", "Kerandon", "Kubang", "Sampiran", "Sarwadadi", "Wanasaba Kidul", "Wanasaba Lor"] },
  { kecamatan: "Tengah Tani", desa: ["Astapada", "Battembat", "Dawuan", "Gesik", "Kalibaru", "Kalitengah", "Kemlakagede", "Palir"] },
  { kecamatan: "Waled", desa: ["Ambit", "Cibogo", "Cikulak", "Cikulak Kidul", "Cisaat", "Ciuyah", "Gunungsari", "Karangsari", "Mekarsari", "Waledasem", "Waleddesa", "Waledkota"] },
  { kecamatan: "Weru", desa: ["Karangsari", "Kertasari", "Megu Cilik", "Megu Gede", "Setu Kulon", "Setu Wetan", "Tegalwangi", "Weru Kidul", "Weru Lor"] },
];

/** Daftar nama kecamatan (urutan seperti di WILAYAH_CIREBON) */
export const KECAMATAN_LIST = WILAYAH_CIREBON.map((w) => w.kecamatan);

/** Ambil daftar desa untuk satu kecamatan */
export function getDesaByKecamatan(kecamatan: string): string[] {
  const found = WILAYAH_CIREBON.find((w) => w.kecamatan === kecamatan);
  return found ? found.desa : [];
}
