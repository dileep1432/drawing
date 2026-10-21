const drawingStages = [
    {
        title: "Step 1: Overall Bounding Box & Framing",
        grip: "Pencil Grip: Tripod Grip (Very light pressure - easy to erase).",
        desc: "Look at your reference photo. On your physical paper, lightly draw a rectangular box that matches the total width and height of the subject. This stops your drawing from going off the page!"
    },
    {
        title: "Step 2: Centerlines & Symmetry Axes",
        grip: "Pencil Grip: Tripod Grip (Light pressure).",
        desc: "Lightly draw a vertical line straight down the middle of your box, and horizontal lines where major features sit. This is your roadmap for placing everything correctly on paper."
    },
    {
        title: "Step 3: Basic 3D Primitive Shapes",
        grip: "Pencil Grip: Extended Tripod Grip.",
        desc: "Ignore small details. Draw simple ovals for heads, circles for joints, and boxes for torsos or objects right inside your bounding box on your paper."
    },
    {
        title: "Step 4: Contour & Shape Bending",
        grip: "Pencil Grip: Tripod Grip.",
        desc: "Smooth out your geometric shapes into organic curves. Connect shoulders, jawlines, or object edges following the contour of your reference photo."
    },
    {
        title: "Step 5: Primary Feature Placement",
        grip: "Pencil Grip: Standard Writing Grip.",
        desc: "Using your crosshairs from Step 2, sketch the exact placement of eyes, nose, mouth, or main object openings on your paper."
    },
    {
        title: "Step 6: Clean Outlines & Landmark Edges",
        grip: "Pencil Grip: Sharp Tripod Grip (HB Pencil).",
        desc: "Firm up your final outer outlines and feature lines. Erase your overlapping construction lines and messy guidelines gently."
    },
    {
        title: "Step 7: Light Mapping & Shadow Boundaries",
        grip: "Pencil Grip: Overhead Grip (Hold pencil from the back).",
        desc: "Look at where shadows fall on your reference. Lightly outline the boundary shapes where light stops and shadow begins on your paper sketch."
    },
    {
        title: "Step 8: Base Shading & Midtone Gradients",
        grip: "Pencil Grip: Overhand Loose Grip (2B Pencil).",
        desc: "Using the side of your pencil lead rather than the tip, lay down smooth, even midtone shading across the shadow regions on your paper."
    },
    {
        title: "Step 9: Core Shadows & Deep Accents",
        grip: "Pencil Grip: Precision Grip (8B/10B Pencil).",
        desc: "Darken the deepest creases, eye sockets, and occlusion shadows on your paper to give your drawing rich contrast and 3D depth."
    },
    {
        title: "Step 10: Final Highlights & Polish",
        grip: "Tool: Kneaded Eraser / White Pen.",
        desc: "Lift out bright highlights using an eraser or white pen. Compare your paper drawing with the reference on your screen and sign your work!"
    }
];

let currentStage = 0;
let currentMode = 'beginner';
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
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentMode = e.target.dataset.mode;
        });
    });

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
                uploadedImage.onload = () => processAndDisplayImage();
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

function loadPreset(type) {
    const svgData = getPresetSvg(type);
    const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    uploadedImage.onload = () => processAndDisplayImage();
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
    } else if (type === 'object') {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
            <rect width="400" height="400" fill="#1e293b"/>
            <ellipse cx="200" cy="120" rx="60" ry="25" fill="#60a5fa"/>
            <path d="M 140 120 L 140 280 A 60 25 0 0 0 260 280 L 260 120 Z" fill="#3b82f6"/>
            <ellipse cx="200" cy="280" rx="60" ry="25" fill="#2563eb"/>
        </svg>`;
    } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
            <rect width="400" height="400" fill="#1e293b"/>
            <circle cx="200" cy="200" r="90" fill="#f472b6" opacity="0.9"/>
            <polygon points="130,120 160,180 110,160" fill="#db2777"/>
            <polygon points="270,120 240,180 290,160" fill="#db2777"/>
            <circle cx="170" cy="180" r="10" fill="#0f172a"/>
            <circle cx="230" cy="180" r="10" fill="#0f172a"/>
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
    
    // Show a faint ghost of the image so the user can see what step they are on
    guideCtx.globalAlpha = 0.2;
    guideCtx.drawImage(uploadedImage, 0, 0, guideCanvas.width, guideCanvas.height);
    guideCtx.globalAlpha = 1.0;

    guideCtx.save();
    guideCtx.lineWidth = 3;

    if (currentStage === 0) {
        // Step 1: Bounding Box
        guideCtx.strokeStyle = '#3b82f6';
        guideCtx.setLineDash([6, 6]);
        guideCtx.strokeRect(90, 40, 220, 320);
    } else if (currentStage === 1) {
        // Step 2: Centerlines & Axes
        guideCtx.strokeStyle = '#ef4444';
        guideCtx.setLineDash([4, 4]);
        guideCtx.beginPath();
        guideCtx.moveTo(200, 40); guideCtx.lineTo(200, 360); // Vertical center
        guideCtx.moveTo(90, 200); guideCtx.lineTo(310, 200); // Horizontal center
        guideCtx.stroke();
    } else if (currentStage === 2) {
        // Step 3: Primitive 3D Shapes
        guideCtx.strokeStyle = '#60a5fa';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.arc(200, 140, 75, 0, Math.PI * 2);
        guideCtx.stroke();
        guideCtx.strokeRect(130, 220, 140, 130);
    } else if (currentStage === 3) {
        // Step 4: Contour curves
        guideCtx.strokeStyle = '#38bdf8';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.moveTo(125, 140);
        guideCtx.quadraticCurveTo(200, 95, 275, 140);
        guideCtx.quadraticCurveTo(285, 250, 270, 330);
        guideCtx.quadraticCurveTo(200, 370, 130, 330);
        guideCtx.quadraticCurveTo(115, 250, 125, 140);
        guideCtx.stroke();
    } else if (currentStage === 4) {
        // Step 5: Primary Feature Placement
        guideCtx.strokeStyle = '#a855f7';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.arc(165, 140, 16, 0, Math.PI * 2);
        guideCtx.arc(235, 140, 16, 0, Math.PI * 2);
        guideCtx.moveTo(190, 210); guideCtx.lineTo(200, 230); guideCtx.lineTo(210, 210);
        guideCtx.moveTo(165, 280); guideCtx.quadraticCurveTo(200, 295, 235, 280);
        guideCtx.stroke();
    } else if (currentStage === 5) {
        // Step 6: Clean Outlines
        guideCtx.strokeStyle = '#22c55e';
        guideCtx.setLineDash([]);
        guideCtx.beginPath();
        guideCtx.arc(200, 140, 75, 0, Math.PI * 2);
        guideCtx.moveTo(125, 200); guideCtx.lineTo(125, 330);
        guideCtx.moveTo(275, 200); guideCtx.lineTo(275, 330);
        guideCtx.stroke();
    } else {
        // Steps 7-10: Shading & Final Details Guide
        guideCtx.strokeStyle = '#facc15';
        guideCtx.setLineDash([]);
        guideCtx.strokeRect(130, 180, 140, 150);
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
