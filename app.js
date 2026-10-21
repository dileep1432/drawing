const drawingStages = [
    {
        title: "Stage 1: Structuralization & Basic Shapes",
        tip: "Pencil Grip: Tripod / Writing Grip (Light pressure).",
        desc: "Don't look at details yet. Break down your subject into simple 3D primitives: cylinders, boxes, spheres, and ovals. Establish spatial awareness and overall proportions on your page."
    },
    {
        title: "Stage 2: Shape Manipulation & Bending",
        tip: "Pencil Grip: Extended Tripod Grip.",
        desc: "Apply contour manipulation, bending, or stretching to your primitive shapes to match organic curves (like a bent cylinder for a neck or arm, or a tapered box for a torso)."
    },
    {
        title: "Stage 3: Observation & Landmark Outlines",
        tip: "Pencil Grip: Tripod Grip (Sharp point).",
        desc: "Observe the reference without being manipulated by details. Sketch clean landmark boundaries, outer silhouettes, and major structural contours."
    },
    {
        title: "Stage 4: Centerlines & Internal Features",
        tip: "Pencil Grip: Standard Tripod Grip.",
        desc: "Map out secondary features (eyes, nose, lips, joints, or interior panels) using center guidelines and symmetry axes to ensure nothing is crooked or out of proportion."
    },
    {
        title: "Stage 5: Light Source & Shadow Mapping",
        tip: "Pencil Grip: Overhead Grip (Holding from the back).",
        desc: "Identify where your primary light source is coming from. Lightly outline your highlight zones, midtones, core shadow boundaries, and cast shadows."
    },
    {
        title: "Stage 6: Base Shading & Midtones (Overhand)",
        tip: "Pencil Grip: Super Overhand Loose Grip.",
        desc: "Hold your pencil from the back using your whole arm (not just your wrist) to lay down smooth, uniform midtone gradient layers across shadow areas without harsh lines."
    },
    {
        title: "Stage 7: Core Shadows & Occlusion",
        tip: "Pencil Grip: Extended Tripod / 2B-4B Pencil.",
        desc: "Deepen core shadows and occlusion shadows (where objects touch or overlap) to create realistic 3D weight, depth, and volume."
    },
    {
        title: "Stage 8: Fine Details & Textures",
        tip: "Pencil Grip: Precision Tripod Grip (Sharp 8B/10B).",
        desc: "Add fine textures, hair strands, skin gradients, or cross-hatching. Keep strokes flowing in the natural direction of the subject's form."
    },
    {
        title: "Stage 9: Highlights & Edge Cleanup",
        tip: "Tool: Kneaded Eraser / White Gel Pen.",
        desc: "Lift out glowing highlights using a sharpened eraser or add bright specular reflections with a white gel pen. Clean up messy background smudges."
    },
    {
        title: "Stage 10: Final Masterpiece Review",
        tip: "Review Step: Stand back and compare contrast.",
        desc: "Check your overall tonal contrast, edge control, and proportions against the reference. Your complete masterclass drawing is now finished!"
    }
];

let currentStage = 0;
let currentMode = 'beginner';
let currentPencil = 'HB';
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
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentMode = e.target.dataset.mode;
            updateTechniqueInfo();
        });
    });

    document.querySelectorAll('.pencil-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.pencil-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentPencil = e.target.dataset.grade;
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
        drawCtx.strokeStyle = isEraser ? '#1e293b' : (currentMode === 'pen' ? '#ffffff' : getPencilColor());
        drawCtx.lineWidth = isEraser ? 24 : (currentMode === 'pen' ? 2 : getPencilWidth());
        drawCtx.lineCap = 'round';
        drawCtx.stroke();
    };

    const stopDraw = () => { drawing = false; };

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
        case '8B': return 6;
        case '10B': return 9;
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
    redrawStageCanvas();
}

function redrawStageCanvas() {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    
    drawCtx.save();
    drawCtx.strokeStyle = 'rgba(96, 165, 250, 0.7)';
    drawCtx.lineWidth = 2;
    drawCtx.setLineDash([6, 6]);

    if (currentStage === 0) {
        drawCtx.strokeRect(125, 75, 150, 210);
        drawCtx.beginPath();
        drawCtx.arc(200, 150, 70, 0, Math.PI * 2);
        drawCtx.stroke();
    } else if (currentStage === 1) {
        drawCtx.beginPath();
        drawCtx.moveTo(200, 60); drawCtx.quadraticCurveTo(220, 200, 200, 340);
        drawCtx.moveTo(120, 150); drawCtx.quadraticCurveTo(200, 130, 280, 150);
        drawCtx.stroke();
    } else if (currentStage === 2 || currentStage === 3) {
        drawCtx.beginPath();
        drawCtx.moveTo(200, 50); drawCtx.lineTo(200, 350);
        drawCtx.moveTo(80, 150); drawCtx.lineTo(320, 150);
        drawCtx.moveTo(80, 220); drawCtx.lineTo(320, 220);
        drawCtx.stroke();
    } else {
        drawCtx.globalAlpha = 0.3;
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
    document.getElementById('gripTipText').textContent = drawingStages[currentStage].tip;
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
        desc.textContent = "Best for simple outlines, basic shapes, and clear step-by-step kid-friendly tracing.";
    } else if (currentMode === 'pencil') {
        name.textContent = "Overhead & Extended Overhand Grip";
        desc.textContent = "Hold pencil from the back with your whole arm for smooth gradients, shadow mapping, and 3D volume.";
    } else {
        name.textContent = "Precision Pen & Hatching Grip";
        desc.textContent = "Firm control for clean ink contours, cross-hatching, stippling, and sharp high-contrast accents.";
    }
}
