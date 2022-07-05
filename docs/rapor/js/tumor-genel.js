/*jshint esversion: 6 */

// darkmode
function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}


window.onload = function () {
    document.getElementById("tani").focus();
};

setInterval(function () {
    'window.location.reload()';
  eraseAll();
}, 900000);

function generateTumorReport() {


  // Tanı
  var tani = document.getElementById("tani").value;

    // Spesmen
  var spesmen = document.getElementById("spesmen").value;


  // Ameliyat Şekli
  var ameliyat = document.getElementById("ameliyat").value;


  // Lokalizasyon
  var checkedlokalizasyon = document.querySelectorAll('#lokalizasyon :checked');
  var lokalizasyon = [...checkedlokalizasyon].map(option => option.value);

  
  // Perforasyon
  var perforasyon = document.getElementById("perforasyon");
var perforasyonvalue = perforasyon.options[perforasyon.selectedIndex].value;
var perforasyontext = perforasyon.options[perforasyon.selectedIndex].text;




  // Histolojik Tip
var histolojiktip = document.getElementById("histolojiktip").value;

  // derece   
  var xderece = document.getElementById("derece");
  var derecevalue = xderece.options[xderece.selectedIndex].value;

  if (derecevalue != "") {
      var derece = xderece.options[xderece.selectedIndex].text;
  }
  if (derecevalue == "") {
      var derece = "TÜMÖR DERECESİNİ BELİRTİNİZ";
  }

// LVI
var lvi = document.getElementById("lvi");
var lvivalue = lvi.options[lvi.selectedIndex].value;
var lvitext = lvi.options[lvi.selectedIndex].text;

// venöz invazyon
var venozinvazyon = document.getElementById("venozinvazyon");
var venozinvazyonvalue = venozinvazyon.options[venozinvazyon.selectedIndex].value;
var venozinvazyontext = venozinvazyon.options[venozinvazyon.selectedIndex].text;  
  
  
// PNI
var pni = document.getElementById("pni");
var pnivalue = pni.options[pni.selectedIndex].value;
var pnitext = pni.options[pni.selectedIndex].text;

// Tümör boyutu
var tumorboyutu = document.getElementById("tumorboyutu").value;
var tumorboyutubirim = document.getElementById("tumorboyutubirim").value;

  // Invaziv tumor boyutu
var invazivtumorboyutu = document.getElementById("invazivtumorboyutu").value;
var invazivtumorboyutubirim = document.getElementById("invazivtumorboyutubirim").value;

// Mikroskopik yayılım
var mikroskopikyayilimchecked = document.querySelectorAll('#mikroskopikyayilim :checked');
  var mikroskopikyayilim = [...mikroskopikyayilimchecked].map(option => option.text);

  // Tumor Evresi  
  var xtumorevresi = document.getElementById("tumorevresi");
  var tumorevresivalue = xtumorevresi.options[xtumorevresi.selectedIndex].value;

  if (tumorevresivalue != "") {
      var tumorevresi = xtumorevresi.options[xtumorevresi.selectedIndex].text;
  }
  if (tumorevresivalue == "") {
      var tumorevresi = "TÜMÖR EVRESİNİ BELİRTİNİZ";
  }

  // Toplam LN
var metastatikln = document.getElementById("metastatikln").value;
var reaktifln = document.getElementById("reaktifln").value;
var toplamln = parseInt(metastatikln) + parseInt(reaktifln);

  // Lenf Nodu Evresi  
  var xpN = document.getElementById("pN");
  var pNvalue = xpN.options[xpN.selectedIndex].value;

  if (pNvalue != "") {
      var pN = xpN.options[xpN.selectedIndex].text;
  }
  if (pNvalue == "") {
      var pN = "LENF NODU EVRESİNİ BELİRTİNİZ";
  }  
  
  
  // Tumor Depozit
  var tumordepozit = document.getElementById("tumordepozit").value;
  
  // Cerrahi Öncesi Tedavi
  var cerrahioncesitedavi = document.getElementById("cerrahioncesitedavi");
var cerrahioncesitedavivalue = cerrahioncesitedavi.options[cerrahioncesitedavi.selectedIndex].value;
var cerrahioncesitedavitext = cerrahioncesitedavi.options[cerrahioncesitedavi.selectedIndex].text;
  
  // Tumor Tomurcuk

var tumortomurcuk = document.getElementById("tumortomurcuk").value;
  
  // Cerrahi Sınır

// var proksimalmukozalcerrahisinir = document.getElementById("proksimalmukozalcerrahisinir").value;
  var proksimalmukozalcerrahisinir = document.getElementById("proksimalmukozalcerrahisinir");
var proksimalmukozalcerrahisinirvalue = proksimalmukozalcerrahisinir.options[proksimalmukozalcerrahisinir.selectedIndex].value;
var proksimalmukozalcerrahisinirtext = proksimalmukozalcerrahisinir.options[proksimalmukozalcerrahisinir.selectedIndex].text;

// var distalmukozalcerrahisinir = document.getElementById("distalmukozalcerrahisinir").value;
var distalmukozalcerrahisinir = document.getElementById("distalmukozalcerrahisinir");
var distalmukozalcerrahisinirvalue = distalmukozalcerrahisinir.options[distalmukozalcerrahisinir.selectedIndex].value;
var distalmukozalcerrahisinirtext = distalmukozalcerrahisinir.options[distalmukozalcerrahisinir.selectedIndex].text;

  // pankreasparankimcerrahisinir
  var pankreasparankimcerrahisinir = document.getElementById("pankreasparankimcerrahisinir");
var pankreasparankimcerrahisinirvalue = pankreasparankimcerrahisinir.options[pankreasparankimcerrahisinir.selectedIndex].value;
  var pankreasparankimcerrahisinirtext = pankreasparankimcerrahisinir.options[pankreasparankimcerrahisinir.selectedIndex].text;
  
  // duktuscerrahisinir
  var duktuscerrahisinir = document.getElementById("duktuscerrahisinir");
var duktuscerrahisinirvalue = duktuscerrahisinir.options[duktuscerrahisinir.selectedIndex].value;
  var duktuscerrahisinirtext = duktuscerrahisinir.options[duktuscerrahisinir.selectedIndex].text;
  
  // retroperitoncerrahisinir
  var retroperitoncerrahisinir = document.getElementById("retroperitoncerrahisinir");
var retroperitoncerrahisinirvalue = retroperitoncerrahisinir.options[retroperitoncerrahisinir.selectedIndex].value;
var retroperitoncerrahisinirtext = retroperitoncerrahisinir.options[retroperitoncerrahisinir.selectedIndex].text;

// yakincs
  var yakincs = document.getElementById("yakincs").value;
  
  // diger
  var diger = document.getElementById("diger").value;

  // Yorum
  var yorum = document.getElementById("yorum").value;
  
  
  // Plain Report
  var tumorReport =
    spesmen + "; " + ameliyat + ":" + "\n" +
    "Tanı: " + tani + "... pT pN , pMMR (MMR ekspresyonu korunmuştur), HER2" + "\n" +
    "- Yapılan İşlem (Ameliyat Şekli): " + ameliyat + "\n" +
    "- Makroskopik Perforasyon: " + perforasyontext + "\n" +
    "- Tümör Lokalizasyonu: " + lokalizasyon + "\n" +
    "- Tümör Boyutu: " + tumorboyutu + " " + tumorboyutubirim + "\n" +
    "- İnvaziv Tümör Boyutu: " + invazivtumorboyutu + " " + invazivtumorboyutubirim + "\n" +
    "- Preinvaziv Tümör Boyutu: " + "\n" +
    "- Mikroskopik Tümör Yayılımı: " + mikroskopikyayilim + "\n" +
    "- Tümör Evresi: " + tumorevresi + "\n" +
    "- Histolojik Tip: " + histolojiktip + "\n" +
    "- Preinvaziv Tümör (Tümörün geliştiği polip) Tipi: " + "\n" +
    "- Histolojik Derece: " + derece + "\n" +
    "- Lenfovasküler İnvazyon: " + lvitext + "\n" +
    "- Venöz İnvazyon: " + venozinvazyontext + "\n" +
    "- Perinöryal İnvazyon: " + pnitext + "\n" +
    "- Tümör nekrozu: " + "\n" +
    "- Bölgesel Lenf Nodları (Toplam sayı): " + toplamln + "\n" +
    "    - Metastatik Lenf Nodları: " + metastatikln + " " + pN + "\n" +
    "    - Reaktif Lenf Nodları: " + reaktifln + "\n" +
    "- Tümör Depoziti: " + tumordepozit + "\n" +
    "- Cerrahi Öncesi Tedavi: " + cerrahioncesitedavitext + "\n" +
    "- Tümör Tomurcuklanması: " + tumortomurcuk + "\n" +
    "- Tümör içi/çevresi inflamasyon: " + "\n" +
    "- Cerrahi Sınırlar: " + "\n" +
    "    - Proksimal Mukozal Cerrahi Sınır: " + proksimalmukozalcerrahisinirtext + "\n" +
    "    - Distal Mukozal Cerrahi Sınır: " + distalmukozalcerrahisinirtext + "\n" +
    "    - Pankreas Parakim Cerrahi Sınır: " + pankreasparankimcerrahisinirtext + "\n" +
    "    - Duktus Cerrahi Sınır: " + duktuscerrahisinirtext + "\n" +
    "    - Retroperiton Cerrahi Sınır: " + retroperitoncerrahisinirtext + "\n" +
    "    - Yakın Cerrahi Sınır: " + yakincs + "\n" +
    "- Çevre Doku: " + diger + "\n" + "\n" +
    "- Yorum: " + yorum + "\n";

  document.getElementById("plainReport").value = tumorReport;

}

function eraseAll() {

  document.getElementById("plainReport").value = "";
  document.getElementById("tani").value = document.getElementById("tani").defaultValue;
document.getElementById("tani").value = "";
// document.getElementById("ameliyat").value = "";
// document.getElementById("lokalizasyon").value = "";
// document.getElementById("perforasyon").value = "";
// document.getElementById("histolojiktip").value = "";
document.getElementById("derece").value = document.getElementById("derece").defaultValue;
document.getElementById("lvi").value = document.getElementById("lvi").defaultValue;
// document.getElementById("pni").value = "";
// document.getElementById("tumorboyutu").value = "";
// document.getElementById("invazivtumorboyutu").value = "";
// document.getElementById("mikroskopikyayilim").value = "";
// document.getElementById("tumorevresi").value = "";
// document.getElementById("toplamln").value = "";
// document.getElementById("metastatikln").value = "";
// document.getElementById("reaktifln").value = "";
// document.getElementById("tumordepozit").value = "";
// document.getElementById("cerrahioncesitedavi").value = "";
// document.getElementById("tumortomurcuk").value = "";
// document.getElementById("cerrahisinir").value = "";
// document.getElementById("proksimalcerrahisinir").value = "";
// document.getElementById("distalcerrahisinir").value = "";
  // location.reload();
  window.location.reload(true);
}

function copyReport() {
  var copyText = document.getElementById("plainReport");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

}


