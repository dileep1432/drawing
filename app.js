const drawingStages = [
    {
        title: "Step 1: Overall Framing & Proportions",
        desc: "Trace the outer bounding box and central balance axes. This locks in the height and width so your drawing never looks distorted or out of place."
    },
    {
        title: "Step 2: Primitive 3D Block-In",
        desc: "Draw basic ovals, boxes, and cylinders over the main body masses. Ignore all details here—only focus on the underlying 3D structure."
    },
    {
        title: "Step 3: Contour & Bending Curves",
        desc: "Refine the outer silhouette. Smooth out the geometric boxes into organic curves, neck angles, and shoulder slopes."
    },
    {
        title: "Step 4: Centerlines & Landmark Placement",
        desc: "Draw your vertical and horizontal crosshairs where eyes, nose, mouth, or central features intersect."
    },
    {
        title: "Step 5: Primary Feature Outlines",
        desc: "Draw clean, confident contour lines for the eyes, nose, lips, hair partition, or primary object edges."
    },
    {
        title: "Step 6: Shadow Boundary Mapping",
        desc: "Outline the exact shapes where light stops and shadows begin. Separating light from shadow is the secret to realism."
    },
    {
        title: "Step 7: Base Gradient Shading",
        desc: "Fill in midtones and secondary shadows using smooth, even strokes (overhand pencil grip)."
    },
    {
        title: "Step 8: Core Shadows & Deep Accents",
        desc: "Darken the deepest recesses, occlusion points, and core shadows to give your drawing genuine weight and pop."
    },
    {
        title: "Step 9: Highlights & Specular Reflections",
        desc: "Lift out highlights with an eraser or add bright white strokes where light hits directly."
    },
    {
        title: "Step 10: Final Polish & Masterpiece",
        desc: "Clean up smudges, check overall contrast, and sign your finished drawing!"
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
        link.download = `drawing-step-${currentStage + 1}.png`;
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
    
    // Progressive tracing guide drawn directly onto the practice canvas
    if (currentStage === 0) {
        // Step 1: Bounding Box
        drawCtx.strokeStyle = '#3b82f6';
        drawCtx.lineWidth = 2;
        drawCtx.setLineDash([4, 4]);
        drawCtx.strokeRect(100, 50, 200, 300);
    } else if (currentStage === 1) {
        // Step 2: 3D Primitive Shapes
        drawCtx.strokeStyle = '#60a5fa';
        drawCtx.lineWidth = 2;
        drawCtx.beginPath();
        drawCtx.arc(200, 140, 75, 0, Math.PI * 2);
        drawCtx.stroke();
        drawCtx.strokeRect(130, 215, 140, 120);
    } else if (currentStage === 2) {
        // Step 3: Contour & Bending curves
        drawCtx.strokeStyle = '#38bdf8';
        drawCtx.lineWidth = 2;
        drawCtx.beginPath();
        drawCtx.moveTo(125, 140);
        drawCtx.quadraticCurveTo(200, 100, 275, 140);
        drawCtx.quadraticCurveTo(280, 250, 270, 320);
        drawCtx.quadraticCurveTo(200, 350, 130, 320);
        drawCtx.quadraticCurveTo(120, 250, 125, 140);
        drawCtx.stroke();
    } else if (currentStage === 3) {
        // Step 4: Center Guidelines & Crosshairs
        drawCtx.strokeStyle = '#f43f5e';
        drawCtx.lineWidth = 1.5;
        drawCtx.setLineDash([2, 2]);
        drawCtx.beginPath();
        drawCtx.moveTo(200, 50); drawCtx.lineTo(200, 350); // Vertical center
        drawCtx.moveTo(100, 140); drawCtx.lineTo(300, 140); // Eye line
        drawCtx.moveTo(100, 220); drawCtx.lineTo(300, 220); // Nose line
        drawCtx.moveTo(100, 280); drawCtx.lineTo(300, 280); // Lip line
        drawCtx.stroke();
    } else if (currentStage === 4) {
        // Step 5: Exact Feature Outlines (Eyes, Nose, Mouth)
        drawCtx.strokeStyle = '#a855f7';
        drawCtx.lineWidth = 2;
        drawCtx.setLineDash([]);
        drawCtx.beginPath();
        // Eyes
        drawCtx.arc(165, 140, 15, 0, Math.PI * 2);
        drawCtx.arc(235, 140, 15, 0, Math.PI * 2);
        // Nose & Mouth
        drawCtx.moveTo(190, 210); drawCtx.lineTo(200, 230); drawCtx.lineTo(210, 210);
        drawCtx.moveTo(170, 280); drawCtx.quadraticCurveTo(200, 295, 230, 280);
        drawCtx.stroke();
    } else {
        // Steps 6-10: Faint ghost reference overlay for precise shading & tracing practice
        drawCtx.globalAlpha = 0.35;
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
    document.getElementById('gripTipText').textContent = `Step-by-Step Drawing Guide`;
    document.getElementById('instructionText').textContent = drawingStages[currentStage].desc;
    document.getElementById('stepIndicator').textContent = `${currentStage + 1} / ${drawingStages.length}`;
    renderStagesList();
    redrawStageCanvas();
}
