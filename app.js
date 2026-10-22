let currentStage = 0;
let currentMethod = 'loomis';

const loomisStages = [
    {
        title: "Step 1: The Cranial Ball",
        grip: "Pencil Grip: Tripod / Writing Grip (Very light pressure).",
        desc: "Draw a circular ball representing the cranium. Do not worry about perfection—this is your base 3D volume."
    },
    {
        title: "Step 2: Sliced Temporal Planes",
        grip: "Pencil Grip: Extended Tripod.",
        desc: "Slice off the left and right sides of your sphere to create flat vertical planes where the ears and temples sit."
    },
    {
        title: "Step 3: Brow Line & Center Crosshairs",
        grip: "Pencil Grip: Standard Writing Grip.",
        desc: "Draw a horizontal brow line across the middle of the sphere and a vertical center line down the front of the face."
    },
    {
        title: "Step 4: Proportional Thirds (Hairline to Chin)",
        grip: "Pencil Grip: Light Pressure.",
        desc: "Measure equal thirds from Hairline ➔ Brow Line ➔ Bottom of Nose ➔ Bottom of Chin."
    },
    {
        title: "Step 5: Jawline & Feature Placement",
        grip: "Pencil Grip: Precision Grip.",
        desc: "Drop the jaw down from the temporal planes. Place eyes right below the brow line, nose at the 2nd third, and mouth one-third down."
    },
    {
        title: "Step 6: Final Tonal Rendering",
        grip: "Pencil Grip: Overhand Loose Grip.",
        desc: "Erase structural guidelines, map your core shadow boundaries, and apply smooth midtone shading."
    }
];

const reillyStages = [
    {
        title: "Step 1: Egg Envelope & Centerline Flow",
        grip: "Pencil Grip: Loose Overhand Grip (Whole arm movement).",
        desc: "Draw a 3:2 egg-shaped oval and a sweeping center gesture line to capture the dynamic tilt and rhythm of the head."
    },
    {
        title: "Step 2: Hairline & Brow Rhythms",
        grip: "Pencil Grip: Extended Tripod.",
        desc: "Map out the flowing rhythm arcs for the hairline and the arching brow line across the upper cranium."
    },
    {
        title: "Step 3: The Muzzle & Cheekbone Rhythms",
        grip: "Pencil Grip: Smooth Shading Grip.",
        desc: "Draw the central 'muzzle' oval around the nose and mouth area, and sweep rhythm lines outward across the cheekbones."
    },
    {
        title: "Step 4: Interlocking Facial Features",
        grip: "Pencil Grip: Standard Writing Grip.",
        desc: "Construct the eyes within their socket shadow shapes and interlock the nose and lip planes into the surrounding facial flow."
    },
    {
        title: "Step 5: Planar Shadow Mapping",
        grip: "Pencil Grip: Overhead Grip.",
        desc: "Separate your light family from your shadow family by mapping out the abstract shadow planes defined by your rhythm lines."
    },
    {
        title: "Step 6: Final Contrast & Accents",
        grip: "Pencil Grip: Sharp 8B/10B Pencil.",
        desc: "Deepen occlusion shadows, add rich contrast, and finish your professional Reilly-method portrait."
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
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentMethod = e.target.dataset.mode;
            currentStage = 0;
            document.getElementById('methodDesc').textContent = currentMethod === 'loomis' ? 
                "Building the head as a 3D sphere with sliced temporal planes and proportional thirds." :
                "Abstracting the head into fluid rhythms, flowing contours, and interlocking planar zones.";
            renderStagesList();
            updateStage();
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
        const stages = currentMethod === 'loomis' ? loomisStages : reillyStages;
        if (currentStage > 0) {
            currentStage--;
            updateStage();
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        const stages = currentMethod === 'loomis' ? loomisStages : reillyStages;
        if (currentStage < stages.length - 1) {
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
    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#1e293b"/>
        <circle cx="200" cy="150" r="75" fill="#cbd5e1" opacity="0.8"/>
        <path d="M 130 210 Q 200 310 270 210 Z" fill="#94a3b8"/>
        <ellipse cx="170" cy="140" rx="10" ry="7" fill="#0f172a"/>
        <ellipse cx="230" cy="140" rx="10" ry="7" fill="#0f172a"/>
        <path d="M 200 150 L 195 190 L 205 190 Z" fill="#64748b"/>
        <path d="M 175 225 Q 200 245 225 225" stroke="#0f172a" stroke-width="3" fill="none"/>
    </svg>`;
}

function processAndDisplayImage() {
    refCtx.clearRect(0, 0, refCanvas.width, refCanvas.height);
    refCtx.drawImage(uploadedImage, 0, 0, refCanvas.width, refCanvas.height);
    redrawGuideCanvas();
}

function redrawGuideCanvas() {
    guideCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
    
    guideCtx.globalAlpha = 0.25;
    guideCtx.drawImage(uploadedImage, 0, 0, guideCanvas.width, guideCanvas.height);
    guideCtx.globalAlpha = 1.0;

    guideCtx.save();
    guideCtx.lineWidth = 3;

    if (currentMethod === 'loomis') {
        if (currentStage === 0) {
            // Cranial Sphere
            guideCtx.strokeStyle = '#3b82f6';
            guideCtx.beginPath();
            guideCtx.arc(200, 160, 80, 0, Math.PI * 2);
            guideCtx.stroke();
        } else if (currentStage === 1) {
            // Sliced Side Planes
            guideCtx.strokeStyle = '#60a5fa';
            guideCtx.beginPath();
            guideCtx.arc(200, 160, 80, 0, Math.PI * 2);
            guideCtx.moveTo(135, 100); guideCtx.lineTo(135, 220);
            guideCtx.moveTo(265, 100); guideCtx.lineTo(265, 220);
            guideCtx.stroke();
        } else if (currentStage === 2) {
            // Brow Line & Center Crosshair
            guideCtx.strokeStyle = '#ef4444';
            guideCtx.beginPath();
            guideCtx.arc(200, 160, 80, 0, Math.PI * 2);
            guideCtx.moveTo(200, 80); guideCtx.lineTo(200, 360); // Center line
            guideCtx.moveTo(120, 160); guideCtx.lineTo(280, 160); // Brow line
            guideCtx.stroke();
        } else if (currentStage === 3) {
            // Proportional Thirds
            guideCtx.strokeStyle = '#facc15';
            guideCtx.beginPath();
            guideCtx.moveTo(200, 80); guideCtx.lineTo(200, 360);
            guideCtx.moveTo(150, 100); guideCtx.lineTo(250, 100); // Hairline
            guideCtx.moveTo(120, 160); guideCtx.lineTo(280, 160); // Brow line
            guideCtx.moveTo(150, 240); guideCtx.lineTo(250, 240); // Nose base
            guideCtx.moveTo(160, 320); guideCtx.lineTo(240, 320); // Chin
            guideCtx.stroke();
        } else if (currentStage === 4) {
            // Jawline & Features
            guideCtx.strokeStyle = '#22c55e';
            guideCtx.beginPath();
            guideCtx.arc(200, 160, 80, 0, Math.PI * 2);
            guideCtx.moveTo(135, 220); guideCtx.lineTo(160, 320); guideCtx.lineTo(240, 320); guideCtx.lineTo(265, 220);
            guideCtx.stroke();
        } else {
            // Tonal Shading
            guideCtx.strokeStyle = '#a855f7';
            guideCtx.strokeRect(120, 80, 160, 260);
        }
    } else {
        // Reilly Rhythms
        if (currentStage === 0) {
            // Egg Envelope & Gesture Centerline
            guideCtx.strokeStyle = '#38bdf8';
            guideCtx.beginPath();
            guideCtx.ellipse(200, 200, 85, 115, 0, 0, Math.PI * 2);
            guideCtx.moveTo(200, 75); guideCtx.lineTo(200, 335);
            guideCtx.stroke();
        } else if (currentStage === 1) {
            // Hairline & Brow Rhythms
            guideCtx.strokeStyle = '#f43f5e';
            guideCtx.beginPath();
            guideCtx.ellipse(200, 200, 85, 115, 0, 0, Math.PI * 2);
            guideCtx.arc(200, 140, 65, Math.PI, 0);
            guideCtx.stroke();
        } else if (currentStage === 2) {
            // Muzzle & Cheekbone Rhythms
            guideCtx.strokeStyle = '#a855f7';
            guideCtx.beginPath();
            guideCtx.ellipse(200, 230, 40, 30, 0, 0, Math.PI * 2); // Muzzle
            guideCtx.moveTo(160, 180); guideCtx.quadraticCurveTo(200, 210, 240, 180); // Cheekbones
            guideCtx.stroke();
        } else if (currentStage === 3) {
            // Interlocking Features
            guideCtx.strokeStyle = '#22c55e';
            guideCtx.beginPath();
            guideCtx.arc(170, 175, 14, 0, Math.PI * 2);
            guideCtx.arc(230, 175, 14, 0, Math.PI * 2);
            guideCtx.stroke();
        } else if (currentStage === 4) {
            // Planar Shadow Mapping
            guideCtx.strokeStyle = '#facc15';
            guideCtx.strokeRect(130, 140, 140, 180);
        } else {
            // Final Accents
            guideCtx.strokeStyle = '#ffffff';
            guideCtx.strokeRect(110, 70, 180, 280);
        }
    }
    
    guideCtx.restore();
}

function renderStagesList() {
    const list = document.getElementById('stagesList');
    list.innerHTML = '';
    const stages = currentMethod === 'loomis' ? loomisStages : reillyStages;
    stages.forEach((stage, index) => {
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
    const stages = currentMethod === 'loomis' ? loomisStages : reillyStages;
    document.getElementById('stageTitle').textContent = stages[currentStage].title;
    document.getElementById('gripTipText').textContent = stages[currentStage].grip;
    document.getElementById('instructionText').textContent = stages[currentStage].desc;
    document.getElementById('stepIndicator').textContent = `${currentStage + 1} / ${stages.length}`;
    renderStagesList();
    redrawGuideCanvas();
}
