let currentStage = 0;
let analysisData = {
    width: 400,
    height: 400,
    aspectRatio: 1.0,
    subject: "Portrait / Face Reference"
};

const drawingStages = [
    {
        title: "Overall Bounding Box & Outer Framing",
        grip: "Pencil Grip: Tripod Grip (Very light pressure)",
        desc: "Examine your reference photo on screen. On your physical paper, lightly sketch a bounding box matching the exact outer boundaries of your subject to lock in proportions."
    },
    {
        title: "Centerlines & Symmetry Axes",
        grip: "Pencil Grip: Tripod Grip (Light pressure)",
        desc: "Draw a vertical center line straight down the middle and horizontal crosshairs across your paper box. This prevents any lopsided features."
    },
    {
        title: "3D Primitive Volumes (Spheres & Boxes)",
        grip: "Pencil Grip: Extended Tripod Grip",
        desc: "Break down the analyzed image masses into basic 3D shapes: spheres for heads/main masses and rectangular blocks for lower structures."
    },
    {
        title: "Contour Bending & Organic Flow",
        grip: "Pencil Grip: Extended Overhand Grip",
        desc: "Smooth out your geometric shapes into organic curves following the gesture and silhouette of your scanned image."
    },
    {
        title: "Landmark Feature Mapping",
        grip: "Pencil Grip: Standard Writing Grip",
        desc: "Map out the primary focal points (eyes, central features, or core object edges) using your crosshairs as a coordinate map."
    },
    {
        title: "Clean Outlines & Edge Refinement",
        grip: "Pencil Grip: Sharp HB Pencil (Tripod Grip)",
        desc: "Draw confident final contour outlines over your construction lines and gently erase overlapping guidelines."
    },
    {
        title: "Light Mapping & Shadow Boundaries",
        grip: "Pencil Grip: Overhead Grip (Holding from the back)",
        desc: "Scan the lighting on your reference photo. Lightly outline the exact boundary shapes where light stops and shadows begin."
    },
    {
        title: "Base Midtone Gradients",
        grip: "Pencil Grip: Super Overhand Loose Grip (2B Pencil)",
        desc: "Using the side of your pencil lead, lay down smooth, uniform midtone gradient layers across all shadow regions."
    },
    {
        title: "Core Shadows & Deep Occlusion",
        grip: "Pencil Grip: Precision Tripod Grip (8B/10B)",
        desc: "Deepen core shadows and occlusion areas where objects touch or overlap to give your paper drawing rich 3D weight."
    },
    {
        title: "Highlights, Polish & Final Review",
        grip: "Tool: Kneaded Eraser / White Gel Pen",
        desc: "Lift out glowing highlights with an eraser, check your overall tonal contrast against the screen reference, and sign your completed artwork!"
    }
];

const refCanvas = document.getElementById('refCanvas');
const guideCanvas = document.getElementById('guideCanvas');
const refCtx = refCanvas.getContext('2d');
const guideCtx = guideCanvas.getContext('2d');
let uploadedImage = new Image();

window.addEventListener('DOMContentLoaded', () => {
    initCanvasSize();
    setupEventListeners();
    renderStagesList();
    loadPreset('portrait');
});

function initCanvasSize() {
    refCanvas.width = 400;
    refCanvas.height = 400;
    guideCanvas.width = 400;
    guideCanvas.height = 400;
}

function setupEventListeners() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            loadPreset(e.target.dataset.preset);
        });
    });

    document.getElementById('imageInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedImage.onload = () => {
                    analyzeImagePixels();
                    processAndDisplayImage();
                };
                uploadedImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentStage > 0) {
            currentStage--;
            updateStage();
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentStage < drawingStages.length - 1) {
            currentStage++;
            updateStage();
        }
    });
}

function analyzeImagePixels() {
    const w = uploadedImage.width;
    const h = uploadedImage.height;
    analysisData.width = w;
    analysisData.height = h;
    analysisData.aspectRatio = (w / h).toFixed(2);

    if (w / h < 0.85) {
        analysisData.subject = "Tall Subject / Full Body";
    } else if (w / h > 1.15) {
        analysisData.subject = "Landscape / Wide Object";
    } else {
        analysisData.subject = "Portrait / Face Reference";
    }

    document.getElementById('aiStatus').textContent = "AI Vision Scan Active ✓";
    document.getElementById('statDim').textContent = `${w} x ${h}px`;
    document.getElementById('statSubject').textContent = analysisData.subject;
    document.getElementById('statComplex').textContent = analysisData.aspectRatio;
}

function loadPreset(type) {
    const svgData = getPresetSvg(type);
    const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    uploadedImage.onload = () => {
        analyzeImagePixels();
        processAndDisplayImage();
    };
    uploadedImage.src = url;
}

function getPresetSvg(type) {
    if (type === 'portrait') {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
            <rect width="400" height="400" fill="#1e293b"/>
            <circle cx="200" cy="150" r="75" fill="#cbd5e1" opacity="0.8"/>
            <path d="M 130 210 Q 200 310 270 210 Z" fill="#94a3b8"/>
            <ellipse cx="170" cy="140" rx="10" ry="7" fill="#0f172a"/>
            <ellipse cx="230" cy="140" rx="10" ry="7" fill="#0f172a"/>
            <path d="M 200 150 L 195 190 L 205 190 Z" fill="#64748b"/>
            <path d="M 175 225 Q 200 245 225 225" stroke="#0f172a" stroke-width="3" fill="none"/>
        </svg>`;
    } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
            <rect width="400" height="400" fill="#1e293b"/>
            <ellipse cx="200" cy="120" rx="60" ry="25" fill="#60a5fa"/>
            <path d="M 140 120 L 140 280 A 60 25 0 0 0 260 280 L 260 120 Z" fill="#3b82f6"/>
            <ellipse cx="200" cy="280" rx="60" ry="25" fill="#2563eb"/>
        </svg>`;
    }
}

function processAndDisplayImage() {
    refCtx.clearRect(0, 0, refCanvas.width, refCanvas.height);
    refCtx.drawImage(uploadedImage, 0, 0, refCanvas.width, refCanvas.height);
    redrawGuideCanvas();
}

function redrawGuideCanvas() {
    guideCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
    
    guideCtx.globalAlpha = 0.28;
    guideCtx.drawImage(uploadedImage, 0, 0, guideCanvas.width, guideCanvas.height);
    guideCtx.globalAlpha = 1.0;

    guideCtx.save();
    guideCtx.lineWidth = 2.5;

    const ar = parseFloat(analysisData.aspectRatio) || 1.0;
    let boxW = 240, boxH = 240;
    if (ar > 1) { boxH = boxW / ar; } else { boxW = boxH * ar; }
    const startX = (400 - boxW) / 2;
    const startY = (400 - boxH) / 2;

    if (currentStage === 0) {
        guideCtx.strokeStyle = '#3b82f6';
        guideCtx.setLineDash([6, 6]);
        guideCtx.strokeRect(startX, startY, boxW, boxH);
    } else if (currentStage === 1) {
        guideCtx.strokeStyle = '#ef4444';
        guideCtx.setLineDash([4, 4]);
        guideCtx.beginPath();
        guideCtx.moveTo(200, startY); guideCtx.lineTo(200, startY + boxH);
        guideCtx.moveTo(startX, 200); guideCtx.lineTo(startX + boxW, 200);
        guideCtx.stroke();
    } else if (currentStage === 2) {
        guideCtx.strokeStyle = '#60a5fa';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.arc(200, startY + boxH * 0.4, boxH * 0.28, 0, Math.PI * 2);
        guideCtx.stroke();
        guideCtx.strokeRect(startX + boxW * 0.2, startY + boxH * 0.6, boxW * 0.6, boxH * 0.35);
    } else if (currentStage === 3) {
        guideCtx.strokeStyle = '#38bdf8';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.moveTo(startX + boxW * 0.2, startY + boxH * 0.4);
        guideCtx.quadraticCurveTo(200, startY, startX + boxW * 0.8, startY + boxH * 0.4);
        guideCtx.quadraticCurveTo(startX + boxW * 0.9, startY + boxH * 0.7, startX + boxW * 0.75, startY + boxH * 0.95);
        guideCtx.quadraticCurveTo(200, startY + boxH * 1.05, startX + boxW * 0.25, startY + boxH * 0.95);
        guideCtx.quadraticCurveTo(startX + boxW * 0.1, startY + boxH * 0.7, startX + boxW * 0.2, startY + boxH * 0.4);
        guideCtx.stroke();
    } else if (currentStage === 4) {
        guideCtx.strokeStyle = '#a855f7';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.arc(200 - boxW * 0.18, startY + boxH * 0.42, 12, 0, Math.PI * 2);
        guideCtx.arc(200 + boxW * 0.18, startY + boxH * 0.42, 12, 0, Math.PI * 2);
        guideCtx.moveTo(195, startY + boxH * 0.58); guideCtx.lineTo(200, startY + boxH * 0.65); guideCtx.lineTo(205, startY + boxH * 0.58);
        guideCtx.stroke();
    } else if (currentStage === 5) {
        guideCtx.strokeStyle = '#22c55e';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.arc(200, startY + boxH * 0.4, boxH * 0.28, 0, Math.PI * 2);
        guideCtx.moveTo(startX + boxW * 0.15, startY + boxH * 0.55); guideCtx.lineTo(startX + boxW * 0.15, startY + boxH * 0.95);
        guideCtx.moveTo(startX + boxW * 0.85, startY + boxH * 0.55); guideCtx.lineTo(startX + boxW * 0.85, startY + boxH * 0.95);
        guideCtx.stroke();
    } else {
        guideCtx.strokeStyle = '#facc15';
        guideCtx.setLineDash([]);
        guideCtx.strokeRect(startX + boxW * 0.2, startY + boxH * 0.5, boxW * 0.6, boxH * 0.45);
    }
    
    guideCtx.restore();
}

function renderStagesList() {
    const list = document.getElementById('stagesList');
    list.innerHTML = '';
    drawingStages.forEach((stage, index) => {
        const item = document.createElement('div');
        item.className = `stage-item ${index === currentStage ? 'active' : ''}`;
        item.textContent = `${index + 1}. ${stage.title}`;
        item.addEventListener('click', () => {
            currentStage = index;
            updateStage();
        });
        list.appendChild(item);
    });
}

function updateStage() {
    document.getElementById('stageTitle').textContent = drawingStages[currentStage].title;
    document.getElementById('stepCounterBadge').textContent = `Step ${currentStage + 1} of 10`;
    document.getElementById('gripTipText').textContent = drawingStages[currentStage].grip;
    document.getElementById('instructionText').textContent = drawingStages[currentStage].desc;
    renderStagesList();
    redrawGuideCanvas();
}
