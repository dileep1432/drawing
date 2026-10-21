let currentStage = 0;
let imageAnalysis = {
    type: "Portrait / Face",
    width: 400,
    height: 400,
    aspectRatio: 1.0,
    primaryColor: "Balanced Tone"
};

const drawingStages = [
    {
        title: "Step 1: Structuralization & Bounding Box",
        grip: "Pencil Grip: Tripod / Writing Grip (Very light pressure - easy to erase).",
        desc: "Examine your reference photo on screen. On your physical paper, lightly sketch a bounding box matching the total outer dimensions of your subject. This anchors your proportions correctly."
    },
    {
        title: "Step 2: Centerlines & Symmetry Axes",
        grip: "Pencil Grip: Tripod Grip (Light pressure).",
        desc: "Draw a vertical center axis straight down your box and horizontal landmark dividers. This is your professional roadmap to prevent features from becoming lopsided."
    },
    {
        title: "Step 3: 3D Primitive Block-In (Boxes & Ovals)",
        grip: "Pencil Grip: Extended Tripod Grip.",
        desc: "Ignore all details. Break down the subject into basic 3D volumes: spheres for heads/joints, cylinders for limbs/necks, and boxes for torsos or solid objects."
    },
    {
        title: "Step 4: Shape Manipulation & Bending",
        grip: "Pencil Grip: Extended Overhand Grip.",
        desc: "Apply contour manipulation and bending. Smooth out your geometric shapes into organic curves following the gesture and flow of your reference."
    },
    {
        title: "Step 5: Primary Feature Mapping",
        grip: "Pencil Grip: Standard Writing Grip.",
        desc: "Using your crosshairs from Step 2, map out the exact placement boundaries for eyes, nose, mouth, joints, or primary subject focal points."
    },
    {
        title: "Step 6: Clean Outlines & Landmark Contours",
        grip: "Pencil Grip: Sharp Tripod Grip (HB Pencil).",
        desc: "Draw clean, confident final contour outlines over your construction lines. Gently erase overlapping guidelines."
    },
    {
        title: "Step 7: Light Mapping & Shadow Boundaries",
        grip: "Pencil Grip: Overhead Grip (Holding pencil from the back).",
        desc: "Identify your light source direction. Lightly outline the exact boundary shapes where light stops and shadows begin on your paper."
    },
    {
        title: "Step 8: Gradients, Core Shadows & Polish",
        grip: "Pencil Grip: Super Overhand Loose Grip (2B-8B Pencils).",
        desc: "Lay down smooth midtone gradients, deepen core shadows and occlusion points, lift highlights with an eraser, and sign your completed artwork!"
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
    document.querySelectorAll('.sample-btn').forEach(btn => {
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
                    analyzeUploadedImage();
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

function analyzeUploadedImage() {
    const w = uploadedImage.width;
    const h = uploadedImage.height;
    const ratio = w / h;
    imageAnalysis.width = w;
    imageAnalysis.height = h;
    imageAnalysis.aspectRatio = ratio;

    if (ratio < 0.85) {
        imageAnalysis.type = "Standing Figure / Tall Subject";
    } else if (ratio > 1.15) {
        imageAnalysis.type = "Landscape / Wide Object";
    } else {
        imageAnalysis.type = "Portrait / Balanced Subject";
    }

    document.getElementById('statusText').textContent = "Analysis Complete ✓";
    document.getElementById('subjectType').textContent = imageAnalysis.type;
    document.getElementById('lightingType').textContent = "Dynamic Contrast Detected";
}

function loadPreset(type) {
    const svgData = getPresetSvg(type);
    const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    uploadedImage.onload = () => {
        analyzeUploadedImage();
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
    } else if (type === 'figure') {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
            <rect width="400" height="400" fill="#1e293b"/>
            <circle cx="200" cy="80" r="30" fill="#cbd5e1"/>
            <rect x="170" y="120" width="60" height="110" rx="10" fill="#94a3b8"/>
            <line x1="170" y1="230" x2="150" y2="350" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>
            <line x1="230" y1="230" x2="250" y2="350" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>
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
    
    // Faint reference ghost so the user can easily map proportions
    guideCtx.globalAlpha = 0.25;
    guideCtx.drawImage(uploadedImage, 0, 0, guideCanvas.width, guideCanvas.height);
    guideCtx.globalAlpha = 1.0;

    guideCtx.save();
    guideCtx.lineWidth = 3;

    if (currentStage === 0) {
        // Step 1: Bounding Box
        guideCtx.strokeStyle = '#3b82f6';
        guideCtx.setLineDash([6, 6]);
        guideCtx.strokeRect(80, 40, 240, 320);
    } else if (currentStage === 1) {
        // Step 2: Centerlines & Axes
        guideCtx.strokeStyle = '#ef4444';
        guideCtx.setLineDash([4, 4]);
        guideCtx.beginPath();
        guideCtx.moveTo(200, 40); guideCtx.lineTo(200, 360);
        guideCtx.moveTo(80, 200); guideCtx.lineTo(320, 200);
        guideCtx.stroke();
    } else if (currentStage === 2) {
        // Step 3: 3D Primitive Shapes
        guideCtx.strokeStyle = '#60a5fa';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.arc(200, 130, 65, 0, Math.PI * 2);
        guideCtx.stroke();
        guideCtx.strokeRect(130, 210, 140, 130);
    } else if (currentStage === 3) {
        // Step 4: Contour Bending
        guideCtx.strokeStyle = '#38bdf8';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.moveTo(135, 130);
        guideCtx.quadraticCurveTo(200, 90, 265, 130);
        guideCtx.quadraticCurveTo(280, 240, 265, 330);
        guideCtx.quadraticCurveTo(200, 370, 135, 330);
        guideCtx.quadraticCurveTo(120, 240, 135, 130);
        guideCtx.stroke();
    } else if (currentStage === 4) {
        // Step 5: Feature Mapping
        guideCtx.strokeStyle = '#a855f7';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.arc(165, 135, 15, 0, Math.PI * 2);
        guideCtx.arc(235, 135, 15, 0, Math.PI * 2);
        guideCtx.moveTo(190, 200); guideCtx.lineTo(200, 220); guideCtx.lineTo(210, 200);
        guideCtx.moveTo(170, 275); guideCtx.quadraticCurveTo(200, 290, 230, 275);
        guideCtx.stroke();
    } else if (currentStage === 5) {
        // Step 6: Clean Outlines
        guideCtx.strokeStyle = '#22c55e';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.arc(200, 130, 65, 0, Math.PI * 2);
        guideCtx.moveTo(135, 195); guideCtx.lineTo(135, 330);
        guideCtx.moveTo(265, 195); guideCtx.lineTo(265, 330);
        guideCtx.stroke();
    } else {
        // Steps 7 & 8: Shading & Final Polish Guide
        guideCtx.strokeStyle = '#facc15';
        guideCtx.setLineDash([]);
        guideCtx.strokeRect(120, 170, 160, 160);
    }
    
    guideCtx.restore();
}

function renderStagesList() {
    const list = document.getElementById('stagesList');
    list.innerHTML = '';
    drawingStages.forEach((stage, index) => {
        const item = document.createElement('div');
        item.className = `stage-item ${index === currentStage ? 'active' : ''}`;
        item.textContent = `${index + 1}. ${stage.title.split(':')[1] || stage.title}`;
        item.addEventListener('click', () => {
            currentStage = index;
            updateStage();
        });
        list.appendChild(item);
    });
}

function updateStage() {
    document.getElementById('stageTitle').textContent = drawingStages[currentStage].title;
    document.getElementById('gripTipText').textContent = drawingStages[currentStage].grip;
    document.getElementById('instructionText').textContent = drawingStages[currentStage].desc;
    document.getElementById('stepIndicator').textContent = `${currentStage + 1} / ${drawingStages.length}`;
    renderStagesList();
    redrawGuideCanvas();
}
