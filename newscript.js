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

    // --- 全新的层级式视图切换逻辑 ---
    // --- New Hierarchical View Switching Logic ---
    const allContentSections = document.querySelectorAll('.content-section');
    const allNavTriggers = document.querySelectorAll('.nav-link, .project-link, .back-button');
    const mainNavLinks = document.querySelectorAll('.nav-link');

    // 切换视图的函数
    function switchView(targetId) {
        // 隐藏所有内容区域
        allContentSections.forEach(section => {
            section.classList.remove('active');
        });

        // 显示目标区域
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // 更新主导航 Tab 的高亮状态
        mainNavLinks.forEach(navLink => {
            // 如果目标是项目详情页，则保持“项目”Tab高亮
            const isProjectDetail = targetId.includes('project-detail');
            const navTarget = navLink.getAttribute('data-target');
            
            if ((isProjectDetail && navTarget === 'projects') || (navTarget === targetId)) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });
    }

    //为所有导航触发器（Tab、项目链接、返回按钮）添加事件监听
    allNavTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                switchView(targetId);
            }
        });
    });

    // 初始化视图，默认显示“关于我”
    switchView('about');

})();
