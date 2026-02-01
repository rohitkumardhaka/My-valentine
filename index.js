// --- Configuration Data ---
// Placeholder images - USER SHOULD REPLACE THESE LOCAL PATHS OR GIF URLS
const images = {
    catCute: "https://media.tenor.com/WoY8ETlvYPoAAAAm/tkthao219-bubududu.webp", // Cute cat asking
    pandaAngry: "https://media.tenor.com/8kIKTOjeiAwAAAAm/bubududu-panda.webp", // Angry panda
    cartoonSad: "https://media.tenor.com/TKGL8YjZTnEAAAAm/mimibubu.webp", // Sad running
    cartoonCrying: "https://media.tenor.com/qqRoBpnjOrIAAAAm/tkthao219-bubududu.webp", // Crying
    devilMode: "https://media.tenor.com/EwOZ7bIKJGAAAAAm/bubududu-panda.webp", // Evil planning
    pandaShy: "https://media.tenor.com/d0nIEAvNYksAAAAm/tkthao219-bubududu.webp", // Shy
    catAngry: "https://media.tenor.com/8kIKTOjeiAwAAAAm/bubududu-panda.webp", // Angry cat for "No" in valentine flow
    bearsHugging: "https://media.tenor.com/sqMrmFmyejwAAAAM/hug.gif", // Hug
    pandaLove: "https://media.tenor.com/yr7z512oIf4AAAAm/peach-goma-shy-blush-heart.webp", // Hearts
    bouquet: "https://media.tenor.com/mHj1ar_SHTkAAAAM/flowers.gif", // Bouquet
    kiss: "https://media.tenor.com/hmYv6-dCkGgAAAAm/bubu-dudu-bubu.webp", // Kiss
};

// Global State
let currentStep = 0;
const app = document.getElementById('app');

// --- Render Logic ---

async function render() {
    // 1. Fade out current content (if any)
    const card = document.querySelector('.card');
    if (card) {
        card.classList.add('page-exit');
        await new Promise(r => setTimeout(r, 300)); // Wait for animation
    }

    // 2. Clear and Render New Step
    app.innerHTML = getStepHTML(currentStep);

    const newCard = document.querySelector('.card');
    if (newCard) {
        // Force animation replay for every render
        newCard.classList.remove('page-enter');
        void newCard.offsetWidth; // force reflow
        newCard.classList.add('page-enter');
    }

    // 3. Attach Event Listeners
    attachListeners(currentStep);

    // 4. Fade In new content (css animation handles this via .page-enter class on card)
}

function triggerHeartBurst() {
    const burstCount = 30;
    const body = document.body;

    // Get center of viewport/card roughly
    // Or just center screen
    for (let i = 0; i < burstCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'burst-heart';
        heart.innerText = '💖';

        // Random trajectory
        const angle = Math.random() * Math.PI * 2;
        const velocity = 100 + Math.random() * 200; // Distance to fly
        const tx = Math.cos(angle) * velocity + 'px';
        const ty = Math.sin(angle) * velocity + 'px';

        heart.style.setProperty('--tx', tx);
        heart.style.setProperty('--ty', ty);

        // Random size and rotation start
        const randomRot = Math.random() * 360;
        heart.style.transform = `translate(-50%, -50%) rotate(${randomRot}deg)`;

        body.appendChild(heart);

        // Cleanup
        setTimeout(() => heart.remove(), 1000);
    }
}

// Wrapper for nextStep to include effects
function nextStepWithBurst(target) {
    triggerHeartBurst();
    playMusic();
    nextStep(target);
}

function playMusic() {
    const audio = document.getElementById('bg-music');
    if (audio && audio.paused) {
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Audio play blocked until interaction"));
    }
}

function getStepHTML(step) {
    let content = '';

    // Standard card template helper
    const cardTemplate = (img, title, sub, buttonsHtml) => `
        <div class="card page-enter">
            <div class="image-container">
                <img src="${img}" alt="Mood Image">
            </div>
           <h1 class="anim-text">${title}</h1>
<p class="subtext anim-text anim-delay-1">${sub}</p>

            <div class="btn-group">
                ${buttonsHtml}
            </div>
        </div>
    `;

    switch (step) {
        // --- PRANK FLOW ---
        case 0: // Cat, Do you love me?
            return cardTemplate(
                images.catCute,
                "Do you love me? 🥺",
                "",
                `<button class="yes-btn" onclick="nextStepWithBurst(5)">YES</button>
                 <button class="no-btn" onclick="playMusic(); nextStep(1)">NO</button>`
            );

        case 1: // Angry Panda, Soch le
            return cardTemplate(
                images.pandaAngry,
                "Soch le ache se 😐",
                "Itne jaldi mana matt kar 😏",
                `<button class="yes-btn" onclick="nextStepWithBurst(5)">YES</button>
                 <button class="no-btn" onclick="nextStep(2)">NO</button>`
            );

        case 2: // Sad Lying, Ek aur baar
            return cardTemplate(
                images.cartoonSad,
                "Ek aur baar soch le 😠",
                "Kyu aisa kr rahi hai 😢",
                `<button class="yes-btn" onclick="nextStepWithBurst(5)">YES</button>
                 <button class="no-btn" onclick="nextStep(3)">NO</button>`
            );

        case 3: // Crying, Manja na
            return cardTemplate(
                images.cartoonCrying,
                "Manja na! Kitna bhav khaegi 😭",
                "Bht glt baat hai 😔",
                `<button class="yes-btn" onclick="nextStepWithBurst(5)">YES</button>
                 <button class="no-btn" onclick="nextStep(4)">NO</button>`
            );

        case 4: // Runaway Prank
            return cardTemplate(
                images.devilMode,
                "Ab toh YES hi dabana padega 😈❤️",
                "Try clicking NO if you can...",
                `<button class="yes-btn" onclick="nextStepWithBurst(5)">YES</button>
                 <button class="no-btn prank-btn" id="runaway-btn">NO</button>`
            );

        // --- NEW STEP 5: Success & Transition ---
        case 5:
            return cardTemplate(
                images.kiss, // Reusing cute cat or use a love gif if available
                "<span class='anim-text heartbeat text-sparkle'>I love you too ❤️</span>",
                "<span class='anim-text anim-delay-1'>I knew you love me 😘</span>",

                `<button class="yes-btn" onclick="nextStep(6)">Next ❤️</button>`

            );

        // --- VALENTINE FLOW ---
        case 6: // Shy Panda, Ask something (Old 5)
            return cardTemplate(
                images.pandaShy,
                "Hey! I want to ask you something?",
                "Can I?",
                `<button class="yes-btn" onclick="nextStepWithBurst(7)">YES</button>
                 <button class="no-btn" onclick="handleValentineNo()">NO</button>`
            );

        case 7: // Hugging Bears, Good cutiepie (Old 6)
            return cardTemplate(
                images.bearsHugging,
                "GOOD MY CUTIEPIE 😍",
                "Most important question are you ready?? 😁",
                `<button class="yes-btn" onclick="nextStepWithBurst(8)">Yes!! 💕</button>`


            );

        case 8: // 4 Winning Options (Old 7)
            return `
            <div class="card page-enter">
                <div class="image-container">
                    <img src="${images.pandaLove}" alt="Love Panda">
                </div>
                <h1 class="heartbeat anim-text">Will you be my Valentine? 💝</h1>
                <p class="subtext anim-text anim-delay-1">Pick any option… they’re all winners 🌸</p>
                <div class="options-grid">
                    <div class="option-card" onclick="nextStepWithBurst(9)">Yesss 🥰</div>
                    <div class="option-card" onclick="nextStepWithBurst(9)">Obviously 😍</div>
                    <div class="option-card" onclick="nextStepWithBurst(9)">Of course 💖</div>
                    <div class="option-card" onclick="nextStepWithBurst(9)">Always 💕</div>
                </div>
            </div>`;

        case 9: // Multi-lang Cards (Old 8)
            return `
            <div class="card page-enter">
                <div class="btn-group" style="margin-bottom:20px;">
                     <div class="image-container" style="height:150px;">
                        <img src="${images.bouquet}" alt="Bouquet">
                     </div>
                </div>
                <h1 class="anim-text">This is for you 😍😁</h1>
                <div class="message-stack" id="msg-stack">
                    <!-- Cards injected via JS -->
                </div>
                <!-- Invisible trigger to next step after animations -->
            </div>`;

        case 10: // Final Letter (Old 9)
            return `
            <div class="card page-enter" style="max-width: 420px;">
                <h1 class="heartbeat anim-text text-sparkle">My Dearest Valentine 💕</h1>
                <div class="letter-content gentle-pulse">
                    <p>From the moment you walked into my life, everything became more beautiful.</p>
                    <br>
                    <p>Your smile lights up my darkest days, and your love makes me feel like the luckiest person in the world.</p>
                    <br>
                    <p>Every moment with you is a treasure I hold close to my heart.</p>
                    <br>
                    <p>You are my best friend, my soulmate, and my forever love.</p>
                    <br>
                    <p style="text-align:right; font-weight:800;" class="text-sparkle">Forever Yours ❤️</p>
                </div>
            </div>`;
    }
}

function attachListeners(step) {
    // Step 4: Runaway Button
    if (step === 4) {
        const noBtn = document.getElementById('runaway-btn');
        if (!noBtn) return;

        const moveBtn = () => {
            const card = document.querySelector('.card');
            // Get boundaries
            const cardRect = card.getBoundingClientRect();
            const btnRect = noBtn.getBoundingClientRect();

            // Calculate max positions (stay within card padding approx)
            // We can use simple % based on card size
            const maxTop = card.offsetHeight - 60; // button height approx
            const maxLeft = card.offsetWidth - 100; // button width approx

            const randomTop = Math.floor(Math.random() * maxTop);
            const randomLeft = Math.floor(Math.random() * maxLeft);

            noBtn.style.position = 'absolute';
            noBtn.style.top = randomTop + 'px';
            noBtn.style.left = randomLeft + 'px';
        };

        noBtn.addEventListener('mouseover', moveBtn);
        noBtn.addEventListener('touchstart', moveBtn); // Mobile support
        noBtn.addEventListener('click', moveBtn); // Fallback
    }

    // New Step 5: Auto-advance & Hearts
    if (step === 5) {
        // Auto-advance


    }

    // Step 9: Sequential Reveal (Old 8)
    if (step === 9) {
        const stack = document.getElementById('msg-stack');
        const messages = [
            "I Love You (English)",
            "میں تم سے پیار کرتا ہوں (Urdu)",
            "मैं तुमसे प्यार करता हूँ (Hindi)",
            "Je T’aime (French)",
            "Te Amo (Spanish)"
        ];

        let delay = 500;
        messages.forEach((msg, index) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.className = 'love-card';
                div.innerHTML = msg;
                stack.appendChild(div);

                // Trigger reflow/anim
                requestAnimationFrame(() => div.classList.add('visible'));

                // After last card, move to final step
                if (index === messages.length - 1) {
                    setTimeout(() => nextStep(10), 2000);
                }
            }, delay);
            delay += 1200; // 1.2s delay between cards
        });
    }

    // Step 10: Final (Hearts already running since step 5)
    // No specific listener needed unless re-triggering logic
}

function nextStep(target) {
    currentStep = target;
    render();
}

// Special Handler for Step 5 Reject
function handleValentineNo() {
    // Show alert or changing image temporarily
    // Requirement says: Show angry cat, text "How dare you", button "Go Back"
    // We can do this by injecting a temporary "Error Step"

    // Custom temp render
    const app = document.getElementById('app');
    // Using a negative index or special ID logic to not mess up main flow, 
    // but here manual injection is easier
    const tempHtml = `
    <div class="card page-enter">
        <div class="image-container">
            <img src="${images.catAngry}" alt="Angry">
        </div>
        <h1 style="color:red" class="anim-text">How Dare You! 😡</h1>
        <p class="subtext anim-text anim-delay-1">I will go back to say YES!</p>
        <button class="yes-btn" onclick="nextStep(6)">Go Back</button>
    </div>
    `;
    app.innerHTML = tempHtml;
}

function createFloatingHearts() {
    // Check if already running to avoid double interval
    if (document.querySelector('.floating-hearts')) return;

    const container = document.createElement('div');
    container.className = 'floating-hearts';
    document.body.appendChild(container);

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';

        // Random Position
        heart.style.left = Math.random() * 100 + 'vw';

        // Random Animation Duration (Slow rise)
        heart.style.animationDuration = (Math.random() * 3 + 6) + 's'; // 6-9s duration

        // Random Size
        const size = Math.random() * 1.5 + 1; // 1rem to 2.5rem
        heart.style.fontSize = size + 'rem';

        // Random Opacity
        heart.style.opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8

        container.appendChild(heart);

        // Cleanup
        setTimeout(() => heart.remove(), 9000);
    }, 400); // More frequent hearts
}

// Initialize
createFloatingHearts();
render();
