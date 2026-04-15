window.Module = {
onRuntimeInitialized() {
document.getElementById("statusText").textContent="Ready";
document.getElementById("statusDot").style.background="#22c55e";
initApp();
}
};

function initApp(){

const imageInput=document.getElementById("imageInput");
const globalT=document.getElementById("globalT");
const blockSize=document.getElementById("blockSize");
const cValue=document.getElementById("cValue");

const tVal=document.getElementById("tVal");
const bVal=document.getElementById("bVal");
const cVal=document.getElementById("cVal");
const otsuVal=document.getElementById("otsuVal");

const originalCanvas=document.getElementById("originalCanvas");
const binaryCanvas=document.getElementById("binaryCanvas");
const otsuCanvas=document.getElementById("otsuCanvas");
const meanCanvas=document.getElementById("meanCanvas");
const gaussCanvas=document.getElementById("gaussCanvas");

let gray=null;

function setProcessing(){
document.getElementById("statusText").textContent="Processing...";
document.getElementById("statusDot").style.background="#ef4444";
}
function setReady(){
document.getElementById("statusText").textContent="Ready";
document.getElementById("statusDot").style.background="#22c55e";
}

imageInput.addEventListener("change", e=>{
let img=new Image();
img.onload=()=>{
originalCanvas.width=img.width;
originalCanvas.height=img.height;
originalCanvas.getContext("2d").drawImage(img,0,0);
let mat=cv.imread(originalCanvas);
gray=new cv.Mat();
cv.cvtColor(mat,gray,cv.COLOR_RGBA2GRAY);
mat.delete();
process();
};
img.src=URL.createObjectURL(e.target.files[0]);
});

globalT.oninput=()=>{tVal.textContent=globalT.value;process();}
blockSize.oninput=()=>{bVal.textContent=blockSize.value;process();}
cValue.oninput=()=>{cVal.textContent=cValue.value;process();}

function process(){
if(!gray) return;
setProcessing();

cv.imshow(originalCanvas,gray);

// Binary Manual
let binary=new cv.Mat();
cv.threshold(gray,binary,parseInt(globalT.value),255,cv.THRESH_BINARY);
cv.imshow(binaryCanvas,binary);

// Otsu
let otsu=new cv.Mat();
let ret=cv.threshold(gray,otsu,0,255,cv.THRESH_BINARY+cv.THRESH_OTSU);
otsuVal.textContent=ret.toFixed(2);
cv.imshow(otsuCanvas,otsu);

// Adaptive Mean
let mean=new cv.Mat();
cv.adaptiveThreshold(gray,mean,255,
cv.ADAPTIVE_THRESH_MEAN_C,
cv.THRESH_BINARY,
parseInt(blockSize.value),
parseInt(cValue.value));
cv.imshow(meanCanvas,mean);

// Adaptive Gaussian
let gauss=new cv.Mat();
cv.adaptiveThreshold(gray,gauss,255,
cv.ADAPTIVE_THRESH_GAUSSIAN_C,
cv.THRESH_BINARY,
parseInt(blockSize.value),
parseInt(cValue.value));
cv.imshow(gaussCanvas,gauss);

binary.delete();
otsu.delete();
mean.delete();
gauss.delete();

setReady();
}

}
