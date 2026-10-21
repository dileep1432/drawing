const drawingStages = [
    { title: "Stage 1: Structuralization & Basic Shapes", desc: "Break down the reference into primitive 3D shapes (boxes, cylinders, spheres, and ovals). Establish spatial awareness and proportions." },
    { title: "Stage 2: Shape Manipulation & Bending", desc: "Apply contour manipulation, twisting, bending, or stretching to primitives to match organic curves." },
    { title: "Stage 3: Observation & Contour Lines", desc: "Observe the primary subject without technical complexity. Sketch clean outlines and major landmark boundaries." },
    { title: "Stage 4: Internal Features Placement", desc: "Map out secondary features (eyes, nose, lips, joints, or interior panels) using center guidelines." },
    { title: "Stage 5: Light Direction & Shadows", desc: "Identify the primary light source. Mark highlight zones, half-tones, and core shadow boundaries." },
    { title: "Stage 6: Base Shading & Midtones", desc: "Use the Overhand Grip (shading pencil) for uniform gradient layers across large shadow areas." },
    { title: "Stage 7: Core Shadows & Occlusion", desc: "Deepen core shadows and cast shadows to create realistic 3D depth and weight." },
    { title: "Stage 8: Fine Details & Textures", desc: "Switch to the Tripod Grip with a sharpened HB/2B pencil for fine textures, hair strands, or skin gradients." },
    { title: "Stage 9: Highlights & Accents", desc: "Lift out highlights with an eraser or apply white pen accents for glowing reflections." },
    { title: "Stage 10: Final Masterpiece", desc: "Review proportions, contrast balance, edge control, and finalize your complete drawing." }
];

let currentStage = 0;
let currentMode = 'beginner';
let currentPencil = 'HB';
let isDrawing = false;
let isEraser = false;

const refCanvas = document.getElementById('refCanvas');
const drawCanvas = document.getElementById('drawCanvas');
const refCtx = refCanvas.getContext('2d');
const drawCtx = drawCanvas.getContext('2d');

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
    drawCanvas.width = 400;
    drawCanvas.height = 400;
}

function setupEventListeners() {
    // Mode Switching
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentMode = e.target.dataset.mode;
            updateTechniqueInfo();
        });
    });

    // Pencil Selector
    document.querySelectorAll('.pencil-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.pencil-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentPencil = e.target.dataset.grade;
        });
    });

    // Presets
    document.querySelectorAll('.sample-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            loadPreset(e.target.dataset.preset);
        });
    });

    // Image Upload
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

    // Navigation
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

    // Drawing Tools
    document.getElementById('brushTool').addEventListener('click', () => {
        isEraser = false;
        document.getElementById('brushTool').classList.add('active');
        document.getElementById('eraserTool').classList.remove('active');
    });

    document.getElementById('eraserTool').addEventListener('click', () => {
        isEraser = true;
        document.getElementById('eraserTool').classList.add('active');
        document.getElementById('brushTool').classList.remove('active');
    });

    document.getElementById('clearCanvas').addEventListener('click', () => {
        drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        redrawStageCanvas();
    });

    document.getElementById('saveProgress').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `drawing-stage-${currentStage + 1}.png`;
        link.href = drawCanvas.toDataURL();
        link.click();
    });

    // Canvas Mouse / Touch Drawing
    let drawing = false;

    const startDraw = (e) => {
        drawing = true;
        drawCtx.beginPath();
        const pos = getPos(e);
        drawCtx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
        if (!drawing) return;
        const pos = getPos(e);
        drawCtx.lineTo(pos.x, pos.y);
        drawCtx.strokeStyle = isEraser ? '#000000' : (currentMode === 'pen' ? '#ffffff' : getPencilColor());
        drawCtx.lineWidth = isEraser ? 20 : (currentMode === 'pen' ? 2 : getPencilWidth());
        drawCtx.lineCap = 'round';
        drawCtx.stroke();
    };

    const stopDraw = () => {
        drawing = false;
    };

    drawCanvas.addEventListener('mousedown', startDraw);
    drawCanvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    drawCanvas.addEventListener('touchstart', (e) => { startDraw(e.touches[0]); e.preventDefault(); });
    drawCanvas.addEventListener('touchmove', (e) => { draw(e.touches[0]); e.preventDefault(); });
    drawCanvas.addEventListener('touchend', stopDraw);
}

function getPos(e) {
    const rect = drawCanvas.getBoundingClientRect();
    const scaleX = drawCanvas.width / rect.width;
    const scaleY = drawCanvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function getPencilColor() {
    switch(currentPencil) {
        case 'HB': return '#cbd5e1';
        case '2B': return '#94a3b8';
        case '8B': return '#64748b';
        case '10B': return '#334155';
        default: return '#cbd5e1';
    }
}

function getPencilWidth() {
    switch(currentPencil) {
        case 'HB': return 2;
        case '2B': return 3;
        case '8B': return 5;
        case '10B': return 7;
        default: return 2;
    }
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
            <circle cx="200" cy="160" r="80" fill="#cbd5e1" opacity="0.8"/>
            <path d="M 140 220 Q 200 320 260 220 Z" fill="#94a3b8"/>
            <ellipse cx="175" cy="150" rx="12" ry="8" fill="#0f172a"/>
            <ellipse cx="225" cy="150" rx="12" ry="8" fill="#0f172a"/>
            <path d="M 200 160 L 190 200 L 210 200 Z" fill="#64748b"/>
            <path d="M 175 230 Q 200 250 225 230" stroke="#0f172a" stroke-width="4" fill="none"/>
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
    redrawStageCanvas();
}

function redrawStageCanvas() {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    
    // Draw guide overlay based on stage
    drawCtx.save();
    drawCtx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    drawCtx.lineWidth = 2;
    drawCtx.setLineDash([5, 5]);

    if (currentStage === 0) {
        // Basic Shapes
        drawCtx.strokeRect(120, 80, 160, 200);
        drawCtx.beginPath();
        drawCtx.arc(200, 160, 75, 0, Math.PI * 2);
        drawCtx.stroke();
    } else if (currentStage === 1) {
        // Construction lines / symmetry
        drawCtx.beginPath();
        drawCtx.moveTo(200, 50); drawCtx.lineTo(200, 350);
        drawCtx.moveTo(50, 200); drawCtx.lineTo(350, 200);
        drawCtx.stroke();
    } else {
        // Faint reference outline for practice
        drawCtx.globalAlpha = 0.25;
        drawCtx.drawImage(uploadedImage, 0, 0, drawCanvas.width, drawCanvas.height);
    }
    drawCtx.restore();
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
    document.getElementById('instructionText').textContent = drawingStages[currentStage].desc;
    document.getElementById('stepIndicator').textContent = `${currentStage + 1} / ${drawingStages.length}`;
    renderStagesList();
    redrawStageCanvas();
}

function updateTechniqueInfo() {
    const name = document.getElementById('gripName');
    const desc = document.getElementById('gripDesc');
    if (currentMode === 'beginner') {
        name.textContent = "Tripod Grip (Writing Grip)";
        desc.textContent = "Best for easy outlines, simple shapes, and kids/beginner guidance.";
    } else if (currentMode === 'pencil') {
        name.textContent = "Overhead & Extended Tripod Grip";
        desc.textContent = "Hold pencil from the back for smooth shading, light gradients, and 3D form building.";
    } else {
        name.textContent = "Precision Pen & Hatching Grip";
        desc.textContent = "Firm grip for clean ink lines, cross-hatching, stippling, and high-contrast accents.";
    }
}
