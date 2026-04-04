import { useEffect, useRef } from 'react';

interface Word {
  text: string;
  value: number;
  color?: string;
}

interface WordCloudProps {
  words: Word[];
  width?: number;
  height?: number;
}

export default function WordCloud({ 
  words, 
  width = 600, 
  height = 300 
}: WordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || words.length === 0) return;

    const svg = svgRef.current;
    svg.innerHTML = '';
    
    // 简单的词云布局算法
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 80; // 增加边距，防止文字堆在一起
    
    // 根据词频排序，确保高频词更大
    const sortedWords = [...words].sort((a, b) => b.value - a.value);
    
    // 计算最大和最小词频，用于映射大小
    const maxFreq = Math.max(...words.map(w => w.value));
    const minFreq = Math.min(...words.map(w => w.value));
    
    // 增加间距控制，确保文字不重叠
    const placedWords: {x: number, y: number, size: number, text: string}[] = [];
    
    // 检查文字是否重叠的函数
    const isOverlapping = (x1: number, y1: number, size1: number, x2: number, y2: number, size2: number): boolean => {
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      return distance < (size1 + size2) * 0.8; // 增加间距因子
    };
    
    // 生成词云
    for (let i = 0; i < sortedWords.length; i++) {
      const word = sortedWords[i];
      
      // 计算字体大小（根据词频）
      const fontSize = 14 + (word.value - minFreq) / (maxFreq - minFreq) * 40; // 稍微增大基础字体
      
      // 尝试多次位置，避免重叠
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;
      
      while (!placed && attempts < maxAttempts) {
        // 随机位置，但确保在圆内
        const angle = Math.random() * Math.PI * 2;
        // 优先放置在离中心较近的位置，但避免太靠近
        const radius = (Math.sqrt(Math.random()) * 0.8 + 0.2) * maxRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // 检查是否与已放置的文字重叠
        let overlap = false;
        for (const placedWord of placedWords) {
          if (isOverlapping(x, y, fontSize, placedWord.x, placedWord.y, placedWord.size)) {
            overlap = true;
            break;
          }
        }
        
        if (!overlap) {
          // 创建文本元素
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', x.toString());
          text.setAttribute('y', y.toString());
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'middle');
          text.setAttribute('font-size', fontSize.toString());
          text.setAttribute('font-weight', (word.value > maxFreq * 0.7 ? 'bold' : 'normal'));
          text.setAttribute('fill', word.color || '#333');
          text.setAttribute('transform', `rotate(${Math.random() * 40 - 20}, ${x}, ${y})`); // 增加旋转角度范围
          text.setAttribute('opacity', '0'); // 初始透明，添加渐入动画
          text.textContent = word.text;
          
          // 添加到SVG并记录位置
          svg.appendChild(text);
          placedWords.push({x, y, size: fontSize, text: word.text});
          placed = true;
          
          // 添加渐入动画
          setTimeout(() => {
            text.setAttribute('opacity', '1');
            text.style.transition = 'opacity 0.5s ease-in-out';
          }, i * 50);
          
          // 添加悬停效果
          text.classList.add('transition-all', 'duration-300');
          text.style.cursor = 'pointer';
          text.addEventListener('mouseover', () => {
            text.setAttribute('font-size', (fontSize * 1.3).toString());
            text.setAttribute('fill', '#002060');
            text.setAttribute('z-index', '100'); // 确保悬停的文字在最上层
          });
          text.addEventListener('mouseout', () => {
            text.setAttribute('font-size', fontSize.toString());
            text.setAttribute('fill', word.color || '#333');
            text.setAttribute('z-index', '1');
          });
        }
        
        attempts++;
      }
    }
  }, [words, width, height]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
}