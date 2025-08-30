// IIFE (Immediately Invoked Function Expression) to avoid polluting the global scope
(function() {
    // --- 互动背景效果 (代码保持不变) ---
    const canvas = document.getElementById('interactive-canvas');
    if (!canvas) { return; }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    let shapesArray;
    const mouse = { x: null, y: null, radius: (canvas.height / 100) * (canvas.width / 100) };
    window.addEventListener('mousemove', function(event) { mouse.x = event.x; mouse.y = event.y; });
    class Shape {
        constructor(x, y, directionX, directionY, size) { this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.shapeType = Math.random() > 0.5 ? 'triangle' : 'circle'; this.angle = 0; this.rotationSpeed = (Math.random() - 0.5) * 0.02; this.pushVelocityX = 0; this.pushVelocityY = 0; this.damping = 0.95; }
        draw() { ctx.beginPath(); ctx.strokeStyle = 'rgba(0, 150, 255, 0.7)'; ctx.lineWidth = 1.5; if (this.shapeType === 'circle') { ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); } else if (this.shapeType === 'triangle') { let p1 = { x: this.x + Math.cos(this.angle) * this.size, y: this.y + Math.sin(this.angle) * this.size }; let p2 = { x: this.x + Math.cos(this.angle + (2 * Math.PI / 3)) * this.size, y: this.y + Math.sin(this.angle + (2 * Math.PI / 3)) * this.size }; let p3 = { x: this.x + Math.cos(this.angle + (4 * Math.PI / 3)) * this.size, y: this.y + Math.sin(this.angle + (4 * Math.PI / 3)) * this.size }; ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.closePath(); } ctx.stroke(); }
        update() { if (this.x > canvas.width + this.size) this.x = -this.size; if (this.x < -this.size) this.x = canvas.width + this.size; if (this.y > canvas.height + this.size) this.y = -this.size; if (this.y < -this.size) this.y = canvas.height + this.size; if (mouse.x !== null) { let dx = this.x - mouse.x; let dy = this.y - mouse.y; let distance = Math.sqrt(dx * dx + dy * dy); if (distance < mouse.radius + this.size) { const forceDirectionX = dx / distance; const forceDirectionY = dy / distance; const force = (mouse.radius - distance) / mouse.radius; const pushStrength = 3; this.pushVelocityX += forceDirectionX * force * pushStrength; this.pushVelocityY += forceDirectionY * force * pushStrength; } } this.pushVelocityX *= this.damping; this.pushVelocityY *= this.damping; this.x += this.directionX + this.pushVelocityX; this.y += this.directionY + this.pushVelocityY; this.angle += this.rotationSpeed; this.draw(); }
    }
    function init() { shapesArray = []; let numberOfShapes = (canvas.height * canvas.width) / 25000; for (let i = 0; i < numberOfShapes; i++) { let size = (Math.random() * 40) + 10; let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2); let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2); let directionX = (Math.random() * 0.3) - 0.15; let directionY = (Math.random() * 0.3) - 0.15; shapesArray.push(new Shape(x, y, directionX, directionY, size)); } }
    function animate() { requestAnimationFrame(animate); ctx.clearRect(0, 0, innerWidth, innerHeight); for (let i = 0; i < shapesArray.length; i++) { shapesArray[i].update(); } }
    window.addEventListener('resize', function() { canvas.width = innerWidth; canvas.height = innerHeight; mouse.radius = (canvas.height / 100) * (canvas.width / 100); init(); });
    window.addEventListener('mouseout', function() { mouse.x = undefined; mouse.y = undefined; });
    init(); animate();

    // --- 视图切换逻辑 (已集成 History API) ---
    const allContentSections = document.querySelectorAll('.content-section');
    const allNavTriggers = document.querySelectorAll('.nav-link, .project-card-link, .back-button');
    const mainNavLinks = document.querySelectorAll('.nav-link');

    // 切换视图并更新浏览器历史记录
    function switchView(targetId, fromHistory = false) {
        allContentSections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // 更新主导航 Tab 的高亮状态
        mainNavLinks.forEach(navLink => {
            const isProjectDetail = targetId.includes('project-detail');
            const navTarget = navLink.getAttribute('data-target');
            if ((isProjectDetail && navTarget === 'projects') || (navTarget === targetId)) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });
        
        // 如果不是由 history.back() 或 forward() 触发的，则更新 URL hash
        if (!fromHistory) {
            // 使用 pushState 来创建新的历史记录
            history.pushState({ section: targetId }, '', `#${targetId}`);
        }
    }

    // 处理浏览器前进/后退事件
    function handleHistoryChange(event) {
        // event.state 可能为 null, 比如页面初次加载时
        const targetId = event.state ? event.state.section : (location.hash.substring(1) || 'about');
        switchView(targetId, true);
    }
    
    // 监听 popstate 事件 (浏览器的前进/后退按钮)
    window.addEventListener('popstate', handleHistoryChange);

    // 为所有导航触发器添加事件监听
    allNavTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                switchView(targetId);
            }
        });
    });

    // 页面加载时根据 URL hash 初始化视图
    function initializeView() {
        const initialTarget = location.hash.substring(1) || 'about';
        // 将初始状态放入历史记录中，以便后退可以回到这里
        history.replaceState({ section: initialTarget }, '', `#${initialTarget}`);
        switchView(initialTarget, true);
    }

    initializeView();

})();
