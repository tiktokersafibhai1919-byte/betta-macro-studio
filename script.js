let currentImageUrl = "";

function updateAspectLabel() {
    const ratio = document.getElementById("ratioSelect").value;
    const hud = document.getElementById("aspectHud");
    const frame = document.getElementById("screenFrame");

    hud.innerText = `${ratio} RAW`;
    frame.classList.remove("ratio-9-16", "ratio-1-1");

    if (ratio === "9:16") {
        frame.classList.add("ratio-9-16");
    } else if (ratio === "1:1") {
        frame.classList.add("ratio-1-1");
    }
}

function buildBettaPrompt() {
    const variety = document.getElementById("varietySelect").value;
    const color = document.getElementById("colorSelect").value;
    const lighting = document.getElementById("lightingSelect").value;

    return `Ultra-realistic National Geographic macro studio photograph of a single ${variety} with ${color}, suspended gracefully in crystal-clear water, ${lighting}, razor-sharp focus on glistening iridescent scales, gill plate, and delicate translucent fin rays, shot on 100mm macro lens f/2.8, 8K RAW photography, natural aquatic physics, no text, no watermark`;
}

function getDimensions(ratio) {
    if (ratio === "9:16") return { width: 768, height: 1344 };
    if (ratio === "1:1") return { width: 1024, height: 1024 };
    return { width: 896, height: 1120 }; // 4:5 Portrait
}

function generateBettaPhoto() {
    const btn = document.getElementById("generateBtn");
    const recDot = document.getElementById("recDot");
    const previewImg = document.getElementById("bettaPreview");
    const placeholder = document.getElementById("placeholderState");
    const statusLabel = document.getElementById("statusLabel");
    const ratio = document.getElementById("ratioSelect").value;

    const prompt = buildBettaPrompt();
    const { width, height } = getDimensions(ratio);
    const seed = Math.floor(Math.random() * 9999999);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

    // UI Loading State
    btn.disabled = true;
    btn.innerText = "CAPTURING...";
    recDot.classList.add("pulsing");
    previewImg.classList.add("hidden");
    placeholder.classList.remove("hidden");
    statusLabel.innerText = "EXPOSING 8K MACRO SENSOR • PLEASE WAIT...";

    const loader = new Image();
    loader.onload = () => {
        currentImageUrl = imageUrl;
        previewImg.src = imageUrl;
        placeholder.classList.add("hidden");
        previewImg.classList.remove("hidden");

        btn.disabled = false;
        btn.innerText = "GENERATE";
        recDot.classList.remove("pulsing");
    };

    loader.onerror = () => {
        statusLabel.innerText = "SIGNAL BUSY • TAP GENERATE TO RETRY";
        btn.disabled = false;
        btn.innerText = "GENERATE";
        recDot.classList.remove("pulsing");
    };

    loader.src = imageUrl;
}

async function downloadBettaImage() {
    if (!currentImageUrl) {
        alert("Please tap GENERATE first to capture a Betta fish photo!");
        return;
    }

    const downloadBtn = document.getElementById("downloadBtn");
    const originalText = downloadBtn.innerText;
    downloadBtn.innerText = "⏳ Saving...";

    try {
        const response = await fetch(currentImageUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `Betta-Macro-MrSafi-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    } catch (err) {
        window.open(currentImageUrl, "_blank");
    } finally {
        downloadBtn.innerText = originalText;
    }
}

function copyMotionPrompt() {
    const varietyText = document.getElementById("varietySelect").selectedOptions[0].text;
    const colorText = document.getElementById("colorSelect").selectedOptions[0].text;

    const motionPrompt = `Ultra slow-motion 60fps underwater macro video of this ${varietyText} (${colorText}), delicate silk fins rippling gracefully in gentle current, subtle gill breathing movement, floating micro-bubbles drifting upward, locked 100mm macro camera, cinematic rim lighting, photorealistic aquatic physics.`;

    navigator.clipboard.writeText(motionPrompt).then(() => {
        const copyBtn = document.getElementById("copyPromptBtn");
        const oldText = copyBtn.innerText;
        copyBtn.innerText = "✅ Copied!";
        setTimeout(() => {
            copyBtn.innerText = oldText;
        }, 1600);
    });
      }
