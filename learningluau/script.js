// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 为代码块添加复制功能
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制代码';
        copyButton.classList.add('copy-btn');
        copyButton.style.position = 'absolute';
        copyButton.style.top = '10px';
        copyButton.style.right = '10px';
        copyButton.style.padding = '5px 10px';
        copyButton.style.backgroundColor = '#4CAF50';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '12px';
        
        block.style.position = 'relative';
        block.appendChild(copyButton);
        
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(function() {
                copyButton.textContent = '已复制!';
                setTimeout(() => {
                    copyButton.textContent = '复制代码';
                }, 2000);
            });
        });
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // 练习答案切换
    const exerciseToggles = document.querySelectorAll('.exercise-toggle');
    exerciseToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            if (answer.style.display === 'none' || answer.style.display === '') {
                answer.style.display = 'block';
                this.textContent = '隐藏答案';
            } else {
                answer.style.display = 'none';
                this.textContent = '查看答案';
            }
        });
    });
});