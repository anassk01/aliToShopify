// Extract the title
const titleElement = document.querySelector('#root > div > div.pdp-body.pdp-wrap > div > div.pdp-body-top-left > div.pdp-info > div.pdp-info-right > div.title--wrap--UUHae_g > h1');
let title = titleElement.innerText;
const handle = title.replace(/\s/g, "-");


// Get the price
let price = "";
const priceElement = document.querySelector('#root > div > div.pdp-body.pdp-wrap > div > div.pdp-body-top-left > div.pdp-info > div.pdp-info-right > div.price--wrap--Z6Vjgmp.product-price > div.price--current--I3Zeidd.product-price-current > span');
if (priceElement) {
    const priceText = priceElement.innerText;
    price = priceText.replace(',', '.');
}

// Extract alt text from variant 1 elements
const variantAltTexts = Array.from(document.querySelectorAll("#root > div > div.pdp-body.pdp-wrap > div > div.pdp-body-top-left > div.pdp-info > div.pdp-info-right > div.sku--wrap--xgoW06M > div > div:nth-child(1) > div.sku-item--box--Lrl6ZXB *> img"), element => element.getAttribute('alt'));

// Extract inner text from variant option 2 elements
const variantOptionTexts = Array.from(document.querySelectorAll("#root > div > div.pdp-body.pdp-wrap > div > div.pdp-body-top-left > div.pdp-info > div.pdp-info-right > div.sku--wrap--xgoW06M > div > div:nth-child(2) > div.sku-item--box--Lrl6ZXB * > span"), element => element.innerText);

// Extract image URLs
const imageUrls = Array.from(new Set(Array.from(document.querySelectorAll("#root > div > div.pdp-body.pdp-wrap > div > div.pdp-body-top-left > div.pdp-info > div.pdp-info-left > div > div > div.slider--wrap--krlZ7X9 img"), element => element.getAttribute('src').replace(/\d+x\d+\.jpg_./, '.'))));

const imageIndices = Array.from({ length: imageUrls.length }, (_, i) => i + 1);


// Extract values for option 1 and option 2
const option1 = document.querySelector("#root > div > div.pdp-body.pdp-wrap > div > div.pdp-body-top-left > div.pdp-info > div.pdp-info-right > div.sku--wrap--xgoW06M > div > div:nth-child(1) > div.sku-item--title--Z0HLO87 > span");
const option2 = document.querySelector("#root > div > div.pdp-body.pdp-wrap > div > div.pdp-body-top-left > div.pdp-info > div.pdp-info-right > div.sku--wrap--xgoW06M > div > div:nth-child(2) > div.sku-item--title--Z0HLO87 > span:nth-child(1");

// Function to extract text before colon
const extractText = (element) => {
    if (element) {
        const text = element.innerText.trim();
        const colonIndex = text.indexOf(":");
        if (colonIndex !== -1) {
            return text.substring(0, colonIndex + 1);
        } else {
            return "Colon not found in the text.";
        }
    } else {
        return "Element not found.";
    }
};

let option1Value = extractText(option1);
let option2Value = extractText(option2);


function extractNumbers(text) {
    return text.match(/\d+(\.\d+)?/g).map(numStr => parseFloat(numStr));
}

// Create the CSV content
let csvContent = "data:text/csv;charset=utf-8,";

// Add title and price in the first row
csvContent += `Handle,Title,Body (HTML),Vendor,Product Category,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src ,Image position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Included / United States,Price / United States,Compare At Price / United States,Included / International,Price / International,Compare At Price / International,Included / europe,Price / europe,Compare At Price / europe,Status,\n`;

let Vendor="Tidalyx"
let Published="TRUE"
let imageIndex = 0;
let giftCard="FALSE";
let includedUS="TRUE";
let includedInternational="TRUE";
let includedEurope="TRUE";
let Status="active";
for (let i = 0; i < variantAltTexts.length; i++) {
    for (let j = 0; j < variantOptionTexts.length; j++) {
        csvContent += `${handle},${title},"",${Vendor},"","","",${Published},${option1Value},${variantAltTexts[i]},${option2Value},${variantOptionTexts[j]},"","","","","","0","deny","manual",${extractNumbers(price)+17 },${ (extractNumbers(price)+17)*1.5},"TRUE","TRUE","",""`;
        Vendor="";
        Published="";
        title="";
        Vendor="";
        option1Value="";
        option2Value="";
        if (imageIndex < imageUrls.length) {
               csvContent += `${imageUrls[imageIndex]},${imageIndices[imageIndex]}`;
                imageIndex++;
         } else {
                csvContent += ",";
         }
         csvContent+=  `,"",${giftCard},"","","","","","","","","","","","","","",lb,"","","${includedUS}","","","${includedInternational}","","","${includedEurope}","","",${Status}\n`;
         giftCard="";
         includedUS="";
         includedInternational="";
         includedEurope="";
         Status="";
    }
}

// Create a download link
const encodedUri = encodeURI(csvContent);
const link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "product_data.csv");
document.body.appendChild(link);

// Click the download link to download the CSV file
link.click();
